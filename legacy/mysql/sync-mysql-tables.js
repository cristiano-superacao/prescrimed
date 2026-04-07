import sequelize from '../config/database.js';
import '../models/index.js'; // Importa os modelos e seus relacionamentos

async function syncTables() {
  try {
    console.log('🔄 Conectando ao MySQL...');
    
    await sequelize.authenticate();
    console.log('✅ Conexão MySQL estabelecida com sucesso!');
    
    console.log('🔄 Sincronizando tabelas...');
    
    // Sincronizar todos os modelos (criar tabelas)
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ Todas as tabelas foram sincronizadas!');
    
    // Verificar tabelas criadas
    const [tables] = await sequelize.query(
      "SHOW TABLES FROM prescrimed"
    );
    
    console.log('\n📋 Tabelas criadas:');
    tables.forEach((table, index) => {
      const tableName = table[`Tables_in_prescrimed`];
      console.log(`  ${index + 1}. ${tableName}`);
    });
    
    console.log('\n✨ Sincronização concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao sincronizar tabelas:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

syncTables();
