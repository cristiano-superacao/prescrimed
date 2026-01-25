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

  const diag = await fetchJson(`${BASE}/api/diagnostic/health`);
  console.log('🩺 /api/diagnostic/health:', diag.status, diag.data);

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

  // Lista pacientes
  const pac = await fetchJson(`${BASE}/api/pacientes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('👥 Pacientes:', pac.status, Array.isArray(pac.data) ? pac.data.length : pac.data);

  console.log('\n🎉 Smoke Railway concluído.');
}

main().catch(err => { console.error('❌ Erro:', err.message); process.exit(1); });
