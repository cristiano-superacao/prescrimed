// Script para criar usuário admin localmente
import sequelize from './config/database.js';
import Usuario from './models/Usuario.js';
import Empresa from './models/Empresa.js';
import bcrypt from 'bcryptjs';

const createLocalAdmin = async () => {
  try {
    console.log('🔧 Criando usuário administrador local...\n');

    // Conectar ao banco
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados\n');

    // Sincronizar modelos
    await sequelize.sync();
    console.log('✅ Modelos sincronizados\n');

    // Criar empresa padrão
    let empresa = await Empresa.findOne({ where: { nome: 'Prescrimed' } });
    
    if (!empresa) {
      empresa = await Empresa.create({
        nome: 'Prescrimed',
        cnpj: '00000000000000',
        telefone: '(00) 0000-0000',
        email: 'contato@prescrimed.com',
        endereco: 'Endereço padrão',
        cidade: 'Cidade',
        estado: 'UF',
        cep: '00000-000',
        ativa: true
      });
      console.log('✅ Empresa criada:', empresa.nome);
    } else {
      console.log('ℹ️  Empresa já existe:', empresa.nome);
    }

    // Verificar se admin já existe
    let admin = await Usuario.findOne({ where: { email: 'admin@prescrimed.com' } });

    if (admin) {
      console.log('\n⚠️  Usuário admin já existe!');
      console.log('📧 Email:', admin.email);
      console.log('👤 Nome:', admin.nome);
      console.log('🔑 Para redefinir a senha, delete o usuário e rode este script novamente.\n');
    } else {
      // Criar usuário admin
      const senhaHash = await bcrypt.hash('admin123', 10);
      
      admin = await Usuario.create({
        nome: 'Administrador',
        email: 'admin@prescrimed.com',
        senha: senhaHash,
        cargo: 'admin',
        ativo: true,
        empresaId: empresa.id
      });

      console.log('\n✅ Usuário administrador criado com sucesso!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:  admin@prescrimed.com');
      console.log('🔒 Senha:  admin123');
      console.log('👤 Nome:   Administrador');
      console.log('🏢 Empresa:', empresa.nome);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

    console.log('🚀 Acesse o sistema em: http://localhost:8000\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
};

createLocalAdmin();
