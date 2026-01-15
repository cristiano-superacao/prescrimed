import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importar modelos para sincronizar índices
import Empresa from '../models/Empresa.js';
import Usuario from '../models/Usuario.js';
import Paciente from '../models/Paciente.js';
import Prescricao from '../models/Prescricao.js';
import Agendamento from '../models/Agendamento.js';
import Alimento from '../models/Alimento.js';
import Medicamento from '../models/Medicamento.js';
import MovimentacaoEstoque from '../models/MovimentacaoEstoque.js';
import Transacao from '../models/Transacao.js';

dotenv.config();

async function ensureCollections(db) {
  const expected = [
    'empresas',
    'usuarios',
    'pacientes',
    'prescricoes',
    'agendamentos',
    'alimentos',
    'medicamentos',
    'movimentacaoestoques',
    'transacaos'
  ];

  const existing = await db.listCollections().toArray();
  const existingNames = new Set(existing.map(c => c.name));

  // Corrigir possíveis coleções antigas incorretas da entidade Prescricao
  const legacyNames = ['prescricaos', 'prescrição', 'prescrições'];
  for (const legacy of legacyNames) {
    if (existingNames.has(legacy) && !existingNames.has('prescricoes')) {
      console.log(`↪️  Renomeando coleção antiga "${legacy}" -> "prescricoes"...`);
      await db.collection(legacy).rename('prescricoes');
      existingNames.add('prescricoes');
      existingNames.delete(legacy);
      break;
    }
  }

  for (const name of expected) {
    if (!existingNames.has(name)) {
      console.log(`➕ Criando coleção: ${name}`);
      await db.createCollection(name);
    } else {
      console.log(`✔️  Coleção já existe: ${name}`);
    }
  }

  // Renomear coleções singulares para plural canônico quando necessário
  const legacyMap = {
    empresa: 'empresas',
    usuario: 'usuarios',
    paciente: 'pacientes',
    agendamento: 'agendamentos',
    alimento: 'alimentos',
    medicamento: 'medicamentos',
    movimentacaoestoque: 'movimentacaoestoques',
    transacao: 'transacaos'
  };
  for (const [legacy, target] of Object.entries(legacyMap)) {
    if (existingNames.has(legacy) && !existingNames.has(target)) {
      console.log(`↪️  Renomeando coleção antiga "${legacy}" -> "${target}"...`);
      await db.collection(legacy).rename(target);
      existingNames.add(target);
      existingNames.delete(legacy);
    }
  }
}

async function syncAllIndexes() {
  // Sincronizar índices definidos nos esquemas
  await Promise.all([
    Empresa.syncIndexes(),
    Usuario.syncIndexes(),
    Paciente.syncIndexes(),
    Prescricao.syncIndexes(),
    Agendamento.syncIndexes(),
    Alimento.syncIndexes(),
    Medicamento.syncIndexes(),
    MovimentacaoEstoque.syncIndexes(),
    Transacao.syncIndexes(),
  ]);
  console.log('✅ Índices sincronizados com sucesso');
}

async function run() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL || process.env.DATABASE_URL;
    if (!mongoUri) {
      console.error('❌ Defina MONGODB_URI para inicializar o banco.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB');

    const db = mongoose.connection.db;
    await ensureCollections(db);
    await syncAllIndexes();

    console.log('🌱 Banco preparado: coleções criadas/ajustadas e índices sincronizados.');
  } catch (err) {
    console.error('❌ Erro na inicialização do banco:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
