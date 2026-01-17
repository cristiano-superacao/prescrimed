import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do banco de dados compatível com Railway e desenvolvimento local
let sequelize;

// Em produção (Railway), não deve cair em SQLite por engano.
// Se DATABASE_URL/PGHOST não estiverem setadas, falhe cedo com erro claro.
if (
  process.env.NODE_ENV === 'production' &&
  !process.env.DATABASE_URL &&
  !process.env.PGHOST &&
  process.env.ALLOW_SQLITE_IN_PROD !== 'true'
) {
  throw new Error(
    'Configuração de banco ausente em produção: defina DATABASE_URL (Railway Postgres) ou PGHOST/PGUSER/PGPASSWORD/PGDATABASE. ' +
      'Para permitir SQLite em produção (não recomendado), defina ALLOW_SQLITE_IN_PROD=true.'
  );
}

if (process.env.DATABASE_URL) {
  // Railway ou Render fornece DATABASE_URL completa (PostgreSQL em produção)
  console.log('📡 Usando DATABASE_URL do Railway/Render (PostgreSQL)');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
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
  console.log('💾 Usando SQLite para desenvolvimento local');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false  // Desabilitar logs SQL para não poluir console
  });
}

export default sequelize;
