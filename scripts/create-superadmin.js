import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Empresa from './models/Empresa.js';
import Usuario from './models/Usuario.js';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prescrimed');
    console.log('✅ Conectado ao MongoDB');

    // 1. Criar ou encontrar a Empresa "Sistema"
    let empresa = await Empresa.findOne({ cnpj: '00000000000000' });
    
    if (!empresa) {
      console.log('Criando empresa do sistema...');
      empresa = await Empresa.create({
        nome: 'Administração do Sistema',
        cnpj: '00000000000000',
        email: 'admin@sistema.com',
        plano: 'enterprise',
        status: 'ativo'
      });
    } else {
      console.log('Empresa do sistema já existe.');
    }

    // 2. Criar o usuário Super Admin
    const email = 'superadmin@prescrimed.com';
    const senha = 'admin123456'; // Senha padrão forte

    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      console.log('Criando usuário Super Admin...');
      usuario = await Usuario.create({
        empresaId: empresa._id,
        nome: 'Super Administrador',
        email: email,
        senha: senha, // O hook pre-save vai fazer o hash
        role: 'superadmin',
        status: 'ativo',
        permissoes: ['dashboard', 'prescricoes', 'pacientes', 'usuarios', 'configuracoes', 'financeiro', 'estoque', 'agenda', 'cronograma', 'evolucao']
      });
      
      // Atualizar a empresa com o adminUserId
      await Empresa.findByIdAndUpdate(empresa._id, { adminUserId: usuario._id });

      console.log('\n✅ Super Admin criado com sucesso!');
      console.log('-----------------------------------');
      console.log(`Email: ${email}`);
      console.log(`Senha: ${senha}`);
      console.log('-----------------------------------');
    } else {
      console.log('\n⚠️ Usuário Super Admin já existe.');
      console.log(`Email: ${email}`);
      // Se quiser resetar a senha, teria que fazer update aqui
    }

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado.');
    process.exit();
  }
};

createSuperAdmin();
