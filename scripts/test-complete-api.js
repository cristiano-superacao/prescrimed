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
      const response = await axios.post(`${API_URL}/usuarios`, userData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
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
      const response = await axios.post(`${API_URL}/pacientes`, pacienteData, {
        headers: { Authorization: `Bearer ${authTokens.admin}` }
      });
      
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
      const response = await axios.post(`${API_URL}/prescricoes`, {
        pacienteId: paciente.id,
        tipo: 'nutricional',
        descricao: `Prescrição nutricional para ${paciente.nome}`,
        observacoes: 'Acompanhamento nutricional semanal',
        status: 'ativa'
      }, {
        headers: { Authorization: `Bearer ${authTokens[nutricionista.email]}` }
      });
      
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

  const nutricionista = testData.usuarios.find(u => u.role === 'nutricionista');
  if (!nutricionista) {
    console.log('⚠️  Nenhum nutricionista disponível');
    return;
  }

  for (let i = 0; i < Math.min(3, testData.pacientes.length); i++) {
    const paciente = testData.pacientes[i];
    const dataHora = new Date();
    dataHora.setDate(dataHora.getDate() + i + 1); // Agendar para os próximos dias
    
    try {
      const response = await axios.post(`${API_URL}/agendamentos`, {
        pacienteId: paciente.id,
        profissionalId: nutricionista.id,
        dataHora: dataHora.toISOString(),
        tipo: 'Consulta Nutricional',
        status: 'agendado',
        observacoes: `Consulta de rotina para ${paciente.nome}`
      }, {
        headers: { Authorization: `Bearer ${authTokens.admin}` }
      });
      
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
      const response = await axios.post(`${API_URL}/enfermagem`, {
        pacienteId: paciente.id,
        tipoRegistro: 'Sinais Vitais',
        pressaoArterial: '130/85',
        frequenciaCardiaca: 72,
        temperatura: 36.5,
        saturacaoOxigenio: 98,
        observacoes: 'Paciente estável, sinais vitais normais'
      }, {
        headers: { Authorization: `Bearer ${authTokens[enfermeiro.email]}` }
      });
      
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
      const response = await axios.post(`${API_URL}/fisioterapia`, {
        pacienteId: paciente.id,
        tipo: 'Fisioterapia Motora',
        descricao: 'Exercícios de fortalecimento muscular',
        duracao: 60,
        observacoes: 'Paciente colaborativo, boa evolução',
        status: 'concluida'
      }, {
        headers: { Authorization: `Bearer ${authTokens[fisioterapeuta.email]}` }
      });
      
      testData.sessoesFisio.push(response.data);
      console.log(`✅ Sessão de fisioterapia criada para: ${paciente.nome}`);
      await sleep(500);
    } catch (error) {
      console.error(`❌ Erro ao criar sessão:`, error.response?.data?.message || error.message);
    }
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
  console.log('\n✅ Dados salvos no MySQL local e prontos para replicar na nuvem!');
  console.log('🚀 Servidor rodando em: http://localhost:8000');
  console.log('🌐 Frontend acessível em: http://localhost:5173');
}

// Executar todos os testes
async function executarTestes() {
  try {
    console.log('🚀 Iniciando testes completos do sistema...\n');
    console.log('⚠️  CERTIFIQUE-SE DE QUE O SERVIDOR ESTÁ RODANDO EM http://localhost:8000\n');
    
    await sleep(2000);
    
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
    
    // Gerar relatório
    await gerarRelatorio();
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro fatal durante testes:', error.message);
    process.exit(1);
  }
}

executarTestes();
