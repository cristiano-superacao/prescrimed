import axios from 'axios';
import crypto from 'crypto';
import { getPublicBaseUrl, toMoney } from './helpers.js';

function normalizeStatus(value) {
  const status = String(value || '').trim().toLowerCase();

  if (!status) return 'pendente';
  if (['approved', 'paid', 'succeeded', 'success', 'authorized', 'completed', 'aprovado', 'pago'].includes(status)) {
    return 'aprovado';
  }
  if (['pending', 'waiting', 'in_process', 'processing', 'open', 'created', 'pendente'].includes(status)) {
    return 'pendente';
  }
  if (['refunded', 'refund', 'chargeback', 'estornado', 'reversed'].includes(status)) {
    return 'estornado';
  }
  if (['rejected', 'failed', 'failure', 'denied', 'cancelled', 'canceled', 'recusado', 'falhou'].includes(status)) {
    return 'recusado';
  }

  if (status.includes('refund') || status.includes('chargeback')) return 'estornado';
  if (status.includes('approve') || status.includes('paid') || status.includes('success')) return 'aprovado';
  if (status.includes('reject') || status.includes('fail') || status.includes('cancel')) return 'recusado';
  return 'pendente';
}

export function getPaymentProviderConfig() {
  return {
    provider: process.env.PAYMENT_PROVIDER || process.env.CHECKOUT_PROVIDER || null,
    token: process.env.PAYMENT_PROVIDER_TOKEN || process.env.CHECKOUT_PROVIDER_TOKEN || null,
    baseUrl: (process.env.PAYMENT_PROVIDER_BASE_URL || process.env.CHECKOUT_PROVIDER_BASE_URL || '').replace(/\/$/, ''),
    checkoutPath: process.env.PAYMENT_PROVIDER_CHECKOUT_PATH || '/checkout',
    webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || null,
    strictSignature: process.env.PAYMENT_WEBHOOK_STRICT !== 'false',
    timeout: Number.parseInt(process.env.PAYMENT_PROVIDER_TIMEOUT_MS || '15000', 10),
  };
}

export function isPaymentProviderConfigured() {
  const config = getPaymentProviderConfig();
  return Boolean(config.provider && config.token && config.baseUrl);
}

function extractResponseData(data) {
  return data?.data || data?.payment || data?.checkout || data;
}

export async function createCheckoutSession({ pedido, metodo = 'pix', valor, clienteNome, metadata = {} }) {
  const config = getPaymentProviderConfig();
  const normalizedValue = toMoney(valor || pedido.total);

  if (!isPaymentProviderConfigured()) {
    return {
      provider: config.provider || 'simulacao-interna',
      externalId: `SIM-PAY-${pedido.id.slice(0, 8)}-${Date.now()}`,
      status: 'pendente',
      checkoutUrl: null,
      qrCode: null,
      pixCopiaECola: null,
      simulated: true,
      raw: {
        message: 'Provedor de pagamento não configurado. Pagamento criado em modo simulado.'
      }
    };
  }

  const webhookBaseUrl = getPublicBaseUrl();
  const payload = {
    amount: normalizedValue,
    currency: 'BRL',
    paymentMethod: metodo,
    referenceId: pedido.id,
    pedidoId: pedido.id,
    empresaId: pedido.empresaId,
    description: `Pedido ${pedido.id.slice(0, 8)} - ${clienteNome || pedido.clienteNome || 'Cliente'}`,
    customer: {
      name: clienteNome || pedido.clienteNome || pedido.paciente?.nome || 'Cliente Prescrimed'
    },
    webhookUrl: webhookBaseUrl ? `${webhookBaseUrl}/api/public/webhooks/payment` : null,
    metadata: {
      pedidoId: pedido.id,
      empresaId: pedido.empresaId,
      ...metadata
    }
  };

  const url = `${config.baseUrl}${config.checkoutPath.startsWith('/') ? config.checkoutPath : `/${config.checkoutPath}`}`;
  const response = await axios.post(url, payload, {
    timeout: config.timeout,
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Prescrimed/1.0'
    }
  });

  const data = extractResponseData(response.data);
  return {
    provider: config.provider,
    externalId: String(data?.id || data?.externalId || data?.paymentId || payload.referenceId),
    status: normalizeStatus(data?.status || data?.paymentStatus || response.data?.status),
    checkoutUrl: data?.checkoutUrl || data?.paymentUrl || data?.url || null,
    qrCode: data?.qrCode || data?.pixQrCode || null,
    pixCopiaECola: data?.pixCode || data?.copyAndPaste || null,
    simulated: false,
    raw: response.data
  };
}

