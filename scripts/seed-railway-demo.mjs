/* Seed demo para produção: cria empresa (se não existir), paciente, prescrição, agendamento e registro de enfermagem */
const BASE = process.env.BASE_URL || process.argv[2] || 'http://localhost:8000';

// Permite passar BASE via env ou como primeiro argumento CLI.

import http from 'node:http';
import https from 'node:https';

function tryParse(txt) { try { return JSON.parse(txt); } catch { return txt; } }

async function fetchJson(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? https : http;
    const options = { method: opts.method || 'GET', headers: opts.headers || {} };
    const req = lib.request(u, options, (res) => {
      let txt = '';
      res.on('data', (chunk) => { txt += chunk; });
      res.on('end', () => resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: tryParse(txt) }));
    });
    req.on('error', reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

async function main() {
  console.log('🌱 BASE_URL =', BASE);
  const api = (p) => `${BASE}/api${p}`;

  // Health
  const health = await fetchJson(`${BASE}/health`);
  console.log('🩺 /health:', health.status, health.data);
  if (!health.ok) {
    console.error('❌ Backend não saudável para seed.');
    process.exit(1);
  }

  // Login/registro
  const email = 'admin.demo@prescrimed.com';
  const senha = 'Demo@123456';

  let login = await fetchJson(api('/auth/login'), {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });

  if (!login.ok) {
    const reg = await fetchJson(api('/auth/register'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeEmpresa: 'Casa Repouso Demo',
        tipoSistema: 'casa-repouso',
        cnpj: '11222333000144',
        nomeAdmin: 'Admin Demo',
        email, senha,
        cpf: '12345678900',
        contato: '(11) 99999-0000'
      })
    });
    console.log('📝 Registro empresa/admin:', reg.status);
    login = await fetchJson(api('/auth/login'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    if (!login.ok) { console.error('❌ Login falhou:', login.status, login.data); process.exit(1); }
  }

  const token = login.data.token;
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  // Criar paciente
  const newPaciente = await fetchJson(api('/pacientes'), {
    method: 'POST', headers,
    body: JSON.stringify({
      nome: 'Maria de Souza',
      cpf: '123.456.789-10',
      dataNascimento: '1943-05-12',
      email: 'maria.souza@example.com',
      telefone: '(11) 98888-7777',
      endereco: 'Rua das Flores, 123 - São Paulo',
      observacoes: 'Hipertensão controlada'
    })
  });
  if (!newPaciente.ok) { console.error('❌ Criar paciente:', newPaciente.status, newPaciente.data); process.exit(1); }
  const pacienteId = newPaciente.data.id;
  console.log('👥 Paciente criado:', pacienteId);

  // Criar prescrição
  const newPrescricao = await fetchJson(api('/prescricoes'), {
    method: 'POST', headers,
    body: JSON.stringify({
      pacienteId,
      tipo: 'comum',
      descricao: 'Plano medicamentoso inicial',
      medicamentos: [
        { nome: 'Losartana', dosagem: '50mg', frequencia: '2x ao dia' },
        { nome: 'Metformina', dosagem: '850mg', frequencia: '1x ao dia' }
      ],
      observacoes: 'Acompanhar pressão diariamente'
    })
  });
  if (!newPrescricao.ok) { console.error('❌ Criar prescrição:', newPrescricao.status, newPrescricao.data); process.exit(1); }
  console.log('💊 Prescrição criada:', newPrescricao.data.id);

  // Criar agendamento
  const newAgendamento = await fetchJson(api('/agendamentos'), {
    method: 'POST', headers,
    body: JSON.stringify({
      pacienteId,
      tipo: 'consulta',
      data: new Date().toISOString(),
      descricao: 'Consulta de acompanhamento',
    })
  });
  if (!newAgendamento.ok) { console.error('❌ Criar agendamento:', newAgendamento.status, newAgendamento.data); process.exit(1); }
  console.log('🗓️ Agendamento criado:', newAgendamento.data.id);

  // Criar registro de enfermagem
  const newEnfermagem = await fetchJson(api('/enfermagem'), {
    method: 'POST', headers,
    body: JSON.stringify({
      pacienteId,
      tipo: 'evolucao',
      descricao: 'Paciente apresenta boa resposta ao tratamento',
      data: new Date().toISOString()
    })
  });
  if (!newEnfermagem.ok) { console.error('❌ Criar enfermagem:', newEnfermagem.status, newEnfermagem.data); process.exit(1); }
  console.log('🏥 Registro enfermagem criado:', newEnfermagem.data.id);

  console.log('\n✅ Seed concluído com sucesso.');
}

main().catch(err => { console.error('❌ Erro:', err?.message || err); console.error(err?.stack || ''); process.exit(1); });
