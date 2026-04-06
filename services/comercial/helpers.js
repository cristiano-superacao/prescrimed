import { CatalogoItem, FinanceiroTransacao, NotaFiscal, Paciente, Pagamento, Pedido, PedidoItem } from '../../models/index.js';

export function getEmpresaId(req) {
  return req.query?.empresaId || req.body?.empresaId || req.tenantEmpresaId || req.user?.empresaId || null;
}

export function toMoney(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Number(number.toFixed(2)) : 0;
}

export function getPublicBaseUrl() {
  const explicitBaseUrl =
    process.env.PUBLIC_BASE_URL ||
    process.env.APP_BASE_URL ||
    process.env.BACKEND_URL ||
    process.env.API_BASE_URL ||
    null;

  if (explicitBaseUrl) {
    return explicitBaseUrl.replace(/\/$/, '');
  }

  const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN || null;
  if (railwayDomain) {
    const normalizedDomain = /^https?:\/\//i.test(railwayDomain) ? railwayDomain : `https://${railwayDomain}`;
    return normalizedDomain.replace(/\/$/, '');
  }

  return null;
}

export function buildFiscalReadiness() {
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
      webhookConfigured: Boolean(getPublicBaseUrl()),
      signatureConfigured: Boolean(process.env.PAYMENT_WEBHOOK_SECRET),
    },
    nextStep: fiscalConfigured && paymentConfigured
      ? 'Validar callbacks do provedor e homologar emissão automática.'
      : 'Configurar provedor fiscal REST, pagamento e webhook público para sair do modo simulado.'
  };
}

export async function buildOrderResponse(id, empresaId) {
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

export async function syncFinanceiroReceita({ empresaId, pedido, metodo, statusPagamento, transaction }) {
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