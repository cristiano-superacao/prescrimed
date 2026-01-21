#!/usr/bin/env node
/**
 * Smoke test end-to-end (API) para módulos principais.
 *
 * NÃO coloque credenciais no código.
 * Uso:
 *   set TEST_BASE_URL=https://prescrimed-backend-production.up.railway.app
 *   set TEST_EMAIL=jeansoares@gmail.com
 *   set TEST_PASSWORD=***
 *   node scripts/smoke-modules-flow.js
 *
 * Ou no PowerShell:
 *   $env:TEST_BASE_URL='https://...'
 *   $env:TEST_EMAIL='...'
 *   $env:TEST_PASSWORD='...'
 *   node scripts/smoke-modules-flow.js
 */

const BASE_URL = (process.env.TEST_BASE_URL || process.argv[2] || '').replace(/\/$/, '');
const EMAIL = process.env.TEST_EMAIL || '';
const PASSWORD = process.env.TEST_PASSWORD || '';

if (!BASE_URL) {
  console.error('❌ Defina TEST_BASE_URL (ex: https://seu-backend.up.railway.app)');
  process.exit(2);
}
if (!EMAIL || !PASSWORD) {
  console.error('❌ Defina TEST_EMAIL e TEST_PASSWORD via variáveis de ambiente');
  process.exit(2);
}

function safeJsonStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

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

  return { res, data, url };
}

function assertOk(step, res, data) {
  if (res.ok) return;
  const hint = typeof data === 'string' ? data : safeJsonStringify(data);
  throw new Error(`${step} falhou: HTTP ${res.status} - ${hint}`);
}

function randDigits(n) {
  let out = '';
  for (let i = 0; i < n; i++) out += Math.floor(Math.random() * 10);
  return out;
}

function makeCpf() {
  // Apenas para teste: 11 dígitos pseudoaleatórios (não valida dígitos verificadores)
  return randDigits(11);
}