function safeCompareSignature(expected, candidate) {
  const normalizedExpected = Buffer.from(expected);
  const normalizedCandidate = Buffer.from(candidate);
  if (normalizedExpected.length !== normalizedCandidate.length) return false;
  return crypto.timingSafeEqual(normalizedExpected, normalizedCandidate);
}

function normalizeSignatureHeader(headerValue) {
  return String(headerValue || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .flatMap((part) => {
      const value = part.includes('=') ? part.split('=').pop() : part;
      return value ? [value.trim()] : [];
    });
}

export function verifyPaymentWebhookSignature(rawBody, headers = {}) {
  const config = getPaymentProviderConfig();
  const providedHeader =
    headers['x-webhook-signature'] ||
    headers['x-signature'] ||
    headers['x-hub-signature-256'] ||
    headers['X-Webhook-Signature'] ||
    headers['X-Signature'] ||
    '';

  if (!config.webhookSecret) {
    return {
      verified: !config.strictSignature,
      reason: 'missing-secret'
    };
  }

  const digest = crypto.createHmac('sha256', config.webhookSecret).update(rawBody).digest('hex');
  const providedCandidates = normalizeSignatureHeader(providedHeader);
  const verified = providedCandidates.some((candidate) => safeCompareSignature(digest, candidate));

  return {
    verified,
    reason: verified ? 'ok' : 'invalid-signature',
    digest
  };
}

export function parseWebhookJson(rawBody) {
  if (Buffer.isBuffer(rawBody)) {
    const text = rawBody.toString('utf8').trim();
    return text ? JSON.parse(text) : {};
  }

  if (typeof rawBody === 'string') {
    const text = rawBody.trim();
    return text ? JSON.parse(text) : {};
  }

  return rawBody || {};
}

export function parsePaymentWebhook({ rawBody, headers = {}, parsedBody = null }) {
  const body = parsedBody || parseWebhookJson(rawBody);
  const normalizedRawBody = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(JSON.stringify(body));
  const signature = verifyPaymentWebhookSignature(normalizedRawBody, headers);
  const source = body?.data || body?.payment || body?.resource || body;
  const metadata = source?.metadata || body?.metadata || {};
  const provider = body?.provider || source?.provider || getPaymentProviderConfig().provider || 'webhook-externo';
  const eventType = body?.type || body?.event || body?.action || 'payment.updated';
  const externalId = String(source?.id || source?.externalId || source?.paymentId || body?.id || '').trim() || null;
  const pedidoId =
    metadata?.pedidoId ||
    metadata?.orderId ||
    source?.pedidoId ||
    source?.orderId ||
    source?.referenceId ||
    body?.pedidoId ||
    body?.orderId ||
    body?.referenceId ||
    null;
  const empresaId = metadata?.empresaId || source?.empresaId || body?.empresaId || null;
  const status = normalizeStatus(source?.status || body?.status || eventType);
  const valor = toMoney(source?.amount || source?.valor || source?.total || body?.amount || body?.valor);

  return {
    signature,
    provider,
    eventType,
    externalId,
    pedidoId,
    empresaId,
    status,
    valor,
    metodo: source?.paymentMethod || source?.metodo || body?.metodo || 'pix',
    metadata,
    raw: body
  };
}

export { normalizeStatus as normalizePaymentStatus };