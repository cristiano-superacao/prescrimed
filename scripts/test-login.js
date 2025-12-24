import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from './models/Usuario.js';
import Empresa from './models/Empresa.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prescrimed');
    console.log('✅ Conectado ao MongoDB');

    const email = 'superadmin@prescrimed.com';
    const senha = 'admin123456';

    console.log(`Tentando login com: ${email}`);

    // 1. Buscar usuário
    const usuario = await Usuario.findOne({ email }).select('+senha');
    if (!usuario) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    console.log('✅ Usuário encontrado:', usuario.email);
    console.log('Hash da senha:', usuario.senha);

    // 2. Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      console.log('❌ Senha inválida');
      return;
    }
    console.log('✅ Senha válida');

    // 3. Buscar empresa
    const empresa = await Empresa.findById(usuario.empresaId);
    if (!empresa) {
      console.log('❌ Empresa não encontrada');
      return;
    }
    console.log('✅ Empresa encontrada:', empresa.nome);

    console.log('🎉 Teste de login concluído com sucesso (Lógica do Backend)');

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await mongoose.disconnect();
  }
};

testLogin();
