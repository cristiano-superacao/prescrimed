import { sequelize } from '../models/index.js';
import pg from 'pg';
const { Client } = pg;

async function syncToSupportiveBenevolence() {
  // URL do Postgres no projeto supportive-benevolence (vazio)
  const targetUrl = 'postgresql://postgres:oyeoFuAQMHwzFMYbSLXjMQBsNsSqvEYn@gondola.proxy.rlwy.net:16321/railway';
  
  console.log('🔧 Sincronizando tabelas para o banco supportive-benevolence...');
  
  // Temporariamente altera a conexão do Sequelize
  const originalUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = targetUrl;
  
  // Recria a conexão
  sequelize.config.dialectOptions = {
    ssl: { rejectUnauthorized: false }
  };
  
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao Postgres (supportive-benevolence)');
    
    // Cria todas as tabelas com alter: true para garantir que ficam sincronizadas
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Tabelas criadas/sincronizadas com sucesso!');
    
    // Lista as tabelas criadas
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tabelas criadas:');
    tables.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    console.log(`\n📊 Total: ${tables.length} tabelas`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
    process.env.DATABASE_URL = originalUrl;
  }
}

syncToSupportiveBenevolence();
