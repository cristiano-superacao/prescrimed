import express from 'express';
import { Op } from 'sequelize';
import {
  sequelize,
  CatalogoItem,
  Pedido,
  PedidoItem,
  Pagamento,
  NotaFiscal,
  NotaFiscalLog,
  Paciente,
  FinanceiroTransacao,
} from '../models/index.js';

const router = express.Router();

function getEmpresaId(req) {
  return req.query?.empresaId || req.body?.empresaId || req.tenantEmpresaId || req.user?.empresaId || null;
}

function toMoney(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Number(number.toFixed(2)) : 0;
}

function buildFiscalReadiness() {
  const fiscalProvider = process.env.FISCAL_PROVIDER || process.env.NF_PROVIDER || null;
  const fiscalConfigured = Boolean(
    fiscalProvider &&
    (process.env.FISCAL_PROVIDER_TOKEN || process.env.NF_PROVIDER_TOKEN) &&
    (process.env.FISCAL_PROVIDER_BASE_URL || process.env.NF_PROVIDER_BASE_URL)
  );

  const paymentProvider = process.env.PAYMENT_PROVIDER || process.env.CHECKOUT_PROVIDER || null;
  const paymentConfigured = Boolean(
    paymentProvider && (process.env.PAYMENT_PROVIDER_TOKEN || process.env.CHECKOUT_PROVIDER_TOKEN)
  );

  return {
    fiscal: {
      provider: fiscalProvider,
      configured: fiscalConfigured,
      cityCode: process.env.NFSE_CITY_CODE || null,
      certificateConfigured: Boolean(process.env.NFE_CERTIFICATE_BASE64 || process.env.A1_CERTIFICATE_BASE64)
    },
    payment: {
      provider: paymentProvider,
      configured: paymentConfigured,
    },
    nextStep: fiscalConfigured
      ? 'Conectar envio real de XML e retorno do provedor fiscal.'
      : 'Configurar provedor fiscal REST e credenciais para sair do modo simulado.'
  };
}

async function buildOrderResponse(id, empresaId) {
  const where = { id };
  if (empresaId) where.empresaId = empresaId;

  const pedido = await Pedido.findOne({
    where,
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
    order: [
      [{ model: PedidoItem, as: 'itens' }, 'createdAt', 'ASC'],
      [{ model: Pagamento, as: 'pagamentos' }, 'createdAt', 'DESC'],
      [{ model: NotaFiscal, as: 'notasFiscais' }, 'createdAt', 'DESC']
    ]
  });

  if (!pedido) return null;
  const json = pedido.toJSON();
  return {
    ...json,
    subtotal: toMoney(json.subtotal),
    desconto: toMoney(json.desconto),
    total: toMoney(json.total),
    itens: (json.itens || []).map((item) => ({
      ...item,
      quantidade: toMoney(item.quantidade),
      valorUnitario: toMoney(item.valorUnitario),
      total: toMoney(item.total)
    })),
    pagamentos: (json.pagamentos || []).map((pagamento) => ({
      ...pagamento,
      valor: toMoney(pagamento.valor)
    }))
  };
}

async function syncFinanceiroReceita({ empresaId, pedido, metodo, statusPagamento, transaction }) {
  const descricao = `Pedido ${pedido.id.slice(0, 8)} - ${pedido.clienteNome || pedido.paciente?.nome || 'Cliente'}`;
  const [registro] = await FinanceiroTransacao.findOrCreate({
    where: {
      empresaId,
      categoria: 'vendas',
      descricao
    },
    defaults: {
      empresaId,
      pacienteId: pedido.pacienteId || null,
      tipo: 'receita',
      categoria: 'vendas',
      descricao,
      valor: pedido.total,
      dataVencimento: new Date(),
      dataPagamento: statusPagamento === 'aprovado' ? new Date() : null,
      status: statusPagamento === 'aprovado' ? 'pago' : 'pendente',
      formaPagamento: metodo,
      observacoes: 'Gerado automaticamente a partir do módulo comercial.'
    },
    transaction
  });

  await registro.update({
    valor: pedido.total,
    dataPagamento: statusPagamento === 'aprovado' ? new Date() : null,
    status: statusPagamento === 'aprovado' ? 'pago' : 'pendente',
    formaPagamento: metodo || registro.formaPagamento,
    pacienteId: pedido.pacienteId || null,
  }, { transaction });
}

