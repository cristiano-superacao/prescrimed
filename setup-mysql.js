// Script para configurar MySQL e criar banco de dados automaticamente
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const setupMySQL = async () => {
  console.log('🔧 Configurando MySQL para Prescrimed...\n');

  try {
    // Conectar sem especificar banco de dados
    console.log('📡 Conectando ao MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || ''
    });

    console.log('✅ Conectado ao MySQL!\n');

    // Criar banco de dados se não existir
    const dbName = process.env.MYSQL_DATABASE || 'prescrimed';
    console.log(`📦 Criando banco de dados "${dbName}"...`);
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Banco de dados "${dbName}" criado com sucesso!\n`);

    // Selecionar banco de dados
    await connection.query(`USE \`${dbName}\``);

    // Verificar tabelas existentes
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length > 0) {
      console.log(`📋 Tabelas existentes encontradas (${tables.length}):`);
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`   - ${tableName}`);
      });
      console.log('\n⚠️  Para recriar as tabelas, rode: npm run dev (Sequelize irá sincronizar automaticamente)\n');
    } else {
      console.log('📋 Nenhuma tabela encontrada. As tabelas serão criadas automaticamente quando o servidor iniciar.\n');
    }

    await connection.end();

    console.log('🎉 Configuração concluída!');
    console.log('\n📍 Próximos passos:');
    console.log('   1. Execute: npm run dev');
    console.log('   2. As tabelas serão criadas automaticamente');
    console.log('   3. Acesse: http://localhost:8000\n');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
    console.log('\n🔧 Solução de problemas:');
    console.log('   - Verifique se o MySQL está rodando');
    console.log('   - Confirme usuário e senha no arquivo .env');
    console.log('   - Verifique se a porta 3306 está disponível\n');
    process.exit(1);
  }
};

setupMySQL();
