import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Usuario from './models/Usuario.js';
import Empresa from './models/Empresa.js';

let mongoServer;

async function createAllUsers() {
  try {
    console.log('🚀 Iniciando criação de usuários por modalidade...\n');

    // Conectar ao MongoDB em memória
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB\n');

    // Buscar ou criar empresa
    let empresa = await Empresa.findOne({ nome: 'Sistema Prescrimed' });
    if (!empresa) {
      empresa = await Empresa.create({
        nome: 'Sistema Prescrimed',
        cnpj: '00.000.000/0001-00',
        email: 'sistema@prescrimed.com',
        telefone: '(00) 0000-0000',
        endereco: {
          logradouro: 'Sistema Central',
          numero: 'S/N',
          bairro: 'Administrativo',
          cidade: 'Sistema',
          estado: 'BR',
          cep: '00000-000'
        },
        plano: 'enterprise',
        status: 'ativo'
      });
      console.log('✅ Empresa criada:', empresa.nome);
    } else {
      console.log('✅ Empresa encontrada:', empresa.nome);
    }

    // Definir usuários por modalidade com suas permissões
    const usuarios = [
      {
        nome: 'Super Administrador',
        email: 'superadmin@prescrimed.com',
        senha: 'super123',
        role: 'superadmin',
        especialidade: 'Administração do Sistema',
        crm: 'ADMIN',
        crmUf: 'BR',
        telefone: '(00) 00000-0000',
        permissoes: [
          'dashboard',
          'agenda',
          'cronograma',
          'prescricoes',
          'pacientes',
          'estoque',
          'evolucao',
          'financeiro',
          'usuarios',
          'empresas',
          'configuracoes',
          'relatorios'
        ],
        descricao: 'Acesso total ao sistema - Gerencia empresas, usuários e todas as funcionalidades'
      },
      {
        nome: 'Dr. João Silva',
        email: 'medico@prescrimed.com',
        senha: 'medico123',
        role: 'medico',
        especialidade: 'Clínica Médica',
        crm: '123456',
        crmUf: 'SP',
        telefone: '(11) 98765-4321',
        permissoes: [
          'dashboard',
          'agenda',
          'cronograma',
          'prescricoes',
          'pacientes',
          'evolucao',
          'relatorios'
        ],
        descricao: 'Prescreve medicamentos, gerencia pacientes, evolução clínica e agenda'
      },
      {
        nome: 'Enf. Maria Santos',
        email: 'enfermeiro@prescrimed.com',
        senha: 'enfermeiro123',
        role: 'enfermeiro',
        especialidade: 'Enfermagem',
        crm: 'COREN-987654',
        crmUf: 'SP',
        telefone: '(11) 98765-4322',
        permissoes: [
          'dashboard',
          'agenda',
          'cronograma',
          'prescricoes',
          'pacientes',
          'evolucao',
          'estoque',
          'relatorios'
        ],
        descricao: 'Visualiza prescrições, gerencia pacientes, evolução, estoque de medicamentos'
      },
      {
        nome: 'Tec. Carlos Oliveira',
        email: 'tecnico@prescrimed.com',
        senha: 'tecnico123',
        role: 'tecnico_enfermagem',
        especialidade: 'Técnico de Enfermagem',
        crm: 'COREN-456789',
        crmUf: 'SP',
        telefone: '(11) 98765-4323',
        permissoes: [
          'dashboard',
          'agenda',
          'cronograma',
          'prescricoes',
          'pacientes',
          'estoque',
          'relatorios'
        ],
        descricao: 'Visualiza prescrições, gerencia pacientes, controla estoque de medicamentos'
      },
      {
        nome: 'Nutr. Ana Paula',
        email: 'nutricionista@prescrimed.com',
        senha: 'nutricionista123',
        role: 'nutricionista',
        especialidade: 'Nutrição Clínica',
        crm: 'CRN-12345',
        crmUf: 'SP',
        telefone: '(11) 98765-4324',
        permissoes: [
          'dashboard',
          'agenda',
          'cronograma',
          'prescricoes',
          'pacientes',
          'evolucao',
          'estoque',
          'relatorios'
        ],
        descricao: 'Prescreve dietas, gerencia pacientes, evolução nutricional e estoque de alimentos'
      },
      {
        nome: 'A.S. Paula Costa',
        email: 'assistente.social@prescrimed.com',
        senha: 'social123',
        role: 'assistente_social',
        especialidade: 'Serviço Social',
        crm: 'CRESS-54321',
        crmUf: 'SP',
        telefone: '(11) 98765-4325',
        permissoes: [
          'dashboard',
          'agenda',
          'pacientes',
          'evolucao',
          'relatorios'
        ],
        descricao: 'Gerencia aspectos sociais dos pacientes, evolução social e relatórios'
      },
      {
        nome: 'Admin. Roberto Lima',
        email: 'admin@prescrimed.com',
        senha: 'admin123',
        role: 'admin',
        especialidade: 'Administração',
        crm: 'ADM',
        crmUf: 'SP',
        telefone: '(11) 98765-4326',
        permissoes: [
          'dashboard',
          'agenda',
          'cronograma',
          'pacientes',
          'financeiro',
          'usuarios',
          'configuracoes',
          'relatorios'
        ],
        descricao: 'Gerencia usuários, financeiro, configurações e operações administrativas'
      },
      {
        nome: 'Aux. Fernanda Souza',
        email: 'auxiliar@prescrimed.com',
        senha: 'auxiliar123',
        role: 'auxiliar_administrativo',
        especialidade: 'Auxiliar Administrativo',
        crm: 'AUX',
        crmUf: 'SP',
        telefone: '(11) 98765-4327',
        permissoes: [
          'dashboard',
          'agenda',
          'pacientes',
          'relatorios'
        ],
        descricao: 'Gerencia agenda, cadastro de pacientes e relatórios básicos'
      }
    ];

    console.log('👥 Criando usuários:\n');

    for (const userData of usuarios) {
      // Verificar se usuário já existe
      const existente = await Usuario.findOne({ email: userData.email });
      if (existente) {
        console.log(`⚠️  ${userData.role.toUpperCase().padEnd(25)} - ${userData.nome.padEnd(30)} - JÁ EXISTE`);
        continue;
      }

      // Criar senha criptografada
      const senhaCriptografada = await bcrypt.hash(userData.senha, 10);

      // Criar usuário
      await Usuario.create({
        nome: userData.nome,
        email: userData.email,
        senha: senhaCriptografada,
        role: userData.role,
        empresaId: empresa._id,
        telefone: userData.telefone,
        especialidade: userData.especialidade,
        crm: userData.crm,
        crmUf: userData.crmUf,
        ativo: true,
        status: 'ativo',
        permissoes: userData.permissoes
      });

      console.log(`✅ ${userData.role.toUpperCase().padEnd(25)} - ${userData.nome.padEnd(30)} - CRIADO`);
    }

    // Exibir resumo com credenciais
    console.log('\n╔════════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                         ✅ USUÁRIOS CRIADOS COM SUCESSO!                          ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════════════╝\n');

    console.log('📋 CREDENCIAIS E PERMISSÕES:\n');

    for (const userData of usuarios) {
      console.log('─────────────────────────────────────────────────────────────────────────────────');
      console.log(`🏷️  CARGO: ${userData.role.toUpperCase()}`);
      console.log(`👤 Nome: ${userData.nome}`);
      console.log(`📧 Email: ${userData.email}`);
      console.log(`🔑 Senha: ${userData.senha}`);
      console.log(`📝 Descrição: ${userData.descricao}`);
      console.log(`✅ Permissões (${userData.permissoes.length}):`);
      userData.permissoes.forEach(perm => {
        const labels = {
          dashboard: '📊 Dashboard - Visão geral do sistema',
          agenda: '📅 Agenda - Gestão de compromissos',
          cronograma: '🗓️  Cronograma - Timeline de eventos',
          prescricoes: '💊 Prescrições - Gestão de medicamentos',
          pacientes: '🏥 Pacientes - Cadastro de residentes',
          estoque: '📦 Estoque - Controle de medicamentos/alimentos',
          evolucao: '📈 Evolução - Histórico clínico',
          financeiro: '💰 Financeiro - Gestão financeira',
          usuarios: '👥 Usuários - Gestão da equipe',
          empresas: '🏢 Empresas - Multi-tenant',
          configuracoes: '⚙️  Configurações - Preferências',
          relatorios: '📑 Relatórios - Geração de relatórios'
        };
        console.log(`   ${labels[perm] || `• ${perm}`}`);
      });
      console.log('');
    }

    console.log('─────────────────────────────────────────────────────────────────────────────────\n');

    console.log('📊 RESUMO POR MÓDULO:\n');
    
    const modulos = {
      dashboard: { label: '📊 Dashboard', count: 0 },
      agenda: { label: '📅 Agenda', count: 0 },
      cronograma: { label: '🗓️  Cronograma', count: 0 },
      prescricoes: { label: '💊 Prescrições', count: 0 },
      pacientes: { label: '🏥 Pacientes', count: 0 },
      estoque: { label: '📦 Estoque', count: 0 },
      evolucao: { label: '📈 Evolução', count: 0 },
      financeiro: { label: '💰 Financeiro', count: 0 },
      usuarios: { label: '👥 Usuários', count: 0 },
      empresas: { label: '🏢 Empresas', count: 0 },
      configuracoes: { label: '⚙️  Configurações', count: 0 },
      relatorios: { label: '📑 Relatórios', count: 0 }
    };

    usuarios.forEach(user => {
      user.permissoes.forEach(perm => {
        if (modulos[perm]) {
          modulos[perm].count++;
        }
      });
    });

    Object.entries(modulos).forEach(([key, data]) => {
      console.log(`${data.label.padEnd(30)} - ${data.count} usuário(s) com acesso`);
    });

    console.log('\n✅ Configuração concluída com sucesso!');
    console.log('🔗 Acesse: http://localhost:5174');
    console.log('📱 Sistema totalmente responsivo e profissional\n');

    await mongoose.disconnect();
    await mongoServer.stop();
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    if (mongoServer) {
      await mongoServer.stop();
    }
    process.exit(1);
  }
}

createAllUsers();
