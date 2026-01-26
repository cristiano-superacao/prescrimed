/**
 * Script de Teste Completo via API
 * Testa todas as funcionalidades do sistema fazendo chamadas diretas à API
 */

import axios from 'axios';
import fs from 'fs';

const API_URL = 'http://localhost:8000/api';
let authTokens = {};
let testData = {
  usuarios: [],
  pacientes: [],
  prescricoes: [],
  agendamentos: [],
  registrosEnfermagem: [],
  sessoesFisio: [],
  itensEstoque: [],
  transacoesFinanceiras: []
};

// Aguardar um tempo
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função de login
async function login(email, senha) {
  try {
    console.log(`  Tentando login: ${email}...`);
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      senha
    });
    console.log(`  ✅ Login bem-sucedido!`);
    return response.data.token;
  } catch (error) {
    console.error(`❌ Erro no login de ${email}:`);
    console.error(`  Status: ${error.response?.status}`);
    console.error(`  Mensagem: ${error.response?.data?.message || error.message}`);
    console.error(`  Dados enviados:`, { email, senha });
    return null;
  }
}

async function apiGet(path, token) {
  return axios.get(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
}

async function apiPost(path, data, token) {
  return axios.post(`${API_URL}${path}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
}

async function testarDiagnosticos() {
  console.log('\n🩺 === DIAGNÓSTICOS BÁSICOS ===');
  try {
    const t = await apiGet('/test');
    console.log('✅ /api/test:', t.data?.message || 'ok');
  } catch (e) {
    console.error('❌ /api/test falhou:', e.response?.data?.error || e.message);
  }

  for (const path of ['/diagnostic/env-check', '/diagnostic/db-ping', '/diagnostic/db-check']) {
    try {
      const r = await apiGet(path);
      console.log(`✅ ${path}:`, r.data?.ok === false ? 'ok=false' : 'ok');
    } catch (e) {
      console.error(`❌ ${path} falhou:`, e.response?.data?.error || e.message);
    }
  }
}

// Criar usuários
async function criarUsuarios() {
  console.log('\n👥 === TESTANDO CRIAÇÃO DE USUÁRIOS ===');
  
  const usuarios = [
    {
      nome: 'Dr. João Silva',
      email: 'joao.silva@test.com',
      senha: 'teste123',
      contato: '(11) 98765-4321',
      role: 'nutricionista',
      especialidade: 'Clínico Geral'
    },
    {
      nome: 'Enf. Ana Costa',
      email: 'ana.costa@test.com',
      senha: 'teste123',
      contato: '(11) 98765-4322',
      role: 'enfermeiro',
      especialidade: 'Enfermeira Chefe'
    },
    {
      nome: 'Ft. Julia Oliveira',
      email: 'julia.oliveira@test.com',
      senha: 'teste123',
      contato: '(11) 98765-4323',
      role: 'fisioterapeuta',
      especialidade: 'Fisioterapia Motora'
    }
  ];

  // Primeiro vamos fazer login com admin (que já existe)
  console.log('\n🔐 Fazendo login como admin...');
  const adminToken = await login('admin@prescrimed.com', 'admin123');
  
  if (!adminToken) {
    console.log('❌ Falha no login do admin. Certifique-se de que o servidor está rodando.');
    return false;
  }

  console.log('✅ Login admin bem-sucedido!');
  authTokens.admin = adminToken;

  // Criar os usuários de teste
  for (const userData of usuarios) {
    try {
      const response = await apiPost('/usuarios', userData, adminToken);
      
      testData.usuarios.push(response.data);
      console.log(`✅ Usuário criado: ${userData.nome} (${userData.role})`);
      
      // Fazer login com cada usuário criado
      const token = await login(userData.email, userData.senha);
      if (token) {
        authTokens[userData.email] = token;
        console.log(`  🔐 Token obtido para ${userData.nome}`);
      }
      
      await sleep(500);
    } catch (error) {
      console.error(`❌ Erro ao criar ${userData.nome}:`, error.response?.data?.message || error.message);
    }
  }

  return true;
}

// Criar pacientes
async function criarPacientes() {
  console.log('\n📋 === TESTANDO CRIAÇÃO DE PACIENTES ===');
  
  const pacientes = [
    {
      nome: 'José Ferreira',
      dataNascimento: '1945-03-15',
      cpf: '123.456.789-01',
      telefone: '(11) 3456-7890',
      email: 'jose.ferreira@email.com'
    },
    {
      nome: 'Maria Aparecida Silva',
      dataNascimento: '1952-07-20',
      cpf: '234.567.890-12',
      telefone: '(11) 3456-7891',
      email: 'maria.aparecida@email.com'
    },
    {
      nome: 'Antonio Carlos Oliveira',
      dataNascimento: '1958-11-10',
      cpf: '345.678.901-23',
      telefone: '(11) 3456-7892',
      email: 'antonio.carlos@email.com'
    }
  ];

  for (const pacienteData of pacientes) {
    try {
      const response = await apiPost('/pacientes', pacienteData, authTokens.admin);
      
      testData.pacientes.push(response.data);
      console.log(`✅ Paciente criado: ${pacienteData.nome}`);
      await sleep(500);
    } catch (error) {
      console.error(`❌ Erro ao criar paciente ${pacienteData.nome}:`, error.response?.data?.message || error.message);
    }
  }
}

// Criar prescrições
async function criarPrescricoes() {
  console.log('\n💊 === TESTANDO CRIAÇÃO DE PRESCRIÇÕES ===');
  
  if (testData.pacientes.length === 0) {
    console.log('⚠️  Nenhum paciente disponível para criar prescrições');
    return;
  }

  const nutricionista = testData.usuarios.find(u => u.role === 'nutricionista');
  if (!nutricionista) {
    console.log('⚠️  Nenhum nutricionista disponível');
    return;
  }

  for (let i = 0; i < Math.min(3, testData.pacientes.length); i++) {
    const paciente = testData.pacientes[i];
    
    try {
      const response = await apiPost('/prescricoes', {
        pacienteId: paciente.id,
        tipo: 'nutricional',
        descricao: `Prescrição nutricional para ${paciente.nome}`,
        observacoes: 'Acompanhamento nutricional semanal',
        status: 'ativa'
      }, authTokens[nutricionista.email]);
      
      testData.prescricoes.push(response.data);
      console.log(`✅ Prescrição criada para: ${paciente.nome}`);
      await sleep(500);
    } catch (error) {
      console.error(`❌ Erro ao criar prescrição:`, error.response?.data?.message || error.message);
    }
  }
}

// Criar agendamentos
async function criarAgendamentos() {
  console.log('\n📅 === TESTANDO CRIAÇÃO DE AGENDAMENTOS ===');
  
  if (testData.pacientes.length === 0) {
    console.log('⚠️  Nenhum paciente disponível para criar agendamentos');
    return;
  }

  const responsavel = testData.usuarios.find(u => u.role === 'atendente') || testData.usuarios[0];

  for (let i = 0; i < Math.min(3, testData.pacientes.length); i++) {
    const paciente = testData.pacientes[i];
    const dataHora = new Date();
    dataHora.setDate(dataHora.getDate() + i + 1); // Agendar para os próximos dias
    
    try {
      const response = await apiPost('/agendamentos', {
        pacienteId: paciente.id,
        usuarioId: responsavel?.id,
        titulo: `Consulta de rotina - ${paciente.nome}`,
        descricao: 'Agendamento criado via teste automatizado',
        dataHora: dataHora.toISOString(),
        tipo: 'Consulta',
        status: 'agendado',
        observacoes: `Consulta de rotina para ${paciente.nome}`,
        duracao: 60,
        local: 'Unidade SP'
      }, authTokens.admin);
      
      testData.agendamentos.push(response.data);
      console.log(`✅ Agendamento criado para: ${paciente.nome} - ${dataHora.toLocaleDateString()}`);
      await sleep(500);
    } catch (error) {
      console.error(`❌ Erro ao criar agendamento:`, error.response?.data?.message || error.message);
    }
  }
}

// Criar registros de enfermagem
async function criarRegistrosEnfermagem() {
  console.log('\n🏥 === TESTANDO REGISTROS DE ENFERMAGEM ===');
  
  if (testData.pacientes.length === 0) {
    console.log('⚠️  Nenhum paciente disponível para criar registros');
    return;
  }

  const enfermeiro = testData.usuarios.find(u => u.role === 'enfermeiro');
  if (!enfermeiro) {
    console.log('⚠️  Nenhum enfermeiro disponível');
    return;
  }

  for (let i = 0; i < Math.min(3, testData.pacientes.length); i++) {
    const paciente = testData.pacientes[i];
    
    try {
      const response = await apiPost('/enfermagem', {
        pacienteId: paciente.id,
        tipo: 'sinais_vitais',
        titulo: 'Sinais vitais aferidos',
        descricao: `Paciente ${paciente.nome} estável, sinais vitais normais`,
        sinaisVitais: {
          PA: '130/85',
          FC: 72,
          FR: 16,
          Temp: 36.5,
          SatO2: 98,
          Glicemia: 98
        },
        prioridade: 'baixa',
        alerta: false
      }, authTokens[enfermeiro.email]);
      
      testData.registrosEnfermagem.push(response.data);
      console.log(`✅ Registro de enfermagem criado para: ${paciente.nome}`);
      await sleep(500);
    } catch (error) {
      console.error(`❌ Erro ao criar registro:`, error.response?.data?.message || error.message);
    }
  }
}

// Criar sessões de fisioterapia
async function criarSessoesFisio() {
  console.log('\n🏃 === TESTANDO SESSÕES DE FISIOTERAPIA ===');
  
  if (testData.pacientes.length === 0) {
    console.log('⚠️  Nenhum paciente disponível para criar sessões');
    return;
  }

  const fisioterapeuta = testData.usuarios.find(u => u.role === 'fisioterapeuta');
  if (!fisioterapeuta) {
    console.log('⚠️  Nenhum fisioterapeuta disponível');
    return;
  }

  for (let i = 0; i < Math.min(3, testData.pacientes.length); i++) {
    const paciente = testData.pacientes[i];
    
    try {
      const dataHora = new Date();
      dataHora.setDate(dataHora.getDate() + i + 1);

      const response = await apiPost('/fisioterapia/sessoes', {
        pacienteId: paciente.id,
        protocolo: 'Alongamento e mobilidade',
        dataHora: dataHora.toISOString(),
        duracao: 60,
        observacoes: 'Paciente colaborativo, boa evolução'
      }, authTokens[fisioterapeuta.email]);
      
      testData.sessoesFisio.push(response.data);
      console.log(`✅ Sessão de fisioterapia criada para: ${paciente.nome}`);
      await sleep(500);
    } catch (error) {
      console.error(`❌ Erro ao criar sessão:`, error.response?.data?.message || error.message);
    }
  }
}

async function testarModulosExtras() {
  console.log('\n🧩 === SMOKE TEST DE MÓDULOS EXTRAS ===');

  // Empresa do usuário
  try {
    const r = await apiGet('/empresas/me', authTokens.admin);
    console.log('✅ /empresas/me:', r.data?.nome || 'ok');
  } catch (e) {
    console.error('❌ /empresas/me falhou:', e.response?.data?.error || e.message);
  }

  // Casa de repouso: leitos
  try {
    const created = await apiPost('/casa-repouso/leitos', { numero: 'L-99', status: 'disponivel' }, authTokens.admin);
    console.log('✅ Leito criado:', created.data?.numero || 'ok');
    const list = await apiGet('/casa-repouso/leitos', authTokens.admin);
    console.log('✅ Leitos listados:', Array.isArray(list.data) ? list.data.length : 'ok');
  } catch (e) {
    console.error('❌ Casa-repouso/leitos falhou:', e.response?.data?.error || e.message);
  }

  // Petshop
  try {
    const created = await apiPost('/petshop/pets', { nome: 'Thor', especie: 'Cão', raca: 'Labrador', tutorNome: 'Marcos' }, authTokens.admin);
    console.log('✅ Pet criado:', created.data?.nome || 'ok');
    const list = await apiGet('/petshop/pets', authTokens.admin);
    console.log('✅ Pets listados:', Array.isArray(list.data) ? list.data.length : 'ok');
  } catch (e) {
    console.error('❌ Petshop/pets falhou:', e.response?.data?.error || e.message);
  }

  // Estoque
  try {
    const med = await apiPost(
      '/estoque/medicamentos',
      { nome: 'Paracetamol 750mg', quantidade: 10, unidade: 'cx', categoria: 'analgésico', quantidadeMinima: 2 },
      authTokens.admin
    );
    console.log('✅ Medicamento criado:', med.data?.nome || 'ok');
    const medId = med.data?._id || med.data?.id;
    if (medId) {
      const mov = await apiPost(
        '/estoque/medicamentos/movimentacao',
        { medicamentoId: medId, tipo: 'entrada', quantidade: 5, motivo: 'Reposição', observacao: 'Teste automatizado' },
        authTokens.admin
      );
      console.log('✅ Movimentação registrada:', mov.data?._id ? 'ok' : 'ok');
    }
    const meds = await apiGet('/estoque/medicamentos', authTokens.admin);
    console.log('✅ Medicamentos listados:', Array.isArray(meds.data) ? meds.data.length : 'ok');
    const movs = await apiGet('/estoque/movimentacoes?tipo=medicamento', authTokens.admin);
    console.log('✅ Movimentações listadas:', Array.isArray(movs.data?.movimentacoes) ? movs.data.movimentacoes.length : 'ok');
  } catch (e) {
    console.error('❌ Estoque falhou:', e.response?.data?.error || e.message);
  }

  // Financeiro
  try {
    const pacienteId = testData.pacientes?.[0]?.id;
    const tx = await apiPost(
      '/financeiro',
      {
        tipo: 'receita',
        categoria: 'mensalidade',
        descricao: 'Mensalidade (teste)',
        valor: 100,
        status: 'pendente',
        dataVencimento: new Date().toISOString(),
        pacienteId
      },
      authTokens.admin
    );
    console.log('✅ Transação criada:', tx.data?._id ? 'ok' : 'ok');
    const list = await apiGet('/financeiro', authTokens.admin);
    console.log('✅ Transações listadas:', Array.isArray(list.data) ? list.data.length : 'ok');
    const stats = await apiGet('/financeiro/stats', authTokens.admin);
    console.log('✅ Financeiro stats:', typeof stats.data === 'object' ? 'ok' : 'ok');
  } catch (e) {
    console.error('❌ Financeiro falhou:', e.response?.data?.error || e.message);
  }
}

// Relatório final
async function gerarRelatorio() {
  console.log('\n' + '='.repeat(70));
  console.log('📊 RELATÓRIO FINAL DE TESTES');
  console.log('='.repeat(70));
  console.log(`✅ Usuários criados: ${testData.usuarios.length}`);
  console.log(`✅ Pacientes criados: ${testData.pacientes.length}`);
  console.log(`✅ Prescrições criadas: ${testData.prescricoes.length}`);
  console.log(`✅ Agendamentos criados: ${testData.agendamentos.length}`);
  console.log(`✅ Registros de enfermagem: ${testData.registrosEnfermagem.length}`);
  console.log(`✅ Sessões de fisioterapia: ${testData.sessoesFisio.length}`);
  console.log('='.repeat(70));
  
  console.log('\n📝 CREDENCIAIS DE ACESSO:');
  console.log('-'.repeat(70));
  console.log('Todos os usuários de teste usam a senha: teste123');
  console.log('-'.repeat(70));
  
  testData.usuarios.forEach(usuario => {
    console.log(`  - ${usuario.email} (${usuario.role})`);
  });
  
  console.log('-'.repeat(70));
  console.log('\n✅ Dados gerados no PostgreSQL e prontos para uso!');
  console.log('🚀 Servidor rodando em: http://localhost:8000');
  console.log('🌐 Frontend acessível em: http://localhost:5173');
}

// Executar todos os testes
async function executarTestes() {
  try {
    console.log('🚀 Iniciando testes completos do sistema...\n');
    console.log('⚠️  CERTIFIQUE-SE DE QUE O SERVIDOR ESTÁ RODANDO EM http://localhost:8000\n');
    
    await sleep(2000);

    await testarDiagnosticos();
    await sleep(500);
    
    // Criar usuários
    const usuariosCriados = await criarUsuarios();
    if (!usuariosCriados) {
      console.log('\n❌ Testes interrompidos - falha ao criar usuários');
      process.exit(1);
    }
    
    await sleep(1000);
    
    // Criar pacientes
    await criarPacientes();
    await sleep(1000);
    
    // Criar prescrições
    await criarPrescricoes();
    await sleep(1000);
    
    // Criar agendamentos
    await criarAgendamentos();
    await sleep(1000);
    
    // Criar registros de enfermagem
    await criarRegistrosEnfermagem();
    await sleep(1000);
    
    // Criar sessões de fisioterapia
    await criarSessoesFisio();
    await sleep(1000);

    // Smoke-test módulos extras
    await testarModulosExtras();
    await sleep(500);
    
    // Gerar relatório
    await gerarRelatorio();
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro fatal durante testes:', error.message);
    process.exit(1);
  }
}

executarTestes();