router.get('/overview', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    const where = empresaId ? { empresaId } : {};
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const [catalogoTotal, produtosAtivos, servicosAtivos, estoqueCritico, pedidosAbertos, notasPendentes, notasEmitidas, pedidosMes] = await Promise.all([
      CatalogoItem.count({ where: { ...where, ativo: true } }),
      CatalogoItem.count({ where: { ...where, ativo: true, tipo: 'produto' } }),
      CatalogoItem.count({ where: { ...where, ativo: true, tipo: 'servico' } }),
      CatalogoItem.count({
        where: {
          ...where,
          tipo: 'produto',
          ativo: true,
          [Op.and]: [sequelize.where(sequelize.col('estoqueAtual'), '<=', sequelize.col('estoqueMinimo'))]
        }
      }),
      Pedido.count({ where: { ...where, status: { [Op.in]: ['aberto', 'pago'] } } }),
      NotaFiscal.count({ where: { ...where, status: { [Op.in]: ['pendente', 'processando', 'rejeitada'] } } }),
      NotaFiscal.count({ where: { ...where, status: { [Op.in]: ['emitida', 'simulada'] } } }),
      Pedido.findAll({
        where: { ...where, createdAt: { [Op.gte]: inicioMes } },
        attributes: ['total', 'pagamentoStatus'],
        raw: true
      })
    ]);

    const receitaMes = pedidosMes
      .filter((pedido) => pedido.pagamentoStatus === 'pago')
      .reduce((acc, pedido) => acc + toMoney(pedido.total), 0);

    const ticketMedio = pedidosMes.length > 0
      ? receitaMes / Math.max(1, pedidosMes.filter((pedido) => pedido.pagamentoStatus === 'pago').length)
      : 0;

    res.json({
      metrics: {
        catalogoTotal,
        produtosAtivos,
        servicosAtivos,
        estoqueCritico,
        pedidosAbertos,
        notasPendentes,
        notasEmitidas,
        receitaMes: toMoney(receitaMes),
        ticketMedio: toMoney(ticketMedio)
      },
      readiness: buildFiscalReadiness()
    });
  } catch (error) {
    console.error('Erro ao montar overview comercial/fiscal:', error);
    res.status(500).json({ error: 'Erro ao buscar overview comercial/fiscal' });
  }
});

router.get('/catalogo', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    const where = {};
    if (empresaId) where.empresaId = empresaId;
    if (req.query?.tipo) where.tipo = req.query.tipo;
    if (req.query?.ativo !== undefined) where.ativo = req.query.ativo === 'true';
    if (req.query?.search) {
      where[Op.or] = [
        { nome: { [Op.iLike]: `%${req.query.search}%` } },
        { categoria: { [Op.iLike]: `%${req.query.search}%` } },
        { sku: { [Op.iLike]: `%${req.query.search}%` } }
      ];
    }

    const items = await CatalogoItem.findAll({ where, order: [['updatedAt', 'DESC']] });
    res.json(items.map((item) => ({
      ...item.toJSON(),
      preco: toMoney(item.preco),
      estoqueAtual: toMoney(item.estoqueAtual),
      estoqueMinimo: toMoney(item.estoqueMinimo)
    })));
  } catch (error) {
    console.error('Erro ao listar catálogo:', error);
    res.status(500).json({ error: 'Erro ao listar catálogo' });
  }
});

