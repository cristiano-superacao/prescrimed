import Empresa from '../models/Empresa.js';
import Usuario from '../models/Usuario.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Verificando necessidade de seed...');

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
    }

    // 2. Criar o usuário Super Admin
    const email = 'superadmin@prescrimed.com';
    const senha = 'admin123456';

    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      console.log('Criando usuário Super Admin...');
      usuario = await Usuario.create({
        empresaId: empresa._id,
        nome: 'Super Administrador',
        email: email,
        senha: senha,
        role: 'superadmin',
        status: 'ativo',
        permissoes: ['dashboard', 'prescricoes', 'pacientes', 'usuarios', 'configuracoes', 'financeiro', 'estoque', 'agenda', 'cronograma', 'evolucao']
      });
      
      await Empresa.findByIdAndUpdate(empresa._id, { adminUserId: usuario._id });
      console.log('✅ Super Admin criado com sucesso!');
    } else {
      console.log('✅ Super Admin já existe.');
    }

  } catch (error) {
    console.error('❌ Erro no seed:', error);
  }
};
