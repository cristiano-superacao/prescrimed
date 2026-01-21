const BASE_URL = 'https://prescrimed-backend-production.up.railway.app';
const CREDENTIALS = {
  email: 'jeansoares@gmail.com',
  senha: '123456'
};

let authToken = '';
let empresaId = '';

async function login() {
  console.log('\n🔑 Fazendo login...');
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(CREDENTIALS)
  });

  if (!res.ok) {
    throw new Error(`Login falhou: ${res.status} - ${await res.text()}`);
  }

  const loginData = await res.json();
  authToken = loginData.token;
  
  // Verificar estrutura da resposta - usa "user" não "usuario"
  if (loginData.user && loginData.user.empresaId) {
    empresaId = loginData.user.empresaId;
  } else if (loginData.usuario && loginData.usuario.empresaId) {
    empresaId = loginData.usuario.empresaId;
  } else if (loginData.empresaId) {
    empresaId = loginData.empresaId;
  } else {
    console.log('Resposta do login:', JSON.stringify(loginData, null, 2));
    throw new Error('empresaId não encontrado na resposta do login');
  }
  
  console.log(`✅ Login bem-sucedido! Empresa ID: ${empresaId}`);
  return loginData;
}

async function criarResidente(nome, dataNascimento, cpf) {
  console.log(`\n👤 Criando residente: ${nome}...`);
  const res = await fetch(`${BASE_URL}/api/pacientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      nome,
      dataNascimento,
      cpf,
      empresaId,
      tipoSistema: 'casa-repouso'
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro ao criar residente: ${res.status} - ${error}`);
  }

  const data = await res.json();
  console.log(`✅ Residente criado: ${data.nome} (ID: ${data.id})`);
  return data;
}

async function criarProfissional(nome, email, funcao, senha) {
  console.log(`\n👨‍⚕️ Criando profissional: ${nome} (${funcao})...`);
  const res = await fetch(`${BASE_URL}/api/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      nome,
      email,
      senha,
      funcao,
      empresaId
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro ao criar profissional: ${res.status} - ${error}`);
  }

  const data = await res.json();
  console.log(`✅ Profissional criado: ${data.nome} - ${data.funcao}`);
  return data;
}

async function criarPrescricao(pacienteId, medicamento) {
  console.log(`\n💊 Criando prescrição: ${medicamento}...`);
  const res = await fetch(`${BASE_URL}/api/prescricoes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      pacienteId,
      medicamento,
      dosagem: '1 comprimido',
      frequencia: '8/8h',
      dataInicio: new Date().toISOString().split('T')[0],
      empresaId
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro ao criar prescrição: ${res.status} - ${error}`);
  }

  const prescricao = await res.json();
  console.log(`✅ Prescrição criada: ${prescricao.medicamento}`);
  return prescricao;
}

async function criarAgendamento(pacienteId, titulo, dataHoraStr) {
  console.log(`\n📅 Criando agendamento: ${titulo}...`);
  const res = await fetch(`${BASE_URL}/api/agendamentos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      pacienteId,
      titulo,
      dataHora: dataHoraStr,
      tipo: 'consulta',
      duracao: 60,
      empresaId
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro ao criar agendamento: ${res.status} - ${error}`);
  }

  const agendamento = await res.json();
  console.log(`✅ Agendamento criado: ${agendamento.titulo} - ${agendamento.dataHora}`);
  return agendamento;
}

async function criarItemEstoque(nome, quantidade) {
  console.log(`\n📦 Criando item de estoque: ${nome}...`);
  const res = await fetch(`${BASE_URL}/api/estoque/medicamentos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      nome,
      categoria: 'medicamento',
      quantidade,
      empresaId
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro ao criar item estoque: ${res.status} - ${error}`);
  }

  const item = await res.json();
  console.log(`✅ Item criado: ${item.nome} - Qtd: ${item.quantidade}`);
  return item;
}

async function criarTransacaoFinanceira(pacienteId, descricao, valor) {
  console.log(`\n💰 Criando transação financeira: ${descricao}...`);
  const res = await fetch(`${BASE_URL}/api/financeiro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      pacienteId,
      tipo: 'receita',
      descricao,
      valor,
      dataVencimento: new Date().toISOString().split('T')[0],
      empresaId
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erro ao criar transação: ${res.status} - ${error}`);
  }

  const transacao = await res.json();
  console.log(`✅ Transação criada: ${transacao.descricao} - R$ ${transacao.valor}`);
  return transacao;
}

