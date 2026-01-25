/* Teste completo Railway: health + login/registro + listagens principais */
const BASE = process.env.BASE_URL;

if (!BASE) {
  console.error('❌ BASE_URL não definida. Use: BASE_URL=https://seu-servico.up.railway.app node scripts/test-railway-full.mjs');
  process.exit(1);
}

async function fetchJson(url, opts) {
  const res = await fetch(url, opts);
  const txt = await res.text();
  let data;
  try { data = JSON.parse(txt); } catch { data = txt; }
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  console.log('🔎 BASE_URL =', BASE);
  const api = (p) => `${BASE}/api${p}`;

  // Health
  const health = await fetchJson(`${BASE}/health`);
  console.log('🩺 /health:', health.status, health.data);

  // Tentar login com admin demo
  let token = null;
  let userEmail = 'jeansoares@gmail.com';
  let userPass = '123456';

  const login1 = await fetchJson(api('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail, senha: userPass })
  });
  if (!login1.ok) {
    console.log('ℹ️ Login demo falhou, tentando registro de empresa + admin...');
    const register = await fetchJson(api('/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeEmpresa: 'Clínica Demo',
        tipoSistema: 'casa-repouso',
        cnpj: '12345678000199',
        nomeAdmin: 'Jean Soares',
        email: userEmail,
        senha: userPass,
        cpf: '12345678900',
        contato: '(71) 99658-2310'
      })
    });
    console.log('📝 /auth/register:', register.status, typeof register.data === 'object' ? 'ok' : register.data);

    const login2 = await fetchJson(api('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, senha: userPass })
    });
    if (!login2.ok) {
      console.error('❌ Login após registro falhou:', login2.status, login2.data);
      process.exit(1);
    }
    token = login2.data.token;
  } else {
    token = login1.data.token;
  }
  console.log('🔐 Login OK');

  const headers = { Authorization: `Bearer ${token}` };

  // Listagens principais
  const endpoints = [
    ['/pacientes', '👥 Pacientes'],
    ['/agendamentos', '🗓️ Agendamentos'],
    ['/prescricoes', '💊 Prescrições'],
    ['/enfermagem', '🏥 Enfermagem'],
    ['/petshop/pets', '🐾 Pets'],
    ['/fisioterapia/sessoes', '🏃 Fisio'],
    ['/estoque/itens', '📦 Estoque'],
    ['/financeiro/transacoes', '💰 Financeiro']
  ];

  for (const [path, label] of endpoints) {
    const res = await fetchJson(api(path), { headers });
    const count = Array.isArray(res.data) ? res.data.length : res.data;
    console.log(`${label}:`, res.status, count);
  }

  console.log('\n🎉 Teste completo Railway concluído.');
}

main().catch(err => { console.error('❌ Erro:', err.message); process.exit(1); });
