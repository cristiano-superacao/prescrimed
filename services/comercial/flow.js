import { Op } from 'sequelize';
import { CatalogoItem, NotaFiscal, NotaFiscalLog, Paciente, Pagamento, Pedido, PedidoItem, sequelize } from '../../models/index.js';
import { buildOrderResponse, syncFinanceiroReceita, toMoney } from './helpers.js';
import { issueFiscalDocument } from './fiscal-provider.js';
import { createCheckoutSession, normalizePaymentStatus, parsePaymentWebhook } from './payment-provider.js';

function shouldAutoEmitInvoice() {
  return process.env.AUTO_EMIT_FISCAL_ON_PAYMENT_APPROVED !== 'false';
}

async function getPedidoDetalhado(pedidoId, empresaId, transaction) {
  return Pedido.findOne({
    where: {
      id: pedidoId,
      ...(empresaId ? { empresaId } : {})
    },
    include: [
      { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] },
      {
        model: PedidoItem,
        as: 'itens',
        include: [{ model: CatalogoItem, as: 'catalogoItem', attributes: ['id', 'nome', 'tipo', 'sku'] }]
      },
      { model: Pagamento, as: 'pagamentos' },
      { model: NotaFiscal, as: 'notasFiscais' }
    ],
    transaction
  });
}

async function appendNotaLog({ empresaId, notaFiscalId, nivel, mensagem, detalhes, transaction }) {
  return NotaFiscalLog.create({
    empresaId,
    notaFiscalId,
    nivel,
    mensagem,
    detalhes: detalhes || {}
  }, { transaction });
}

async function updatePedidoFromPagamento({ pedido, statusPagamento, metodo, transaction }) {
  const normalizedStatus = normalizePaymentStatus(statusPagamento);
  const nextPedidoPagamentoStatus = normalizedStatus === 'aprovado'
    ? 'pago'
    : normalizedStatus === 'estornado'
      ? 'estornado'
      : normalizedStatus === 'recusado'
        ? 'falhou'
        : 'pendente';

  const nextPedidoStatus = normalizedStatus === 'aprovado'
    ? (pedido.status === 'faturado' ? 'faturado' : 'pago')
    : normalizedStatus === 'estornado'
      ? 'cancelado'
      : pedido.status;

  await pedido.update({
    pagamentoStatus: nextPedidoPagamentoStatus,
    status: nextPedidoStatus
  }, { transaction });

  await syncFinanceiroReceita({
    empresaId: pedido.empresaId,
    pedido,
    metodo,
    statusPagamento: normalizedStatus,
    transaction
  });

  return normalizedStatus;
}

async function upsertPagamento({ pedido, payload, transaction }) {
  const normalizedStatus = normalizePaymentStatus(payload.status);
  const externalId = payload.externalId || null;
  const defaults = {
    empresaId: pedido.empresaId,
    pedidoId: pedido.id,
    metodo: payload.metodo || 'pix',
    gateway: payload.gateway || 'manual',
    status: normalizedStatus,
    valor: toMoney(payload.valor || pedido.total),
    externalId,
    pagoEm: normalizedStatus === 'aprovado' ? new Date() : null,
    metadados: payload.metadados || {}
  };

  if (externalId) {
    const existing = await Pagamento.findOne({
      where: { empresaId: pedido.empresaId, externalId },
      transaction
    });

    if (existing) {
      await existing.update(defaults, { transaction });
      return existing;
    }
  }

  return Pagamento.create(defaults, { transaction });
}

