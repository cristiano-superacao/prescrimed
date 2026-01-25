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
  // Em produção sem DATABASE_URL/PGHOST, não derruba o servidor.
  // Ativa modo degradado para servir frontend e health endpoints,
  // mantendo API com 503 até a configuração correta do banco.
  console.warn('⚠️ DATABASE_URL ausente em produção. Iniciando em modo degradado (frontend disponível, API retornará 503)');
  process.env.DEGRADED_DB_MODE = 'true';
}

// Prioriza DATABASE_URL (PostgreSQL) quando disponível, mesmo que haja variáveis de MySQL presentes
if (process.env.DATABASE_URL) {
  // Railway ou Render fornece DATABASE_URL completa (PostgreSQL em produção)
  console.log('📡 Usando DATABASE_URL do Railway/Render (PostgreSQL)');
  // Verifica se usa conexão interna (railway.internal) que NÃO requer SSL
  const isInternalConnection = process.env.DATABASE_URL.includes('railway.internal');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: isInternalConnection ? {} : {
      ssl: { rejectUnauthorized: false }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 10, min: 2, acquire: 60000, idle: 10000 }
  });
} else if (process.env.MYSQL_HOST || process.env.MYSQL_URL) {
  // Ambiente Locaweb ou MySQL local
  const mysqlUrl = process.env.MYSQL_URL || null;
  if (mysqlUrl) {
    console.log('🐬 Usando MYSQL_URL (MySQL)');
    sequelize = new Sequelize(mysqlUrl, {
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: { max: 10, min: 2, acquire: 60000, idle: 10000 }
    });
  } else {
    console.log('🐬 Usando configuração MySQL (Locaweb ou local)');
    sequelize = new Sequelize(
      process.env.MYSQL_DATABASE || 'prescrimed',
      process.env.MYSQL_USER || 'root',
      process.env.MYSQL_PASSWORD || '',
      {
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT || '3306', 10),
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: { max: 10, min: 2, acquire: 60000, idle: 10000 }
      }
    );
  }
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
      pool: { max: 10, min: 2, acquire: 60000, idle: 10000 }
    });
} else {
  // Sem Postgres/MySQL: usa SQLite.
  // Em produção sem DB configurado, registra modo degradado para evitar uso real do SQLite.
  if (process.env.NODE_ENV === 'production' && process.env.DEGRADED_DB_MODE === 'true') {
    console.log('💾 Modo degradado em produção: usando SQLite temporário (API permanecerá 503)');
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
