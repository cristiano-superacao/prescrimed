/**
 * Script de Seed Completo - Dados Reais de Teste
 * Cria usuários para cada função e realiza operações completas no sistema
 */

import 'dotenv/config';
import bcrypt from 'bcrypt';
import sequelize from '../config/database.js';
import Usuario from '../models/Usuario.js';
import Paciente from '../models/Paciente.js';
import Prescricao from '../models/Prescricao.js';
import Agendamento from '../models/Agendamento.js';
import RegistroEnfermagem from '../models/RegistroEnfermagem.js';
import SessaoFisio from '../models/SessaoFisio.js';
import EstoqueItem from '../models/EstoqueItem.js';
import EstoqueMovimentacao from '../models/EstoqueMovimentacao.js';
import FinanceiroTransacao from '../models/FinanceiroTransacao.js';
import CasaRepousoLeito from '../models/CasaRepousoLeito.js';
import Empresa from '../models/Empresa.js';

async function seedCompleteData() {
  try {
    console.log('🚀 Iniciando seed de dados completos...\n');

    // ========== LIMPEZA DO BANCO ==========
    console.log('🧹 Limpando banco de dados...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.query('TRUNCATE TABLE usuarios');
    await sequelize.query('TRUNCATE TABLE pacientes');
    await sequelize.query('TRUNCATE TABLE prescricoes');
    await sequelize.query('TRUNCATE TABLE agendamentos');
    await sequelize.query('TRUNCATE TABLE registrosenfermagem');
    await sequelize.query('TRUNCATE TABLE fisio_sessoes');
    await sequelize.query('TRUNCATE TABLE estoqueitens');
    await sequelize.query('TRUNCATE TABLE estoquemovimentacoes');
    await sequelize.query('TRUNCATE TABLE financeirotransacoes');
    await sequelize.query('TRUNCATE TABLE cr_leitos');
    await sequelize.query('TRUNCATE TABLE empresas');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Banco de dados limpo!\n');

    // ========== CRIAÇÃO DA EMPRESA ==========
    console.log('🏢 Criando empresa...');
    
    const empresa = await Empresa.create({
      nome: 'Casa de Repouso Vida Plena',
      tipoSistema: 'casa-repouso',
      cnpj: '12.345.678/0001-99',
      email: 'contato@vidaplena.com.br',
      telefone: '(11) 3456-7890',
      endereco: 'Rua das Palmeiras, 1000',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      ativo: true
    });
    
    console.log(`✅ Empresa criada: ${empresa.nome}\n`);

    // ========== CRIAÇÃO DE USUÁRIOS ==========
    console.log('👥 Criando usuários para cada função...');
    
    const senhaPadrao = await bcrypt.hash('teste123', 10);
    
    const usuarios = [
      {
        nome: 'Dr. João Silva',
        email: 'joao.silva@prescrimed.com',
        senha: senhaPadrao,
        contato: '(11) 98765-4321',
        role: 'nutricionista',
        especialidade: 'Clínico Geral',
        crm: 'CRM/SP 123456',
        crmUf: 'SP',
        empresaId: empresa.id,
        ativo: true
      },
      {
        nome: 'Dra. Maria Santos',
        email: 'maria.santos@prescrimed.com',
        senha: senhaPadrao,
        contato: '(11) 98765-4322',
        role: 'nutricionista',
        especialidade: 'Cardiologia',
        crm: 'CRM/SP 654321',
        crmUf: 'SP',
        empresaId: empresa.id,
        ativo: true
      },
      {
        nome: 'Enf. Ana Paula Costa',
        email: 'ana.costa@prescrimed.com',
        senha: senhaPadrao,
        contato: '(11) 98765-4323',
        role: 'enfermeiro',
        especialidade: 'Enfermeira Chefe',
        empresaId: empresa.id,
        ativo: true
      },
      {
        nome: 'Enf. Carlos Eduardo',
        email: 'carlos.eduardo@prescrimed.com',
        senha: senhaPadrao,
        contato: '(11) 98765-4324',
        role: 'tecnico_enfermagem',
        especialidade: 'Técnico de Enfermagem',
        empresaId: empresa.id,
        ativo: true
      },
      {
        nome: 'Ft. Juliana Oliveira',
        email: 'juliana.oliveira@prescrimed.com',
        senha: senhaPadrao,
        contato: '(11) 98765-4325',
        role: 'fisioterapeuta',
        especialidade: 'Fisioterapia Motora',
        empresaId: empresa.id,
        ativo: true
      },
      {
        nome: 'Ft. Roberto Alves',
        email: 'roberto.alves@prescrimed.com',
        senha: senhaPadrao,
        contato: '(11) 98765-4326',
        role: 'fisioterapeuta',
        especialidade: 'Fisioterapia Respiratória',
        empresaId: empresa.id,
        ativo: true
      },
      {
        nome: 'Fernanda Lima',
        email: 'fernanda.lima@prescrimed.com',
        senha: senhaPadrao,
        contato: '(11) 98765-4327',
        role: 'atendente',
        especialidade: 'Recepção',
        empresaId: empresa.id,
        ativo: true
      },
      {
        nome: 'Patricia Mendes',
        email: 'patricia.mendes@prescrimed.com',
        senha: senhaPadrao,
        contato: '(11) 98765-4328',
        role: 'auxiliar_administrativo',
        especialidade: 'Financeiro',
        empresaId: empresa.id,
        ativo: true
      },
      {
        nome: 'Ricardo Souza',
        email: 'ricardo.souza@prescrimed.com',
        senha: senhaPadrao,
        contato: '(11) 98765-4329',
        role: 'admin',
        especialidade: 'Gerente de Estoque',
        empresaId: empresa.id,
        ativo: true
      },
      {
        nome: 'Laura Martins',
        email: 'laura.martins@prescrimed.com',
        senha: senhaPadrao,
        contato: '(11) 98765-4330',
        role: 'assistente_social',
        especialidade: 'Assistente Social',
        empresaId: empresa.id,
        ativo: true
      }
    ];

    const usuariosCriados = [];
    for (const userData of usuarios) {
      const usuario = await Usuario.create(userData);
      usuariosCriados.push(usuario);
      console.log(`✅ Criado: ${usuario.nome} (${usuario.role})`);
    }

    console.log('\n📋 Criando pacientes de teste...');
    
    const pacientes = [
      {
        nome: 'José Ferreira',
        dataNascimento: '1945-03-15',
        cpf: '123.456.789-01',
        telefone: '(11) 3456-7890',
        email: 'jose.ferreira@email.com',
        endereco: 'Rua das Flores, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        convenio: 'Unimed',
        numeroConvenio: 'UNIMED123456',
        empresaId: empresa.id,
        ativo: true
      },
      {
        nome: 'Maria Aparecida Silva',
        dataNascimento: '1952-07-20',
        cpf: '234.567.890-12',
        telefone: '(11) 3456-7891',
        email: 'maria.aparecida@email.com',
        endereco: 'Av. Paulista, 1000',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100',
        convenio: 'Bradesco Saúde',
        numeroConvenio: 'BRAD789012',
        empresaId: empresa.id,
        ativo: true
      },
      {
        nome: 'Antonio Carlos Oliveira',
        dataNascimento: '1958-11-10',
        cpf: '345.678.901-23',
        telefone: '(11) 3456-7892',
        email: 'antonio.carlos@email.com',
        endereco: 'Rua Augusta, 500',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01305-000',
        convenio: 'Particular',
        numeroConvenio: null,
        empresaId: empresa.id,
        ativo: true
      },
      {
        nome: 'Rosa Maria Santos',
        dataNascimento: '1940-05-25',
        cpf: '456.789.012-34',
        telefone: '(11) 3456-7893',
        email: 'rosa.santos@email.com',
        endereco: 'Rua Consolação, 2000',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01302-000',
        convenio: 'SulAmérica',
        numeroConvenio: 'SUL456789',
        empresaId: empresa.id,
        ativo: true
      },
      {
        nome: 'Pedro Henrique Costa',
        dataNascimento: '1965-09-30',
        cpf: '567.890.123-45',
        telefone: '(11) 3456-7894',
        email: 'pedro.costa@email.com',
        endereco: 'Rua Vergueiro, 3500',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '04101-000',
        convenio: 'Unimed',
        numeroConvenio: 'UNIMED567890',
        empresaId: empresa.id,
        ativo: true
      }
    ];

    const pacientesCriados = [];
    for (const pacienteData of pacientes) {
      const paciente = await Paciente.create(pacienteData);
      pacientesCriados.push(paciente);
      console.log(`✅ Criado: ${paciente.nome}`);
    }

    // ========== PRESCRIÇÕES MÉDICAS ==========
    console.log('\n💊 Criando prescrições médicas...');
    
    const medico1 = usuariosCriados.find(u => u.email === 'joao.silva@prescrimed.com');
    const medico2 = usuariosCriados.find(u => u.email === 'maria.santos@prescrimed.com');

    const prescricoes = [
      {
        pacienteId: pacientesCriados[0].id,
        medicoId: medico1.id,
        medicamento: 'Losartana 50mg',
        dosagem: '1 comprimido',
        frequencia: '1x ao dia',
        duracao: '30 dias',
        observacoes: 'Tomar pela manhã em jejum',
        dataInicio: new Date(),
        dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'ativa'
      },
      {
        pacienteId: pacientesCriados[0].id,
        medicoId: medico1.id,
        medicamento: 'Sinvastatina 20mg',
        dosagem: '1 comprimido',
        frequencia: '1x ao dia',
        duracao: '30 dias',
        observacoes: 'Tomar à noite antes de dormir',
        dataInicio: new Date(),
        dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'ativa'
      },
      {
        pacienteId: pacientesCriados[1].id,
        medicoId: medico2.id,
        medicamento: 'AAS 100mg',
        dosagem: '1 comprimido',
        frequencia: '1x ao dia',
        duracao: 'Uso contínuo',
        observacoes: 'Proteção cardiovascular',
        dataInicio: new Date(),
        dataFim: null,
        status: 'ativa'
      },
      {
        pacienteId: pacientesCriados[2].id,
        medicoId: medico1.id,
        medicamento: 'Metformina 850mg',
        dosagem: '1 comprimido',
        frequencia: '2x ao dia',
        duracao: 'Uso contínuo',
        observacoes: 'Tomar junto com as refeições principais',
        dataInicio: new Date(),
        dataFim: null,
        status: 'ativa'
      }
    ];

    for (const prescricaoData of prescricoes) {
      const prescricao = await Prescricao.create(prescricaoData);
      console.log(`✅ Prescrição criada para paciente ID ${prescricao.pacienteId}`);
    }

    // ========== AGENDAMENTOS ==========
    console.log('\n📅 Criando agendamentos...');
    
    const recepcionista = usuariosCriados.find(u => u.role === 'atendente');

    const agendamentos = [
      {
        pacienteId: pacientesCriados[0].id,
        medicoId: medico1.id,
        dataHora: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Amanhã
        tipo: 'Consulta',
        status: 'agendado',
        observacoes: 'Consulta de rotina'
      },
      {
        pacienteId: pacientesCriados[1].id,
        medicoId: medico2.id,
        dataHora: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        tipo: 'Retorno',
        status: 'agendado',
        observacoes: 'Retorno cardiologia'
      },
      {
        pacienteId: pacientesCriados[2].id,
        medicoId: medico1.id,
        dataHora: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        tipo: 'Consulta',
        status: 'agendado',
        observacoes: 'Primeira consulta'
      }
    ];

    for (const agendamentoData of agendamentos) {
      const agendamento = await Agendamento.create(agendamentoData);
      console.log(`✅ Agendamento criado para ${new Date(agendamento.dataHora).toLocaleDateString()}`);
    }

    // ========== REGISTROS DE ENFERMAGEM ==========
    console.log('\n🏥 Criando registros de enfermagem...');
    
    const enfermeira1 = usuariosCriados.find(u => u.email === 'ana.costa@prescrimed.com');
    const enfermeiro2 = usuariosCriados.find(u => u.email === 'carlos.eduardo@prescrimed.com');

    const registrosEnfermagem = [
      {
        pacienteId: pacientesCriados[0].id,
        enfermeiroId: enfermeira1.id,
        tipoRegistro: 'Sinais Vitais',
        pressaoArterial: '130/85',
        frequenciaCardiaca: 72,
        temperatura: 36.5,
        saturacaoOxigenio: 98,
        observacoes: 'Paciente estável, sinais vitais dentro da normalidade',
        dataHora: new Date()
      },
      {
        pacienteId: pacientesCriados[1].id,
        enfermeiroId: enfermeiro2.id,
        tipoRegistro: 'Administração de Medicamento',
        medicamentoAdministrado: 'AAS 100mg',
        viaAdministracao: 'Oral',
        observacoes: 'Medicamento administrado conforme prescrição médica',
        dataHora: new Date()
      },
      {
        pacienteId: pacientesCriados[2].id,
        enfermeiroId: enfermeira1.id,
        tipoRegistro: 'Curativo',
        localCurativo: 'Membro inferior direito',
        tipoCurativo: 'Limpeza e troca de gaze',
        observacoes: 'Ferida em processo de cicatrização',
        dataHora: new Date()
      }
    ];

    for (const registroData of registrosEnfermagem) {
      const registro = await RegistroEnfermagem.create(registroData);
      console.log(`✅ Registro de enfermagem criado: ${registro.tipoRegistro}`);
    }

    // ========== SESSÕES DE FISIOTERAPIA ==========
    console.log('\n🏃 Criando sessões de fisioterapia...');
    
    const fisio1 = usuariosCriados.find(u => u.email === 'juliana.oliveira@prescrimed.com');
    const fisio2 = usuariosCriados.find(u => u.email === 'roberto.alves@prescrimed.com');

    const sessoesFisio = [
      {
        pacienteId: pacientesCriados[0].id,
        fisioterapeutaId: fisio1.id,
        dataHora: new Date(),
        tipo: 'Fisioterapia Motora',
        descricao: 'Exercícios de fortalecimento de membros inferiores',
        duracao: 60,
        observacoes: 'Paciente colaborativo, boa evolução',
        status: 'concluida'
      },
      {
        pacienteId: pacientesCriados[3].id,
        fisioterapeutaId: fisio2.id,
        dataHora: new Date(),
        tipo: 'Fisioterapia Respiratória',
        descricao: 'Exercícios de expansão pulmonar e higiene brônquica',
        duracao: 45,
        observacoes: 'Melhora significativa na saturação',
        status: 'concluida'
      },
      {
        pacienteId: pacientesCriados[4].id,
        fisioterapeutaId: fisio1.id,
        dataHora: new Date(),
        tipo: 'Fisioterapia Motora',
        descricao: 'Treino de marcha e equilíbrio',
        duracao: 50,
        observacoes: 'Paciente realizou exercícios com auxílio',
        status: 'concluida'
      }
    ];

    for (const sessaoData of sessoesFisio) {
      const sessao = await SessaoFisio.create(sessaoData);
      console.log(`✅ Sessão de fisioterapia criada: ${sessao.tipo}`);
    }

    // ========== ESTOQUE ==========
    console.log('\n📦 Criando itens de estoque...');
    
    const gerenteEstoque = usuariosCriados.find(u => u.role === 'admin');

    const itensEstoque = [
      {
        nome: 'Losartana 50mg',
        categoria: 'Medicamento',
        descricao: 'Anti-hipertensivo',
        unidade: 'Comprimido',
        quantidadeMinima: 100,
        quantidadeAtual: 500,
        valorUnitario: 0.50,
        localizacao: 'Prateleira A1',
        ativo: true
      },
      {
        nome: 'Luva de Procedimento',
        categoria: 'Material Médico',
        descricao: 'Luva de látex tamanho M',
        unidade: 'Par',
        quantidadeMinima: 200,
        quantidadeAtual: 1000,
        valorUnitario: 0.80,
        localizacao: 'Prateleira B2',
        ativo: true
      },
      {
        nome: 'Seringa 10ml',
        categoria: 'Material Médico',
        descricao: 'Seringa descartável 10ml',
        unidade: 'Unidade',
        quantidadeMinima: 50,
        quantidadeAtual: 300,
        valorUnitario: 1.20,
        localizacao: 'Prateleira B3',
        ativo: true
      }
    ];

    const itensCriados = [];
    for (const itemData of itensEstoque) {
      const item = await EstoqueItem.create(itemData);
      itensCriados.push(item);
      console.log(`✅ Item de estoque criado: ${item.nome}`);
    }

    // ========== MOVIMENTAÇÕES DE ESTOQUE ==========
    console.log('\n📊 Criando movimentações de estoque...');

    const movimentacoes = [
      {
        itemId: itensCriados[0].id,
        tipo: 'entrada',
        quantidade: 500,
        valorUnitario: 0.50,
        observacoes: 'Compra inicial',
        usuarioId: gerenteEstoque.id,
        dataMovimentacao: new Date()
      },
      {
        itemId: itensCriados[0].id,
        tipo: 'saida',
        quantidade: 50,
        valorUnitario: 0.50,
        observacoes: 'Dispensação para pacientes',
        usuarioId: gerenteEstoque.id,
        dataMovimentacao: new Date()
      },
      {
        itemId: itensCriados[1].id,
        tipo: 'entrada',
        quantidade: 1000,
        valorUnitario: 0.80,
        observacoes: 'Compra mensal',
        usuarioId: gerenteEstoque.id,
        dataMovimentacao: new Date()
      }
    ];

    for (const movData of movimentacoes) {
      const movimentacao = await EstoqueMovimentacao.create(movData);
      console.log(`✅ Movimentação criada: ${movimentacao.tipo} - ${movimentacao.quantidade} unidades`);
    }

    // ========== TRANSAÇÕES FINANCEIRAS ==========
    console.log('\n💰 Criando transações financeiras...');
    
    const gerenteFinanceiro = usuariosCriados.find(u => u.role === 'auxiliar_administrativo');

    const transacoes = [
      {
        tipo: 'receita',
        categoria: 'Consulta',
        descricao: 'Consulta médica - José Ferreira',
        valor: 250.00,
        formaPagamento: 'Cartão de Crédito',
        dataVencimento: new Date(),
        dataPagamento: new Date(),
        status: 'pago',
        pacienteId: pacientesCriados[0].id,
        usuarioId: gerenteFinanceiro.id
      },
      {
        tipo: 'receita',
        categoria: 'Fisioterapia',
        descricao: 'Sessão de fisioterapia - Rosa Maria Santos',
        valor: 150.00,
        formaPagamento: 'Dinheiro',
        dataVencimento: new Date(),
        dataPagamento: new Date(),
        status: 'pago',
        pacienteId: pacientesCriados[3].id,
        usuarioId: gerenteFinanceiro.id
      },
      {
        tipo: 'despesa',
        categoria: 'Estoque',
        descricao: 'Compra de medicamentos',
        valor: 500.00,
        formaPagamento: 'Boleto',
        dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        dataPagamento: null,
        status: 'pendente',
        usuarioId: gerenteFinanceiro.id
      }
    ];

    for (const transacaoData of transacoes) {
      const transacao = await FinanceiroTransacao.create(transacaoData);
      console.log(`✅ Transação criada: ${transacao.tipo} - R$ ${transacao.valor}`);
    }

    // ========== LEITOS DA CASA DE REPOUSO ==========
    console.log('\n🏠 Criando leitos da casa de repouso...');

    const leitos = [
      {
        numero: '101',
        tipo: 'Individual',
        status: 'ocupado',
        pacienteId: pacientesCriados[0].id,
        observacoes: 'Leito com adaptações para mobilidade reduzida'
      },
      {
        numero: '102',
        tipo: 'Individual',
        status: 'ocupado',
        pacienteId: pacientesCriados[1].id,
        observacoes: 'Leito próximo à enfermaria'
      },
      {
        numero: '103',
        tipo: 'Individual',
        status: 'disponivel',
        pacienteId: null,
        observacoes: 'Leito recém-reformado'
      }
    ];

    for (const leitoData of leitos) {
      const leito = await CasaRepousoLeito.create(leitoData);
      console.log(`✅ Leito criado: ${leito.numero} - ${leito.status}`);
    }

    // ========== RESUMO FINAL ==========
    console.log('\n' + '='.repeat(60));
    console.log('✅ SEED COMPLETO FINALIZADO COM SUCESSO!');
    console.log('='.repeat(60));
    console.log(`👥 Usuários criados: ${usuariosCriados.length}`);
    console.log(`📋 Pacientes criados: ${pacientesCriados.length}`);
    console.log(`💊 Prescrições criadas: ${prescricoes.length}`);
    console.log(`📅 Agendamentos criados: ${agendamentos.length}`);
    console.log(`🏥 Registros de enfermagem: ${registrosEnfermagem.length}`);
    console.log(`🏃 Sessões de fisioterapia: ${sessoesFisio.length}`);
    console.log(`📦 Itens de estoque: ${itensCriados.length}`);
    console.log(`📊 Movimentações de estoque: ${movimentacoes.length}`);
    console.log(`💰 Transações financeiras: ${transacoes.length}`);
    console.log(`🏠 Leitos criados: ${leitos.length}`);
    console.log('='.repeat(60));
    
    console.log('\n📝 CREDENCIAIS DE ACESSO:');
    console.log('-'.repeat(60));
    console.log('Todos os usuários usam a senha: teste123');
    console.log('-'.repeat(60));
    console.log('Médicos:');
    console.log('  - joao.silva@prescrimed.com (Clínico Geral)');
    console.log('  - maria.santos@prescrimed.com (Cardiologista)');
    console.log('\nEnfermagem:');
    console.log('  - ana.costa@prescrimed.com (Enfermeira Chefe)');
    console.log('  - carlos.eduardo@prescrimed.com (Téc. Enfermagem)');
    console.log('\nFisioterapia:');
    console.log('  - juliana.oliveira@prescrimed.com');
    console.log('  - roberto.alves@prescrimed.com');
    console.log('\nAdministrativo:');
    console.log('  - fernanda.lima@prescrimed.com (Recepção)');
    console.log('  - patricia.mendes@prescrimed.com (Financeiro)');
    console.log('  - ricardo.souza@prescrimed.com (Estoque)');
    console.log('-'.repeat(60));

  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Executar o seed
seedCompleteData()
  .then(() => {
    console.log('\n✅ Processo finalizado com sucesso!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });
