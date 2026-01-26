/* Smoke test Railway: health + login + lista pacientes */
const BASE = process.env.BASE_URL;

if (!BASE) {
  console.error('❌ BASE_URL não definida. Use: BASE_URL=https://seu-servico.up.railway.app node scripts/smoke-railway.mjs');
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

  // Health
  const health = await fetchJson(`${BASE}/health`);
  console.log('🩺 /health:', health.status, health.data);

  for (const path of ['/api/test', '/api/diagnostic/env-check', '/api/diagnostic/db-ping', '/api/diagnostic/db-check']) {
    const r = await fetchJson(`${BASE}${path}`);
    console.log(`🧪 ${path}:`, r.status, typeof r.data === 'object' ? (r.data.ok ?? 'ok') : r.data);
  }

  // Login admin
  const login = await fetchJson(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@prescrimed.com', senha: 'admin123' })
  });
  if (!login.ok) {
    console.error('❌ Login falhou:', login.status, login.data);
    process.exit(1);
  }
  const token = login.data.token;
  console.log('🔐 Login OK');

  const headers = { Authorization: `Bearer ${token}` };

  // Listagens (somente leitura)
  const endpoints = [
    ['/pacientes', '👥 Pacientes'],
    ['/agendamentos', '🗓️ Agendamentos'],
    ['/prescricoes', '💊 Prescrições'],
    ['/enfermagem', '🏥 Enfermagem'],
    ['/fisioterapia/sessoes', '🏃 Fisio'],
    ['/estoque/medicamentos', '📦 Estoque (Medicamentos)'],
    ['/estoque/alimentos', '🥫 Estoque (Alimentos)'],
    ['/estoque/movimentacoes', '🔁 Estoque (Movimentações)'],
    ['/financeiro', '💰 Financeiro'],
    ['/financeiro/stats', '📊 Financeiro (Stats)'],
    ['/petshop/pets', '🐾 Pets']
  ];

  for (const [path, label] of endpoints) {
    const res = await fetchJson(`${BASE}/api${path}`, { headers });
    const count = Array.isArray(res.data) ? res.data.length : res.data;
    console.log(`${label}:`, res.status, count);
  }

  console.log('\n🎉 Smoke Railway concluído.');
}

main().catch(err => { console.error('❌ Erro:', err.message); process.exit(1); });
