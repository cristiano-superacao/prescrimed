import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuração exclusivamente PostgreSQL (Supabase/HostGator/Local)
let sequelize;

const resolvedDatabaseUrl =
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DB_URL ||
  process.env.SUPABASE_POOLER_URL ||
  process.env.DATABASE_URL_OVERRIDE;

if (!process.env.DATABASE_URL && resolvedDatabaseUrl) {
  process.env.DATABASE_URL = resolvedDatabaseUrl;
}

// Produção: se DATABASE_URL/PGHOST ausente, ativa modo degradado (frontend ok, API 503), sem SQLite.
const missingDbConfigInProd =
  process.env.NODE_ENV === 'production' &&
  !process.env.DATABASE_URL &&
  !process.env.PGHOST;

if (missingDbConfigInProd) {
  console.warn('⚠️ DATABASE_URL ausente em produção. Modo degradado ativo (sem conexão ao banco).');
  process.env.DEGRADED_DB_MODE = 'true';
}

if (process.env.DATABASE_URL) {
  console.log('📡 Usando DATABASE_URL (PostgreSQL)');
  const isInternalConnection = process.env.DATABASE_URL.includes('.internal');
  let isLocalConnection = false;
  let sslMode = null;
  try {
    const url = new URL(process.env.DATABASE_URL);
    const host = (url.hostname || '').toLowerCase();
    isLocalConnection = host === 'localhost' || host === '127.0.0.1' || host === '::1';
    sslMode = url.searchParams.get('sslmode');
  } catch {
    // Se não for uma URL válida, mantém comportamento antigo
  }

  // Postgres local frequentemente não suporta SSL. Em Supabase/hosts externos, SSL costuma ser obrigatório.
  const shouldUseSsl = !isInternalConnection && !isLocalConnection && sslMode !== 'disable';
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: shouldUseSsl ? { ssl: { rejectUnauthorized: false }, keepAlive: true } : { keepAlive: true },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 10, min: 2, acquire: 60000, idle: 10000 }
  });
} else if (process.env.PGHOST) {
  console.log('📦 Usando configuração local PostgreSQL');
  sequelize = new Sequelize(
    process.env.PGDATABASE || 'prescrimed',
    process.env.PGUSER || 'postgres',
    process.env.PGPASSWORD || 'postgres',
    {
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432', 10),
      dialect: 'postgres',
      dialectOptions: { connectTimeout: 60000 },
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: { max: 10, min: 2, acquire: 60000, idle: 10000 }
    }
  );
} else {
  // Sem Postgres configurado: em desenvolvimento, avisa e usa stub; em produção, modo degradado
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ PostgreSQL não configurado. Defina DATABASE_URL ou PGHOST/PGUSER/PGPASSWORD/PGDATABASE.');
    console.warn('⚠️ Criando stub de Sequelize (servidor funcionará mas sem banco).');
  }
  // Stub Sequelize para não quebrar a aplicação
  sequelize = new Sequelize('postgres://stub:stub@localhost:5432/stub', { 
    dialect: 'postgres', 
    logging: false,
    pool: { max: 1, min: 0, idle: 1000 }
  });
}

export default sequelize;
