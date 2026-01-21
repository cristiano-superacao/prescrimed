import pg from 'pg';
const { Client } = pg;

async function checkTables() {
  // Usa a URL do Postgres Railway do projeto refreshing-analysis (backend em produção)
  const publicUrl = 'postgresql://postgres:KWKiyrvmaTKCDEZZyIWfzvfAFgfVvboW@caboose.proxy.rlwy.net:19326/railway';
  
  const client = new Client({
    connectionString: publicUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao Postgres Railway (supportive-benevolence)');

    // Lista todas as tabelas no schema public
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\n📋 Tabelas encontradas:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    console.log(`\n📊 Total: ${result.rows.length} tabelas`);

    // Verifica dados nas tabelas principais
    const empresas = await client.query('SELECT COUNT(*) FROM empresas');
    const usuarios = await client.query('SELECT COUNT(*) FROM usuarios');
    const pacientes = await client.query('SELECT COUNT(*) FROM pacientes');
    
    console.log('\n📈 Dados nas tabelas:');
    console.log(`  - Empresas: ${empresas.rows[0].count}`);
    console.log(`  - Usuários: ${usuarios.rows[0].count}`);
    console.log(`  - Pacientes: ${pacientes.rows[0].count}`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

checkTables();
