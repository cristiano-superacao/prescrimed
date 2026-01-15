import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Empresa from '../models/Empresa.js';
import Usuario from '../models/Usuario.js';
import Paciente from '../models/Paciente.js';

dotenv.config();

const modulesByType = {
  'casa-repouso': ['dashboard', 'prescricoes', 'pacientes', 'estoque', 'financeiro', 'agenda', 'cronograma'],
  'petshop': ['dashboard', 'prescricoes', 'pacientes', 'estoque', 'financeiro', 'agenda'],
  'fisioterapia': ['dashboard', 'prescricoes', 'pacientes', 'agenda', 'evolucao', 'cronograma']
};

const empresasSeed = [
  {
    nome: 'Casa Bela Vida',
    tipoSistema: 'casa-repouso',
    email: 'casa@prescrimed.com',
    telefone: '+55 11 90000-0001',
    endereco: { cidade: 'São Paulo', uf: 'SP', rua: 'Rua das Flores, 100' },
    admin: { nome: 'Admin Casa', email: 'admin.casa@prescrimed.com', senha: 'PrescriMed!2024' }
  },
  {
    nome: 'PetCare Premium',
    tipoSistema: 'petshop',
    email: 'pet@prescrimed.com',
    telefone: '+55 11 90000-0002',
    endereco: { cidade: 'São Paulo', uf: 'SP', rua: 'Av. dos Animais, 200' },
    admin: { nome: 'Admin Pet', email: 'admin.pet@prescrimed.com', senha: 'PrescriMed!2024' }
  },
  {
    nome: 'ClinFisio Avançada',
    tipoSistema: 'fisioterapia',
    email: 'fisio@prescrimed.com',
    telefone: '+55 11 90000-0003',
    endereco: { cidade: 'São Paulo', uf: 'SP', rua: 'Rua da Saúde, 300' },
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

async function ensureEmpresaAndAdmin(seed) {
  // Encontrar ou criar empresa pelo email único
  let empresa = await Empresa.findOne({ email: seed.email });
  if (!empresa) {
    empresa = await Empresa.create({
      nome: seed.nome,
      email: seed.email,
      telefone: seed.telefone,
      tipoSistema: seed.tipoSistema,
      endereco: seed.endereco,
      configuracoes: { modulosAtivos: modulesByType[seed.tipoSistema] }
    });
    console.log(`✅ Empresa criada: ${seed.nome} (${seed.tipoSistema})`);
  } else {
    console.log(`ℹ️ Empresa já existe: ${seed.nome}`);
  }

  // Encontrar ou criar admin
  let admin = await Usuario.findOne({ email: seed.admin.email });
  if (!admin) {
    admin = await Usuario.create({
      empresaId: empresa._id,
      nome: seed.admin.nome,
      email: seed.admin.email,
      senha: seed.admin.senha,
      role: 'admin',
      permissoes: [...modulesByType[seed.tipoSistema], 'usuarios', 'configuracoes']
    });
    await Empresa.findByIdAndUpdate(empresa._id, { adminUserId: admin._id });
    console.log(`✅ Admin criado: ${seed.admin.email}`);
  } else {
    console.log(`ℹ️ Admin já existe: ${seed.admin.email}`);
  }

  return { empresa, admin };
}

async function ensurePacientes(empresaId) {
  const count = await Paciente.countByEmpresa(empresaId);
  if (count >= 5) {
    console.log(`ℹ️ Empresa já possui ${count} pacientes. Pulando criação.`);
    return;
  }

  const hoje = new Date();
  const baseAno = hoje.getFullYear() - 70; // Idade média 70 anos para casa de repouso

  const pacientes = nomesPacientes.map((p, idx) => ({
    empresaId,
    nome: p.nome,
    dataNascimento: new Date(baseAno + idx, 1 + idx, 10 + idx),
    sexo: p.sexo,
    telefone: `+55 11 9${String(1000000 + idx).padStart(7, '0')}`,
    endereco: { cidade: 'São Paulo', uf: 'SP' },
    alergias: idx % 2 === 0 ? ['Dipirona'] : [],
    condicoesMedicas: idx % 2 === 1 ? ['Hipertensão'] : [],
    observacoes: 'Registro inicial criado via seed'
  }));

  await Paciente.insertMany(pacientes);
  console.log(`✅ ${pacientes.length} pacientes criados para empresa ${empresaId.toString()}`);
}

async function run() {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URL ||
      process.env.MONGODB_URL ||
      process.env.DATABASE_URL;

    if (!mongoUri) {
      console.error('❌ Nenhuma URI de MongoDB encontrada nas variáveis de ambiente.');
      console.error('Defina MONGODB_URI no Railway/Atlas para executar o seed.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB');

    const resultados = [];
    for (const seed of empresasSeed) {
      const { empresa, admin } = await ensureEmpresaAndAdmin(seed);
      await ensurePacientes(empresa._id);
      resultados.push({
        empresa: { nome: empresa.nome, tipo: empresa.tipoSistema },
        admin: { email: admin.email, senha: seed.admin.senha }
      });
    }

    console.log('\n======== Credenciais de Teste ========');
    resultados.forEach((r) => {
      console.log(`Empresa: ${r.empresa.nome} [${r.empresa.tipo}]`);
      console.log(`  Admin: ${r.admin.email}`);
      console.log(`  Senha: ${r.admin.senha}`);
      console.log('-----------------------------------');
    });

  } catch (err) {
    console.error('❌ Erro ao executar seed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
    process.exit(0);
  }
}

run();
