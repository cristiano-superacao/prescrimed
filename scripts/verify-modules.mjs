/* Verifica módulos: agenda, evolução, censo MP (prescrições + pacientes), casa de repouso, petshop e fisioterapia.
   Usa login; se 401, tenta registrar empresa/admin demo e logar novamente. */

const BASE = process.env.BASE_URL || 'https://prescrimed-backend-production.up.railway.app';
const EMAIL = process.env.EMAIL || 'jeansoares@gmail.com';
const SENHA = process.env.SENHA || '123456';

async function fetchJson(url, opts={}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}

async function ensureLogin() {
  let login = await fetchJson(`${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, senha: SENHA })
  });
  if (login.ok) return login.data.token;
  console.log('ℹ️ Login falhou, tentando registrar empresa/admin demo...');
  const register = await fetchJson(`${BASE}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nomeEmpresa: 'Clínica Demo', tipoSistema: 'casa-repouso', cnpj: '12345678000199',
      nomeAdmin: 'Jean Soares', email: EMAIL, senha: SENHA, cpf: '12345678900', contato: '(71) 99658-2310'
    })
  });
  if (!register.ok) {
    throw new Error(`Registro falhou (${register.status}): ${typeof register.data==='string'?register.data:JSON.stringify(register.data)}`);
  }
  console.log('✅ Registro concluído, tentando login novamente...');
  login = await fetchJson(`${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, senha: SENHA })
  });
  if (!login.ok) throw new Error(`Login falhou (${login.status}): ${typeof login.data==='string'?login.data:JSON.stringify(login.data)}`);
  return login.data.token;
}

async function checkEndpoint(path, token) {
  const res = await fetchJson(`${BASE}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  const count = Array.isArray(res.data) ? res.data.length : (res.data && res.data.total) || res.data;
  console.log(`${res.ok?'✅':'⚠️'} ${path}:`, res.status, count);
  return res;
}

async function main() {
  console.log('🔎 BASE_URL =', BASE);
  const health = await fetchJson(`${BASE}/health`);
  console.log('🩺 /health:', health.status, health.data);

  const token = await ensureLogin();
  console.log('🔐 Login OK');

  // Módulos
  await checkEndpoint('/api/agendamentos', token);               // Agenda
  await checkEndpoint('/api/enfermagem/registros', token);       // Evolução
  await checkEndpoint('/api/casa-repouso/leitos', token);        // Casa de repouso
  await checkEndpoint('/api/petshop/pets', token);               // Petshop
  await checkEndpoint('/api/fisioterapia/sessoes', token);       // Fisioterapia
  // Censo MP depende de pacientes + prescrições
  await checkEndpoint('/api/pacientes', token);
  await checkEndpoint('/api/prescricoes', token);

  console.log('\n🎉 Verificação concluída.');
}

main().catch(err => { console.error('❌ Erro:', err.message); process.exit(1); });
