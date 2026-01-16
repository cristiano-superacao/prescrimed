import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do PostgreSQL compatível com Railway
let sequelize;

if (process.env.DATABASE_URL) {
  // Railway ou Render fornece DATABASE_URL completa
  console.log('📡 Usando DATABASE_URL do Railway/Render');
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
} else {
  // Configuração local com variáveis separadas
  console.log('📦 Usando configuração local PostgreSQL');
  sequelize = new Sequelize(
    process.env.PGDATABASE || 'prescrimed',
    process.env.PGUSER || 'postgres',
    process.env.PGPASSWORD || 'postgres',
    {
      host: process.env.PGHOST || 'localhost',
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
}

export default sequelize;