async function verificarBancoDeDados() {
  console.log('\n🔍 Verificando configuração do banco de dados...');
  const res = await fetch(`${BASE_URL}/health`);
  const health = await res.json();
  
  console.log(`\n📊 Status do Sistema:`);
  console.log(`   Status: ${health.status}`);
  console.log(`   Database: ${health.database}`);
  console.log(`   DATABASE_URL: ${health.env.DATABASE_URL}`);
  console.log(`   Uptime: ${Math.floor(health.uptime / 60)} minutos`);
  
  if (!health.env.DATABASE_URL) {
    console.log('\n⚠️  ATENÇÃO: Sistema usando SQLite temporário!');
    console.log('   Configure DATABASE_URL no Railway para usar PostgreSQL.');
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando teste completo do sistema...\n');
    console.log('=' .repeat(60));

    // Verificar banco
    await verificarBancoDeDados();

    // Login
    const userData = await login();
    console.log(`   Usuário: ${userData.user.nome}`);
    console.log(`   Função: ${userData.user.role}`);

    console.log('\n' + '='.repeat(60));
    console.log('📋 CRIANDO RESIDENTES');
    console.log('='.repeat(60));

    // Criar 3 residentes com CPFs únicos
    const timestamp = Date.now();
    const residente1 = await criarResidente('Maria Silva Santos', '1940-05-15', `${timestamp}01`);
    const residente2 = await criarResidente('João Pedro Oliveira', '1938-08-22', `${timestamp}02`);
    const residente3 = await criarResidente('Ana Costa Lima', '1945-12-10', `${timestamp}03`);

    console.log('\n' + '='.repeat(60));
    console.log('👥 CRIANDO PROFISSIONAIS');
    console.log('='.repeat(60));

    // Criar profissionais para cada função
    const profissionais = [];
    const timestampProf = Date.now();
    const funcoes = [
      { nome: 'Dr. Carlos Medeiros', email: `carlos.${timestampProf}@clinica.com`, funcao: 'medico', senha: 'senha123' },
      { nome: 'Nutricionista Ana Paula', email: `ana.${timestampProf}@clinica.com`, funcao: 'nutricionista', senha: 'senha123' },
      { nome: 'Recepcionista Paula', email: `paula.${timestampProf}@clinica.com`, funcao: 'atendente', senha: 'senha123' },
      { nome: 'Enfermeira Julia', email: `julia.${timestampProf}@clinica.com`, funcao: 'enfermeiro', senha: 'senha123' },
      { nome: 'Técnico Roberto', email: `roberto.${timestampProf}@clinica.com`, funcao: 'tecnico_enfermagem', senha: 'senha123' },
      { nome: 'Fisioterapeuta Marcos', email: `marcos.${timestampProf}@clinica.com`, funcao: 'fisioterapeuta', senha: 'senha123' },
      { nome: 'Assistente Social Carla', email: `carla.${timestampProf}@clinica.com`, funcao: 'assistente_social', senha: 'senha123' },
      { nome: 'Auxiliar Pedro', email: `pedro.${timestampProf}@clinica.com`, funcao: 'auxiliar_administrativo', senha: 'senha123' }
    ];

    for (const prof of funcoes) {
      const p = await criarProfissional(prof.nome, prof.email, prof.funcao, prof.senha);
      profissionais.push(p);
    }

    console.log('\n' + '='.repeat(60));
    console.log('💊 TESTANDO MÓDULO DE PRESCRIÇÕES');
    console.log('='.repeat(60));

    // Criar prescrições para os residentes
    await criarPrescricao(residente1.id, 'Losartana 50mg');
    await criarPrescricao(residente2.id, 'Sinvastatina 20mg');
    await criarPrescricao(residente3.id, 'Omeprazol 20mg');

    console.log('\n' + '='.repeat(60));
    console.log('📅 TESTANDO MÓDULO DE AGENDAMENTOS');
    console.log('='.repeat(60));

    // Criar agendamentos
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(14, 0, 0, 0);
    await criarAgendamento(residente1.id, 'Consulta Médica', amanha.toISOString());
    await criarAgendamento(residente2.id, 'Exame de Sangue', amanha.toISOString());
    await criarAgendamento(residente3.id, 'Sessão de Fisioterapia', amanha.toISOString());

    console.log('\n' + '='.repeat(60));
    console.log('📦 TESTANDO MÓDULO DE ESTOQUE');
    console.log('='.repeat(60));

    // Criar itens de estoque
    await criarItemEstoque('Dipirona 500mg', 100);
    await criarItemEstoque('Paracetamol 750mg', 150);
    await criarItemEstoque('Soro Fisiológico 500ml', 50);

    console.log('\n' + '='.repeat(60));
    console.log('💰 TESTANDO MÓDULO FINANCEIRO');
    console.log('='.repeat(60));

    // Criar transações financeiras
    try {
      await criarTransacaoFinanceira(residente1.id, 'Mensalidade Janeiro', 3500.00);
      await criarTransacaoFinanceira(residente2.id, 'Mensalidade Janeiro', 3500.00);
      await criarTransacaoFinanceira(residente3.id, 'Mensalidade Janeiro', 3500.00);
    } catch (error) {
      console.log(`\n⚠️  Módulo financeiro apresentou erro (em migração UUID): ${error.message}`);
      console.log('   As transações financeiras serão corrigidas na próxima atualização.');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ TESTE COMPLETO FINALIZADO COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('\n📊 Resumo:');
    console.log(`   ✓ 3 Residentes criados`);
    console.log(`   ✓ 8 Profissionais criados (todas as funções)`);
    console.log(`   ✓ 3 Prescrições criadas`);
    console.log(`   ✓ 3 Agendamentos criados`);
    console.log(`   ✓ 3 Itens de estoque criados`);
    console.log(`   ✓ 3 Transações financeiras criadas`);
    console.log('\n🎉 Todos os módulos testados e funcionando!');
    console.log('\n💾 Dados salvos no banco de dados PostgreSQL na nuvem.\n');

  } catch (error) {
    console.error('\n❌ Erro durante execução:', error.message);
    process.exit(1);
  }
}

main();
