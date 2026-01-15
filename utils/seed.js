import Empresa from '../models/Empresa.js';
import Usuario from '../models/Usuario.js';
import Paciente from '../models/Paciente.js';

const modulesByType = {
  'casa-repouso': ['dashboard', 'prescricoes', 'pacientes', 'estoque', 'financeiro', 'agenda', 'cronograma'],
  'petshop': ['dashboard', 'prescricoes', 'pacientes', 'estoque', 'financeiro', 'agenda'],
  'fisioterapia': ['dashboard', 'prescricoes', 'pacientes', 'agenda', 'evolucao', 'cronograma']
};

const empresasSeed = [
  {
    nome: 'Casa Bela Vida',
    cnpj: '11111111111111',
    tipoSistema: 'casa-repouso',
    email: 'casa@prescrimed.com',
    telefone: '+55 11 90000-0001',
    endereco: { cidade: 'São Paulo', uf: 'SP', cep: '01000-000', rua: 'Rua das Flores', numero: '100' },
    plano: 'premium',
    status: 'ativo',
    admin: { nome: 'Admin Casa', email: 'admin.casa@prescrimed.com', senha: 'PrescriMed!2024' }
  },
  {
    nome: 'PetCare Premium',
    cnpj: '22222222222222',
    tipoSistema: 'petshop',
    email: 'pet@prescrimed.com',
    telefone: '+55 11 90000-0002',
    endereco: { cidade: 'São Paulo', uf: 'SP', cep: '02000-000', rua: 'Av. dos Animais', numero: '200' },
    plano: 'premium',
    status: 'ativo',
    admin: { nome: 'Admin Pet', email: 'admin.pet@prescrimed.com', senha: 'PrescriMed!2024' }
  },
  {
    nome: 'ClinFisio Avançada',
    cnpj: '33333333333333',
    tipoSistema: 'fisioterapia',
    email: 'fisio@prescrimed.com',
    telefone: '+55 11 90000-0003',
    endereco: { cidade: 'São Paulo', uf: 'SP', cep: '03000-000', rua: 'Rua da Saúde', numero: '300' },
    plano: 'premium',
    status: 'ativo',
    admin: { nome: 'Admin Fisio', email: 'admin.fisio@prescrimed.com', senha: 'PrescriMed!2024' }
  }
];

const nomesPacientes = [
  { nome: 'Ana Souza', sexo: 'F' },
  { nome: 'Bruno Lima', sexo: 'M' },
  { nome: 'Carla Mendes', sexo: 'F' },
  { nome: 'Daniel Rocha', sexo: 'M' },
  { nome: 'Elisa Campos', sexo: 'F' }
];

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

    // 3. Verificar se precisamos criar empresas demo
    const empresasCount = await Empresa.countDocuments({ cnpj: { $ne: '00000000000000' } });
    
    if (empresasCount === 0) {
      console.log('\n🏢 Criando empresas demo...');
      
      for (const seedData of empresasSeed) {
        try {
          // Criar empresa
          const novaEmpresa = await Empresa.create({
            nome: seedData.nome,
            cnpj: seedData.cnpj,
            tipoSistema: seedData.tipoSistema,
            email: seedData.email,
            telefone: seedData.telefone,
            endereco: seedData.endereco,
            plano: seedData.plano,
            status: seedData.status,
            configuracoes: {
              modulosAtivos: modulesByType[seedData.tipoSistema]
            }
          });

          // Criar admin da empresa
          const adminUsuario = await Usuario.create({
            empresaId: novaEmpresa._id,
            nome: seedData.admin.nome,
            email: seedData.admin.email,
            senha: seedData.admin.senha,
            role: 'admin',
            status: 'ativo',
            permissoes: modulesByType[seedData.tipoSistema]
          });

          // Atualizar empresa com ID do admin
          await Empresa.findByIdAndUpdate(novaEmpresa._id, { adminUserId: adminUsuario._id });

          console.log(`✅ Empresa "${seedData.nome}" criada (${seedData.tipoSistema})`);

          // Criar 5 pacientes para cada empresa
          for (const pacData of nomesPacientes) {
            await Paciente.create({
              empresaId: novaEmpresa._id,
              nome: pacData.nome,
              dataNascimento: new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
              sexo: pacData.sexo,
              cpf: String(Math.floor(Math.random() * 90000000000) + 10000000000),
              telefone: `+55 11 9${Math.floor(Math.random() * 90000000) + 10000000}`,
              email: `${pacData.nome.toLowerCase().replace(' ', '.')}@email.com`,
              endereco: {
                rua: 'Rua Exemplo',
                numero: String(Math.floor(Math.random() * 900) + 100),
                cidade: 'São Paulo',
                uf: 'SP',
                cep: '01000-000'
              },
              status: 'ativo'
            });
          }

          console.log(`✅ 5 pacientes criados para "${seedData.nome}"`);

        } catch (err) {
          console.error(`❌ Erro ao criar empresa ${seedData.nome}:`, err.message);
        }
      }

      console.log('\n✅ Seed completo! 3 empresas e 15 pacientes criados.');
    } else {
      console.log(`✅ Já existem ${empresasCount} empresa(s) cadastrada(s).`);
    }

  } catch (error) {
    console.error('❌ Erro no seed:', error);
  }
};
