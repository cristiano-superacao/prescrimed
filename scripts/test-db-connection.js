import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

function resolveMongoUri() {
  const keys = [
    'MONGODB_URI',
    'MONGO_URL',
    'MONGODB_URL',
    'DATABASE_URL',
    'URL_MONGO',
    'URL_PUBLICA_MONGO',
    'MONGO_URI',
    'URL_DO_BANCO_DE_DADOS'
  ];
  for (const k of keys) {
    if (process.env[k]) return { uri: process.env[k], key: k };
  }
  return { uri: null, key: null };
}

async function run() {
  const { uri, key } = resolveMongoUri();
  if (!uri) {
    console.error('❌ Nenhuma URI de Mongo encontrada nas variáveis de ambiente.');
    process.exit(1);
  }
  console.log(`🔎 Testando conexão com Mongo usando ${key}...`);

  try {
    const conn = await mongoose.connect(uri);
    const db = conn.connection.db;
    const admin = db.admin();
    const info = await admin.serverStatus();
    const colls = await db.listCollections().toArray();

    console.log('✅ Conectado com sucesso.');
    console.log(`📚 Database: ${db.databaseName}`);
    console.log(`📦 Coleções: ${colls.length}`);
    console.log('📄 Primeiras coleções:', colls.slice(0, 10).map(c => c.name).join(', '));
    console.log('ℹ️  Versão do Mongo:', info.version);
  } catch (err) {
    console.error('❌ Falha na conexão:', err.message);
    process.exit(2);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