function isoDate(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

async function main() {
  console.log(`\n🧪 Smoke Modules Flow`);
  console.log(`🔗 Base: ${BASE_URL}`);
  console.log(`👤 Email: ${EMAIL}`);

  // 0) Health
  {
    const { res, data } = await httpJson('/health');
    assertOk('GET /health', res, data);
    console.log(`✅ /health ok (db=${data?.database || 'n/a'})`);
  }

  // 1) Login
  let token;
  let user;
  {
    const { res, data } = await httpJson('/api/auth/login', {
      method: 'POST',
      body: { email: EMAIL, senha: PASSWORD },
    });
    assertOk('POST /api/auth/login', res, data);

    token = data?.token;
    user = data?.user;

    if (!token) throw new Error('Login não retornou token');
    console.log(`✅ Login ok (role=${user?.role || 'n/a'})`);
  }

  // 2) Perfil + empresa
  let empresaId = user?.empresaId || null;
  {
    const { res, data } = await httpJson('/api/usuarios/me', { token });
    assertOk('GET /api/usuarios/me', res, data);
    empresaId = data?.empresaId || empresaId;
    console.log(`✅ /usuarios/me ok (empresaId=${empresaId || 'n/a'})`);
  }

  if (!empresaId) {
    // tenta via /empresas/me
    const { res, data } = await httpJson('/api/empresas/me', { token });
    assertOk('GET /api/empresas/me', res, data);
    empresaId = data?.id || null;
    console.log(`✅ /empresas/me ok (empresaId=${empresaId || 'n/a'})`);
  }

  if (!empresaId) {
    throw new Error('Não foi possível determinar empresaId do usuário');
  }

  // 3) Criar 3 residentes (pacientes)
  const pacientes = [];
  for (let i = 1; i <= 3; i++) {
    const payload = {
      empresaId,
      nome: `Residente Teste ${i} - ${Date.now()}`,
      cpf: makeCpf(),
      dataNascimento: isoDate(365 * (20 + i)),
      email: `residente${i}.${Date.now()}@teste.local`,
      telefone: `(11) 90000-00${i}${i}`,
      observacoes: 'Criado por smoke test',
    };

    const { res, data } = await httpJson('/api/pacientes', { method: 'POST', token, body: payload });
    assertOk(`POST /api/pacientes (${i})`, res, data);
    pacientes.push(data);
  }
  console.log(`✅ 3 residentes criados`);

  // 4) Criar um profissional por função (roles)
  // Observação: o endpoint não restringe por role no backend atual.
  // Se o usuário autenticado não for admin no frontend, isso pode não aparecer na UI, mas persistirá no DB.
  const roles = [
    'admin',
    'nutricionista',
    'atendente',
    'enfermeiro',
    'tecnico_enfermagem',
    'fisioterapeuta',
    'assistente_social',
    'auxiliar_administrativo',
  ];

  const createdUsers = [];
  for (const role of roles) {
    const payload = {
      empresaId,
      nome: `Profissional ${role} - ${Date.now()}`,
      email: `prof.${role}.${Date.now()}@teste.local`,
      senha: 'Teste@123456',
      role,
      contato: '(11) 98888-0000',
      permissoes: [],
      especialidade: role === 'nutricionista' ? 'Nutrição Clínica' : null,
      crm: role === 'nutricionista' ? null : null,
      crmUf: null,
    };

    const { res, data } = await httpJson('/api/usuarios', { method: 'POST', token, body: payload });
    assertOk(`POST /api/usuarios (${role})`, res, data);
    createdUsers.push(data);
  }
  console.log(`✅ ${createdUsers.length} profissionais criados`);

  // 5) Prescrição para o 1º residente
  let prescricao;
  {
    const pacienteId = pacientes[0]?.id;
    const payload = {
      empresaId,
      pacienteId,
      tipo: 'comum',
      observacoes: 'Prescrição gerada por smoke test',
      medicamentos: [
        { nome: 'Vitamina D', dosagem: '1000 UI', frequencia: '1x ao dia', duracao: '30 dias' },
      ],
    };
    const { res, data } = await httpJson('/api/prescricoes', { method: 'POST', token, body: payload });
    assertOk('POST /api/prescricoes', res, data);
    prescricao = data;
    console.log('✅ Prescrição criada');
  }

  // 6) Agendamento para o 1º residente
  {
    const pacienteId = pacientes[0]?.id;
    const payload = {
      empresaId,
      pacienteId,
      titulo: 'Consulta de teste',
      descricao: 'Agendamento gerado por smoke test',
      dataHora: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      duracao: 30,
      tipo: 'consulta',
      status: 'agendado',
    };

    const { res, data } = await httpJson('/api/agendamentos', { method: 'POST', token, body: payload });
    assertOk('POST /api/agendamentos', res, data);
    console.log('✅ Agendamento criado');
  }

  // 7) Estoque: adicionar medicamento + registrar movimentação
  let medicamento;
  {
    const payload = {
      empresaId,
      nome: `Dipirona ${Date.now()}`,
      quantidade: 10,
      unidade: 'cx',
      categoria: 'analgesico',
      quantidadeMinima: 2,
    };

    const { res, data } = await httpJson('/api/estoque/medicamentos', { method: 'POST', token, body: payload });
    assertOk('POST /api/estoque/medicamentos', res, data);
    medicamento = data;

    const movPayload = {
      empresaId,
      medicamentoId: data.id || data._id,
      tipo: 'saida',
      quantidade: 1,
      motivo: 'Uso em residente',
      observacao: 'Movimentação gerada por smoke test',
    };

    const movRes = await httpJson('/api/estoque/medicamentos/movimentacao', { method: 'POST', token, body: movPayload });
    assertOk('POST /api/estoque/medicamentos/movimentacao', movRes.res, movRes.data);

    console.log('✅ Estoque: item + movimentação ok');
  }

  // 8) Financeiro: registrar uma receita
  {
    const payload = {
      empresaId,
      pacienteId: pacientes[0]?.id,
      tipo: 'receita',
      descricao: 'Consulta',
      valor: 150,
      categoria: 'servicos',
      dataVencimento: new Date().toISOString().slice(0, 10),
      status: 'pago',
      formaPagamento: 'pix',
      observacoes: 'Lançamento gerado por smoke test',
    };

    const { res, data } = await httpJson('/api/financeiro', { method: 'POST', token, body: payload });
    if (!res.ok) {
      console.error('❌ POST /api/financeiro falhou:');
      console.error('Status:', res.status);
      console.error('Resposta:', data);
      console.error('Payload enviado:', payload);
    }
    assertOk('POST /api/financeiro', res, data);
    console.log('✅ Financeiro: receita criada');
  }

  // 9) Módulos específicos (podem depender do tipoSistema da empresa)
  // Casa de repouso: leitos
  try {
    const { res, data } = await httpJson('/api/casa-repouso/leitos', { method: 'POST', token, body: { empresaId, numero: `L-${Date.now()}`, status: 'livre' } });
    if (res.ok) console.log('✅ Casa de repouso: leito criado');
  } catch {
    console.log('ℹ️ Casa de repouso: ignorado (falha/indisponível)');
  }

  // Fisioterapia: sessões
  try {
    const { res } = await httpJson('/api/fisioterapia/sessoes', { method: 'POST', token, body: { empresaId, pacienteId: pacientes[0]?.id, protocolo: 'Alongamento', dataHora: new Date().toISOString(), duracao: 45 } });
    if (res.ok) console.log('✅ Fisioterapia: sessão criada');
  } catch {
    console.log('ℹ️ Fisioterapia: ignorado (falha/indisponível)');
  }

  // Petshop: pets
  try {
    const { res } = await httpJson('/api/petshop/pets', { method: 'POST', token, body: { empresaId, nome: `Pet ${Date.now()}`, especie: 'cão', raca: 'SRD', tutorNome: 'Tutor Teste' } });
    if (res.ok) console.log('✅ Petshop: pet criado');
  } catch {
    console.log('ℹ️ Petshop: ignorado (falha/indisponível)');
  }

  console.log('\n🎉 Smoke test concluído.');
  console.log('Obs: todos os registros foram gravados no banco configurado no backend (Postgres na nuvem se DATABASE_URL estiver presente).');
}

main().catch((err) => {
  console.error(`\n❌ Smoke test falhou: ${err.message}`);
  process.exit(1);
});