router.post('/catalogo', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    if (!empresaId) return res.status(400).json({ error: 'empresaId é obrigatório' });

    const payload = {
      empresaId,
      tipo: req.body.tipo || 'produto',
      nome: req.body.nome,
      descricao: req.body.descricao || null,
      categoria: req.body.categoria || null,
      sku: req.body.sku || null,
      preco: toMoney(req.body.preco),
      estoqueAtual: req.body.tipo === 'servico' ? 0 : toMoney(req.body.estoqueAtual),
      estoqueMinimo: req.body.tipo === 'servico' ? 0 : toMoney(req.body.estoqueMinimo),
      unidade: req.body.unidade || 'un',
      ativo: req.body.ativo !== false,
      metadados: req.body.metadados || {}
    };

    if (!payload.nome) {
      return res.status(400).json({ error: 'nome é obrigatório' });
    }

    const created = await CatalogoItem.create(payload);
    res.status(201).json(created);
  } catch (error) {
    console.error('Erro ao criar item de catálogo:', error);
    res.status(500).json({ error: 'Erro ao criar item de catálogo', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

router.put('/catalogo/:id', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    const item = await CatalogoItem.findOne({ where: { id: req.params.id, ...(empresaId ? { empresaId } : {}) } });
    if (!item) return res.status(404).json({ error: 'Item não encontrado' });

    const payload = {
      tipo: req.body.tipo || item.tipo,
      nome: req.body.nome ?? item.nome,
      descricao: req.body.descricao ?? item.descricao,
      categoria: req.body.categoria ?? item.categoria,
      sku: req.body.sku ?? item.sku,
      preco: req.body.preco !== undefined ? toMoney(req.body.preco) : item.preco,
      estoqueAtual: req.body.estoqueAtual !== undefined ? toMoney(req.body.estoqueAtual) : item.estoqueAtual,
      estoqueMinimo: req.body.estoqueMinimo !== undefined ? toMoney(req.body.estoqueMinimo) : item.estoqueMinimo,
      unidade: req.body.unidade ?? item.unidade,
      ativo: req.body.ativo ?? item.ativo,
      metadados: req.body.metadados ?? item.metadados,
    };

    if (payload.tipo === 'servico') {
      payload.estoqueAtual = 0;
      payload.estoqueMinimo = 0;
    }

    await item.update(payload);
    res.json(item);
  } catch (error) {
    console.error('Erro ao atualizar item de catálogo:', error);
    res.status(500).json({ error: 'Erro ao atualizar item de catálogo' });
  }
});

router.get('/pedidos', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    const where = {};
    if (empresaId) where.empresaId = empresaId;
    if (req.query?.status) where.status = req.query.status;
    if (req.query?.pagamentoStatus) where.pagamentoStatus = req.query.pagamentoStatus;

    const pedidos = await Pedido.findAll({
      where,
      include: [
        { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] },
        { model: PedidoItem, as: 'itens', include: [{ model: CatalogoItem, as: 'catalogoItem', attributes: ['id', 'nome', 'tipo'] }] },
        { model: Pagamento, as: 'pagamentos' },
        { model: NotaFiscal, as: 'notasFiscais' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(await Promise.all(pedidos.map((pedido) => buildOrderResponse(pedido.id, empresaId))));
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
});

router.post('/pedidos', async (req, res) => {
  const empresaId = getEmpresaId(req);
  if (!empresaId) return res.status(400).json({ error: 'empresaId é obrigatório' });

  const inputItems = Array.isArray(req.body.items) ? req.body.items : [];
  if (inputItems.length === 0) {
    return res.status(400).json({ error: 'Ao menos um item é obrigatório' });
  }

  const transaction = await sequelize.transaction();
  try {
    const catalogIds = inputItems.map((item) => item.catalogoItemId).filter(Boolean);
    const catalogo = catalogIds.length > 0
      ? await CatalogoItem.findAll({ where: { id: { [Op.in]: catalogIds }, empresaId }, transaction })
      : [];

    const catalogMap = new Map(catalogo.map((item) => [item.id, item]));
    const itemsPayload = inputItems.map((item) => {
      const quantidade = Math.max(1, toMoney(item.quantidade || 1));
      const catalogItem = item.catalogoItemId ? catalogMap.get(item.catalogoItemId) : null;
      const tipo = catalogItem?.tipo || item.tipo || 'avulso';
      const valorUnitario = catalogItem ? toMoney(catalogItem.preco) : toMoney(item.valorUnitario);
      const total = toMoney(quantidade * valorUnitario);

      if (!catalogItem && !item.descricao) {
        throw new Error('Itens avulsos exigem descrição');
      }

      if (catalogItem?.tipo === 'produto' && toMoney(catalogItem.estoqueAtual) < quantidade) {
        throw new Error(`Estoque insuficiente para ${catalogItem.nome}`);
      }

      return {
        catalogoItemId: catalogItem?.id || null,
        tipo,
        descricao: catalogItem?.nome || item.descricao,
        quantidade,
        valorUnitario,
        total,
        metadados: item.metadados || {}
      };
    });

    const subtotal = itemsPayload.reduce((acc, item) => acc + item.total, 0);
    const desconto = toMoney(req.body.desconto || 0);
    const total = toMoney(Math.max(subtotal - desconto, 0));

    const pedido = await Pedido.create({
      empresaId,
      pacienteId: req.body.pacienteId || null,
      clienteNome: req.body.clienteNome || null,
      origem: req.body.origem || 'balcao',
      status: 'aberto',
      pagamentoStatus: 'pendente',
      subtotal,
      desconto,
      total,
      observacoes: req.body.observacoes || null,
      metadados: req.body.metadados || {}
    }, { transaction });

    await PedidoItem.bulkCreate(itemsPayload.map((item) => ({ ...item, pedidoId: pedido.id })), { transaction });

    for (const item of itemsPayload) {
      if (item.catalogoItemId && item.tipo === 'produto') {
        const catalogItem = catalogMap.get(item.catalogoItemId);
        await catalogItem.update({ estoqueAtual: toMoney(catalogItem.estoqueAtual) - item.quantidade }, { transaction });
      }
    }

    if (req.body.pagamento?.valor) {
      const pagamentoStatus = req.body.pagamento.status || 'pendente';
      await Pagamento.create({
        empresaId,
        pedidoId: pedido.id,
        metodo: req.body.pagamento.metodo || 'pix',
        gateway: req.body.pagamento.gateway || 'manual',
        status: pagamentoStatus,
        valor: toMoney(req.body.pagamento.valor),
        externalId: req.body.pagamento.externalId || null,
        pagoEm: pagamentoStatus === 'aprovado' ? new Date() : null,
        metadados: req.body.pagamento.metadados || {}
      }, { transaction });

      const nextPagamentoStatus = pagamentoStatus === 'aprovado' ? 'pago' : 'pendente';
      const nextStatus = pagamentoStatus === 'aprovado' ? 'pago' : 'aberto';
      await pedido.update({ pagamentoStatus: nextPagamentoStatus, status: nextStatus }, { transaction });
      await syncFinanceiroReceita({ empresaId, pedido: { ...pedido.toJSON(), total, pacienteId: req.body.pacienteId, clienteNome: req.body.clienteNome }, metodo: req.body.pagamento.metodo, statusPagamento: pagamentoStatus, transaction });
    }

    await transaction.commit();
    const created = await buildOrderResponse(pedido.id, empresaId);
    res.status(201).json(created);
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar pedido:', error);
    res.status(400).json({ error: 'Erro ao criar pedido', details: error.message });
  }
});

router.put('/pedidos/:id/status', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    const pedido = await Pedido.findOne({ where: { id: req.params.id, ...(empresaId ? { empresaId } : {}) } });
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });

    const updates = {};
    if (req.body.status) updates.status = req.body.status;
    if (req.body.pagamentoStatus) updates.pagamentoStatus = req.body.pagamentoStatus;
    if (req.body.observacoes !== undefined) updates.observacoes = req.body.observacoes;
    await pedido.update(updates);
    res.json(await buildOrderResponse(pedido.id, empresaId));
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
});

