import axios from 'axios';
import { toMoney } from './helpers.js';

function normalizeInvoiceStatus(value) {
  const status = String(value || '').trim().toLowerCase();

  if (!status) return 'pendente';
  if (['emitida', 'issued', 'authorized', 'authorised', 'approved', 'success'].includes(status)) return 'emitida';
  if (['queued', 'pending', 'processing', 'processando', 'pendente'].includes(status)) return 'processando';
  if (['cancelled', 'canceled', 'cancelada'].includes(status)) return 'cancelada';
  if (['rejected', 'error', 'failed', 'denied', 'rejeitada'].includes(status)) return 'rejeitada';
  return 'pendente';
}

export function getFiscalProviderConfig() {
  return {
    provider: process.env.FISCAL_PROVIDER || process.env.NF_PROVIDER || null,
    token: process.env.FISCAL_PROVIDER_TOKEN || process.env.NF_PROVIDER_TOKEN || null,
    baseUrl: (process.env.FISCAL_PROVIDER_BASE_URL || process.env.NF_PROVIDER_BASE_URL || '').replace(/\/$/, ''),
    invoicePath: process.env.FISCAL_PROVIDER_INVOICE_PATH || process.env.NF_PROVIDER_INVOICE_PATH || '/invoices',
    timeout: Number.parseInt(process.env.FISCAL_PROVIDER_TIMEOUT_MS || '20000', 10),
    ambiente: process.env.FISCAL_ENVIRONMENT || (process.env.NODE_ENV === 'production' ? 'producao' : 'homologacao')
  };
}

export function isFiscalProviderConfigured() {
  const config = getFiscalProviderConfig();
  return Boolean(config.provider && config.token && config.baseUrl);
}

function buildInvoicePayload({ pedido, itens, tipoDocumento, serie, ambiente }) {
  return {
    referenceId: pedido.id,
    pedidoId: pedido.id,
    empresaId: pedido.empresaId,
    tipoDocumento,
    serie,
    ambiente,
    customer: {
      name: pedido.clienteNome || pedido.paciente?.nome || 'Cliente Prescrimed',
    },
    totals: {
      subtotal: toMoney(pedido.subtotal),
      desconto: toMoney(pedido.desconto),
      total: toMoney(pedido.total)
    },
    items: (itens || []).map((item) => ({
      description: item.descricao,
      quantity: toMoney(item.quantidade),
      unitPrice: toMoney(item.valorUnitario),
      total: toMoney(item.total),
      type: item.tipo,
      sku: item.catalogoItem?.sku || null
    }))
  };
}

export async function issueFiscalDocument({ pedido, itens, tipoDocumento, serie = '1' }) {
  const config = getFiscalProviderConfig();
  const ambiente = config.ambiente;
  const payload = buildInvoicePayload({ pedido, itens, tipoDocumento, serie, ambiente });

  if (!isFiscalProviderConfigured()) {
    const numero = `${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
    return {
      simulated: true,
      status: 'simulada',
      provider: config.provider || 'simulacao-interna',
      numero,
      serie,
      chaveAcesso: `SIM${numero}${pedido.id.replace(/-/g, '').slice(0, 20)}`,
      xmlUrl: null,
      pdfUrl: null,
      ambiente,
      payload,
      response: {
        mode: 'simulation',
        message: 'Integração fiscal ainda não configurada. Nota registrada em modo simulado.'
      },
      emitidaEm: new Date()
    };
  }

  const url = `${config.baseUrl}${config.invoicePath.startsWith('/') ? config.invoicePath : `/${config.invoicePath}`}`;

  try {
    const response = await axios.post(url, payload, {
      timeout: config.timeout,
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Prescrimed/1.0'
      }
    });

    const data = response.data?.data || response.data?.invoice || response.data;
    const normalizedStatus = normalizeInvoiceStatus(data?.status || response.data?.status);
    return {
      simulated: false,
      status: normalizedStatus,
      provider: config.provider,
      numero: data?.number || data?.numero || `${new Date().getFullYear()}${String(Date.now()).slice(-6)}`,
      serie: data?.series || data?.serie || serie,
      chaveAcesso: data?.accessKey || data?.chaveAcesso || null,
      xmlUrl: data?.xmlUrl || data?.xml_url || null,
      pdfUrl: data?.pdfUrl || data?.pdf_url || null,
      ambiente,
      payload,
      response: response.data,
      emitidaEm: normalizedStatus === 'emitida' ? new Date() : null
    };
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    return {
      simulated: false,
      status: 'rejeitada',
      provider: config.provider,
      numero: null,
      serie,
      chaveAcesso: null,
      xmlUrl: null,
      pdfUrl: null,
      ambiente,
      payload,
      response: error.response?.data || { message },
      emitidaEm: null,
      error: message
    };
  }
}