export async function issueInvoiceForPedido({ pedidoId, empresaId, requestData = {}, trigger = 'manual' }) {
  const pedido = await getPedidoDetalhado(pedidoId, empresaId);
  if (!pedido) {
    throw new Error('Pedido não encontrado');
  }

  const existingInvoice = await NotaFiscal.findOne({
    where: {
      pedidoId: pedido.id,
      empresaId: pedido.empresaId,
      status: { [Op.in]: ['pendente', 'processando', 'emitida', 'simulada'] }
    },
    order: [['createdAt', 'DESC']]
  });

  if (existingInvoice && requestData.force !== true) {
    return {
      nota: existingInvoice,
      duplicate: true,
      error: null
    };
  }

  const hasServico = (pedido.itens || []).some((item) => item.tipo === 'servico');
  const tipoDocumento = requestData.tipoDocumento || (hasServico ? 'nfs-e' : 'nf-e');
  const serie = requestData.serie || '1';
  const providerResult = await issueFiscalDocument({
    pedido,
    itens: pedido.itens || [],
    tipoDocumento,
    serie
  });

  const transaction = await sequelize.transaction();
  try {
    const nota = await NotaFiscal.create({
      empresaId: pedido.empresaId,
      pedidoId: pedido.id,
      tipoDocumento,
      status: providerResult.status,
      numero: providerResult.numero,
      serie: providerResult.serie,
      chaveAcesso: providerResult.chaveAcesso,
      provedor: providerResult.provider,
      ambiente: providerResult.ambiente,
      xmlUrl: providerResult.xmlUrl,
      pdfUrl: providerResult.pdfUrl,
      payload: providerResult.payload,
      resposta: providerResult.response,
      emitidaEm: providerResult.emitidaEm
    }, { transaction });

    await appendNotaLog({
      empresaId: pedido.empresaId,
      notaFiscalId: nota.id,
      nivel: providerResult.error ? 'error' : providerResult.simulated ? 'warning' : 'info',
      mensagem: providerResult.error
        ? `Falha ao integrar com provedor fiscal: ${providerResult.error}`
        : providerResult.simulated
          ? 'Nota gerada em modo simulado.'
          : `Nota encaminhada ao provedor ${providerResult.provider}.`,
      detalhes: {
        trigger,
        pedidoId: pedido.id,
        tipoDocumento,
        providerResult: providerResult.response
      },
      transaction
    });

    if (['emitida', 'simulada', 'processando', 'pendente'].includes(providerResult.status) && pedido.status !== 'cancelado') {
      await pedido.update({ status: 'faturado' }, { transaction });
    }

    await transaction.commit();
    return {
      nota,
      duplicate: false,
      error: providerResult.error || null
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function registerPaymentForPedido({ pedidoId, empresaId, payload = {}, source = 'manual' }) {
  const transaction = await sequelize.transaction();
  try {
    const pedido = await getPedidoDetalhado(pedidoId, empresaId, transaction);
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    let checkout = null;
    const shouldCreateCheckout = payload.iniciarCheckout === true || payload.gateway === 'externo';

    if (shouldCreateCheckout) {
      checkout = await createCheckoutSession({
        pedido,
        metodo: payload.metodo || 'pix',
        valor: payload.valor || pedido.total,
        clienteNome: payload.clienteNome || pedido.clienteNome || pedido.paciente?.nome,
        metadata: payload.metadados || {}
      });
    }

    const pagamento = await upsertPagamento({
      pedido,
      payload: {
        ...payload,
        status: checkout?.status || payload.status || 'pendente',
        gateway: checkout?.provider || payload.gateway || 'manual',
        externalId: checkout?.externalId || payload.externalId || null,
        valor: payload.valor || pedido.total,
        metadados: {
          ...(payload.metadados || {}),
          ...(checkout ? { checkout } : {}),
          source,
        }
      },
      transaction
    });

    const normalizedStatus = await updatePedidoFromPagamento({
      pedido,
      statusPagamento: pagamento.status,
      metodo: pagamento.metodo,
      transaction
    });

    await transaction.commit();

    let notaFiscal = null;
    if (normalizedStatus === 'aprovado' && shouldAutoEmitInvoice()) {
      const emissionResult = await issueInvoiceForPedido({
        pedidoId: pedido.id,
        empresaId: pedido.empresaId,
        requestData: {},
        trigger: `payment:${source}`
      });
      notaFiscal = emissionResult.nota;
    }

    return {
      pedido: await buildOrderResponse(pedido.id, pedido.empresaId),
      pagamento,
      checkout,
      notaFiscal
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function handlePaymentWebhook({ rawBody, headers = {}, parsedBody = null }) {
  const event = parsePaymentWebhook({ rawBody, headers, parsedBody });
  if (!event.signature.verified) {
    throw new Error(`Assinatura do webhook inválida (${event.signature.reason || 'unknown'})`);
  }

  if (!event.externalId && !event.pedidoId) {
    return {
      acknowledged: true,
      ignored: true,
      reason: 'Evento sem externalId e sem pedidoId.'
    };
  }

  const transaction = await sequelize.transaction();
  try {
    let pagamento = null;
    if (event.externalId) {
      pagamento = await Pagamento.findOne({
        where: { externalId: event.externalId },
        transaction
      });
    }

    let pedido = null;
    if (pagamento) {
      pedido = await getPedidoDetalhado(pagamento.pedidoId, pagamento.empresaId, transaction);
    } else if (event.pedidoId) {
      pedido = await getPedidoDetalhado(event.pedidoId, event.empresaId, transaction);
    }

    if (!pedido) {
      throw new Error('Pedido do webhook não encontrado');
    }

    if (!pagamento) {
      pagamento = await upsertPagamento({
        pedido,
        payload: {
          status: event.status,
          valor: event.valor || pedido.total,
          metodo: event.metodo,
          gateway: event.provider,
          externalId: event.externalId,
          metadados: {
            webhookEvent: event.eventType,
            metadata: event.metadata,
            raw: event.raw,
            source: 'webhook'
          }
        },
        transaction
      });
    } else {
      await pagamento.update({
        status: event.status,
        valor: event.valor || pagamento.valor,
        metodo: event.metodo || pagamento.metodo,
        gateway: event.provider || pagamento.gateway,
        pagoEm: event.status === 'aprovado' ? new Date() : pagamento.pagoEm,
        metadados: {
          ...(pagamento.metadados || {}),
          webhookEvent: event.eventType,
          metadata: event.metadata,
          raw: event.raw,
          source: 'webhook'
        }
      }, { transaction });
    }

    const normalizedStatus = await updatePedidoFromPagamento({
      pedido,
      statusPagamento: event.status,
      metodo: pagamento.metodo,
      transaction
    });

    await transaction.commit();

    let notaFiscal = null;
    if (normalizedStatus === 'aprovado' && shouldAutoEmitInvoice()) {
      const emissionResult = await issueInvoiceForPedido({
        pedidoId: pedido.id,
        empresaId: pedido.empresaId,
        requestData: {},
        trigger: 'payment:webhook'
      });
      notaFiscal = emissionResult.nota;
    }

    return {
      acknowledged: true,
      ignored: false,
      pedidoId: pedido.id,
      pagamentoId: pagamento.id,
      status: event.status,
      notaFiscalId: notaFiscal?.id || null
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}