router.post('/pedidos/:id/pagamentos', async (req, res) => {
  const empresaId = getEmpresaId(req);
  const transaction = await sequelize.transaction();
  try {
    const pedido = await Pedido.findOne({ where: { id: req.params.id, ...(empresaId ? { empresaId } : {}) }, include: [{ model: Paciente, as: 'paciente', attributes: ['id', 'nome'] }], transaction });
    if (!pedido) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const status = req.body.status || 'pendente';
    const pagamento = await Pagamento.create({
      empresaId: pedido.empresaId,
      pedidoId: pedido.id,
      metodo: req.body.metodo || 'pix',
      gateway: req.body.gateway || 'manual',
      status,
      valor: toMoney(req.body.valor || pedido.total),
      externalId: req.body.externalId || null,
      pagoEm: status === 'aprovado' ? new Date() : null,
      metadados: req.body.metadados || {}
    }, { transaction });

    await pedido.update({
      pagamentoStatus: status === 'aprovado' ? 'pago' : 'pendente',
      status: status === 'aprovado' ? 'pago' : pedido.status
    }, { transaction });

    await syncFinanceiroReceita({ empresaId: pedido.empresaId, pedido, metodo: pagamento.metodo, statusPagamento: status, transaction });

    await transaction.commit();
    res.status(201).json(await buildOrderResponse(pedido.id, pedido.empresaId));
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao registrar pagamento:', error);
    res.status(400).json({ error: 'Erro ao registrar pagamento', details: error.message });
  }
});

