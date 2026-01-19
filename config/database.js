import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do banco de dados compatível com Railway e desenvolvimento local
let sequelize;

// Em produção (Railway), idealmente use PostgreSQL (DATABASE_URL).
// Porém, para não derrubar o deploy por healthcheck quando a variável ainda não foi configurada,
// só fazemos fail-fast se FAIL_FAST_DB=true.
const missingDbConfigInProd =
  process.env.NODE_ENV === 'production' &&
  !process.env.DATABASE_URL &&
  !process.env.PGHOST;

if (missingDbConfigInProd && process.env.FAIL_FAST_DB === 'true') {
  throw new Error(
    'Configuração de banco ausente em produção: defina DATABASE_URL (Railway Postgres) ou PGHOST/PGUSER/PGPASSWORD/PGDATABASE.'
  );
}

if (process.env.DATABASE_URL) {
  // Railway ou Render fornece DATABASE_URL completa (PostgreSQL em produção)
  console.log('📡 Usando DATABASE_URL do Railway/Render (PostgreSQL)');
  // Normaliza esquema 'postgresql://' para 'postgres://' (compatibilidade com driver pg)
  const normalizedUrl = process.env.DATABASE_URL.replace(/^postgresql:\/\//i, 'postgres://');
  sequelize = new Sequelize(normalizedUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else if (process.env.PGHOST) {
  // Configuração local com PostgreSQL instalado
  console.log('📦 Usando configuração local PostgreSQL');
  sequelize = new Sequelize(
    process.env.PGDATABASE || 'prescrimed',
    process.env.PGUSER || 'postgres',
    process.env.PGPASSWORD || 'postgres',
    {
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432', 10),
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  // Desenvolvimento local sem PostgreSQL - usa SQLite
  if (missingDbConfigInProd) {
    console.warn(
      '⚠️ DATABASE_URL não configurada em produção; usando SQLite temporariamente. ' +
        'No Railway, adicione um PostgreSQL e defina DATABASE_URL no serviço do backend.'
    );
  } else {
    console.log('💾 Usando SQLite para desenvolvimento local');
  }

  const sqliteStorage =
    process.env.SQLITE_PATH || (process.env.NODE_ENV === 'production' ? '/tmp/database.sqlite' : './database.sqlite');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqliteStorage,
    logging: false  // Desabilitar logs SQL para não poluir console
  });
}

export default sequelize;
