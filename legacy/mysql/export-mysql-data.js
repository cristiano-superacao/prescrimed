import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

async function main() {
  const {
    MYSQL_HOST = '127.0.0.1',
    MYSQL_PORT = '3306',
    MYSQL_USER = 'root',
    MYSQL_PASSWORD = '',
    MYSQL_DATABASE = 'prescrimed'
  } = process.env;

  const required = ['MYSQL_HOST','MYSQL_PORT','MYSQL_USER','MYSQL_DATABASE'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) {
    console.warn(`[export] Aviso: variáveis ausentes: ${missing.join(', ')}. Usando valores padrão onde possível.`);
  }

  const conn = await mysql.createConnection({
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    timezone: 'Z'
  });

  const exportDir = path.resolve('data','export');
  await fs.promises.mkdir(exportDir, { recursive: true });

  // Ordem respeitando FKs
  const tables = [
    'empresas',
    'usuarios',
    'pacientes',
    'EstoqueItens',
    'EstoqueMovimentacoes',
    'FinanceiroTransacoes',
    'prescricoes',
    'agendamentos',
    'cr_leitos',
    'petshop_pets',
    'fisio_sessoes',
    'RegistrosEnfermagem'
  ];

  const summary = [];

  for (const table of tables) {
    try {
      const [rows] = await conn.query(`SELECT * FROM \`${table}\``);
      const file = path.join(exportDir, `${table}.json`);
      await fs.promises.writeFile(file, JSON.stringify(rows, null, 2), 'utf8');
      summary.push({ table, count: rows.length, file });
      console.log(`✔ Exportado ${rows.length} registros de ${table} → ${file}`);
    } catch (err) {
      console.warn(`⚠ Falha ao exportar ${table}: ${err.message}`);
      summary.push({ table, error: err.message });
    }
  }

  await conn.end();

  const summaryFile = path.join(exportDir, '_summary.json');
  await fs.promises.writeFile(summaryFile, JSON.stringify({ at: new Date().toISOString(), summary }, null, 2), 'utf8');
  console.log(`\nResumo salvo em ${summaryFile}`);
}

main().catch(err => {
  console.error('❌ Erro na exportação:', err);
  process.exit(1);
});