router.get('/notas', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    const where = {};
    if (empresaId) where.empresaId = empresaId;
    if (req.query?.status) where.status = req.query.status;

    const notas = await NotaFiscal.findAll({
      where,
      include: [
        { model: Pedido, as: 'pedido', attributes: ['id', 'clienteNome', 'total', 'status', 'pagamentoStatus'] },
        { model: NotaFiscalLog, as: 'logs' }
      ],
      order: [['createdAt', 'DESC'], [{ model: NotaFiscalLog, as: 'logs' }, 'createdAt', 'DESC']]
    });

    res.json(notas.map((nota) => ({
      ...nota.toJSON(),
      pedido: nota.pedido ? { ...nota.pedido.toJSON(), total: toMoney(nota.pedido.total) } : null
    })));
  } catch (error) {
    console.error('Erro ao listar notas fiscais:', error);
    res.status(500).json({ error: 'Erro ao listar notas fiscais' });
  }
});

router.post('/pedidos/:id/nota-fiscal', async (req, res) => {
  const empresaId = getEmpresaId(req);
  const transaction = await sequelize.transaction();
  try {
    const pedido = await Pedido.findOne({
      where: { id: req.params.id, ...(empresaId ? { empresaId } : {}) },
      include: [{ model: PedidoItem, as: 'itens' }],
      transaction
    });
    if (!pedido) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const readiness = buildFiscalReadiness();
    const hasServico = (pedido.itens || []).some((item) => item.tipo === 'servico');
    const tipoDocumento = req.body.tipoDocumento || (hasServico ? 'nfs-e' : 'nf-e');
    const simulated = !readiness.fiscal.configured;
    const numero = `${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
    const nota = await NotaFiscal.create({
      empresaId: pedido.empresaId,
      pedidoId: pedido.id,
      tipoDocumento,
      status: simulated ? 'simulada' : 'pendente',
      numero,
      serie: req.body.serie || '1',
      chaveAcesso: simulated ? `SIM${numero}${pedido.id.replace(/-/g, '').slice(0, 20)}` : null,
      provedor: req.body.provedor || readiness.fiscal.provider || 'simulacao-interna',
      ambiente: req.body.ambiente || (process.env.NODE_ENV === 'production' ? 'producao' : 'homologacao'),
      payload: {
        pedidoId: pedido.id,
        total: pedido.total,
        itens: pedido.itens.map((item) => ({ descricao: item.descricao, quantidade: item.quantidade, total: item.total })),
      },
      resposta: simulated ? { mode: 'simulation', message: 'Integração fiscal ainda não configurada. Nota registrada em modo simulado.' } : { mode: 'queued', message: 'Nota aguardando integração com provedor fiscal.' },
      emitidaEm: simulated ? new Date() : null,
    }, { transaction });

    await NotaFiscalLog.create({
      empresaId: pedido.empresaId,
      notaFiscalId: nota.id,
      nivel: simulated ? 'warning' : 'info',
      mensagem: simulated ? 'Nota gerada em modo simulado.' : 'Nota registrada e pendente de integração com provedor fiscal.',
      detalhes: {
        readiness,
        pedidoId: pedido.id,
        tipoDocumento,
      }
    }, { transaction });

    await pedido.update({ status: simulated ? 'faturado' : pedido.status }, { transaction });
    await transaction.commit();

    const created = await NotaFiscal.findByPk(nota.id, {
      include: [
        { model: Pedido, as: 'pedido', attributes: ['id', 'clienteNome', 'total', 'status', 'pagamentoStatus'] },
        { model: NotaFiscalLog, as: 'logs' }
      ]
    });
    res.status(201).json(created);
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao gerar nota fiscal:', error);
    res.status(400).json({ error: 'Erro ao gerar nota fiscal', details: error.message });
  }
});

export default router;