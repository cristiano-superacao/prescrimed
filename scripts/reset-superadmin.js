import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Usuario from './models/Usuario.js';
import Empresa from './models/Empresa.js';

let mongoServer;

async function resetSuperAdmin() {
  try {
    console.log('🔧 Iniciando reset do SuperAdmin...\n');

    // Conectar ao MongoDB em memória
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB\n');

    // 1. Deletar SuperAdmin existente
    console.log('🗑️  Deletando SuperAdmin antigo...');
    const deletedUser = await Usuario.findOneAndDelete({ 
      email: 'superadmin@prescrimed.com' 
    });
    
    if (deletedUser) {
      console.log(`✅ SuperAdmin deletado: ${deletedUser.nome}`);
    } else {
      console.log('⚠️  Nenhum SuperAdmin encontrado');
    }

    // 2. Deletar empresa do sistema se existir
    console.log('\n🗑️  Deletando empresa do sistema...');
    const deletedEmpresa = await Empresa.findOneAndDelete({ 
      nome: 'Sistema Prescrimed' 
    });
    
    if (deletedEmpresa) {
      console.log(`✅ Empresa deletada: ${deletedEmpresa.nome}`);
    }

    // 3. Criar nova empresa do sistema
    console.log('\n🏢 Criando nova empresa do sistema...');
    const novaEmpresa = await Empresa.create({
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
    console.log(`✅ Empresa criada: ${novaEmpresa.nome}`);

    // 4. Criar novo SuperAdmin com todas as permissões
    console.log('\n👤 Criando novo SuperAdmin...');
    const senhaCriptografada = await bcrypt.hash('super123', 10);
    
    const novoSuperAdmin = await Usuario.create({
      nome: 'Super Administrador',
      email: 'superadmin@prescrimed.com',
      senha: senhaCriptografada,
      role: 'superadmin',
      empresaId: novaEmpresa._id,
      telefone: '(00) 00000-0000',
      especialidade: 'Administração do Sistema',
      crm: 'ADMIN',
      crmUf: 'BR',
      ativo: true,
      permissoes: [
        'pacientes',
        'prescricoes',
        'estoque',
        'financeiro',
        'usuarios',
        'empresas',
        'configuracoes',
        'relatorios',
        'dashboard',
        'agenda',
        'cronograma',
        'evolucao'
      ]
    });

    console.log('✅ Novo SuperAdmin criado com sucesso!\n');
    console.log('📋 CREDENCIAIS:');
    console.log('   Email: superadmin@prescrimed.com');
    console.log('   Senha: super123');
    console.log('   Role: superadmin');
    console.log('   Empresa:', novaEmpresa.nome);
    console.log('   Permissões:', novoSuperAdmin.permissoes.length, 'módulos\n');

    console.log('✅ Reset concluído com sucesso!\n');
    console.log('⚠️  IMPORTANTE:');
    console.log('   1. Limpe o cache do navegador (F12 > Application > Local Storage)');
    console.log('   2. Delete os itens: user e token');
    console.log('   3. Faça login novamente\n');

    await mongoose.disconnect();
    await mongoServer.stop();
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (mongoServer) {
      await mongoServer.stop();
    }
    process.exit(1);
  }
}

resetSuperAdmin();
