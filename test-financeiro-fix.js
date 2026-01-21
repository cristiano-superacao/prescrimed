#!/usr/bin/env node
/**
 * Teste simples para validar correção do erro 500 no financeiro
 */

const BASE_URL = 'https://prescrimed-backend-production.up.railway.app';

async function httpJson(path, { method = 'GET', token, body } = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  return { res, data };
}

async function main() {
  console.log('🧪 Testando correção do erro 500 no financeiro...\n');

  // 1) Login
  console.log('1️⃣ Login...');
  const loginRes = await httpJson('/api/auth/login', {
    method: 'POST',
    body: { email: 'jeansoares@gmail.com', senha: '123456' }
  });

  if (!loginRes.res.ok) {
    console.error('❌ Login falhou:', loginRes.data);
    process.exit(1);
  }

  const token = loginRes.data.token;
  const empresaId = loginRes.data.user?.empresaId;
  console.log(`✅ Login ok (empresaId=${empresaId})\n`);

  // 2) Criar movimentação financeira
  console.log('2️⃣ Criando movimentação financeira...');
  const payload = {
    empresaId,
    tipo: 'receita',
    descricao: 'Teste de correção',
    valor: 100,
    categoria: 'servicos',
    dataVencimento: new Date().toISOString().slice(0, 10),
    status: 'pago',
    formaPagamento: 'pix',
    observacoes: 'Teste de correção do erro 500'
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));

  const finRes = await httpJson('/api/financeiro', {
    method: 'POST',
    token,
    body: payload
  });

  console.log(`\nResposta: ${finRes.res.status} ${finRes.res.statusText}`);
  console.log('Dados:', JSON.stringify(finRes.data, null, 2));

  if (finRes.res.ok) {
    console.log('\n✅ Sucesso! O erro 500 foi corrigido!');
    process.exit(0);
  } else {
    console.log('\n❌ Ainda há erro. Verifique os logs acima.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Erro:', err);
  process.exit(1);
});
