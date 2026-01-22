import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do banco de dados compatível com Railway e desenvolvimento local
let sequelize;

// Em produção (Railway), idealmente use PostgreSQL (DATABASE_URL).
// Porém, para não derrubar o deploy por healthcheck quando a variável ainda não foi configurada,
// por padrão fazemos fail-fast para evitar gravar dados em SQLite por engano.
const missingDbConfigInProd =
  process.env.NODE_ENV === 'production' &&
  !process.env.DATABASE_URL &&
  !process.env.PGHOST;

// Permite override explícito (não recomendado) para cenários de troubleshooting.
const allowSqliteInProd = process.env.ALLOW_SQLITE_IN_PROD === 'true';

if (missingDbConfigInProd && !allowSqliteInProd) {
  throw new Error(
    'Configuração de banco ausente em produção: defina DATABASE_URL (Railway Postgres) ou PGHOST/PGUSER/PGPASSWORD/PGDATABASE. '
      + 'Para permitir SQLite em produção temporariamente, defina ALLOW_SQLITE_IN_PROD=true (NÃO RECOMENDADO).'
  );
}

if (process.env.DATABASE_URL) {
  // Railway ou Render fornece DATABASE_URL completa (PostgreSQL em produção)
  console.log('📡 Usando DATABASE_URL do Railway/Render (PostgreSQL)');
  // Normaliza esquema 'postgresql://' para 'postgres://' (compatibilidade com driver pg)
  const normalizedUrl = process.env.DATABASE_URL.replace(/^postgresql:\/\//i, 'postgres://');

  // Railway pode fornecer URL pública (proxy rlwy.net) OU URL interna (postgres.railway.internal).
  // A URL interna normalmente NÃO usa SSL; forçar SSL pode impedir a conexão.
  let needsSsl = true;
  try {
    const urlObj = new URL(normalizedUrl);
    const host = (urlObj.hostname || '').toLowerCase();
    if (host.endsWith('.railway.internal') || host === 'localhost' || host === '127.0.0.1') {
      needsSsl = false;
    }
  } catch {
    // Se não conseguir parsear, mantém SSL por segurança (URLs públicas geralmente exigem).
    needsSsl = true;
  }

  sequelize = new Sequelize(normalizedUrl, {
    dialect: 'postgres',
    dialectOptions: needsSsl
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          },
          connectTimeout: 60000 // 60 segundos
        }
      : {
          connectTimeout: 60000 // 60 segundos
        },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 2,
      acquire: 60000, // 60 segundos para adquirir conexão
      idle: 10000,
      evict: 10000
    },
    retry: {
      max: 3,
      timeout: 60000
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
      dialectOptions: {
        connectTimeout: 60000
      },
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,
        min: 2,
        acquire: 60000,
        idle: 10000,
        evict: 10000
      },
      retry: {
        max: 3,
        timeout: 60000
      }
    }
  );
} else {
  // Desenvolvimento local sem PostgreSQL - usa SQLite
  console.log('💾 Usando SQLite para desenvolvimento local');

  const sqliteStorage =
    process.env.SQLITE_PATH || (process.env.NODE_ENV === 'production' ? '/tmp/database.sqlite' : './database.sqlite');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqliteStorage,
    logging: false  // Desabilitar logs SQL para não poluir console
  });
}

export default sequelize;
