import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

async function tableExists(client, table) {
  // tenta com nome exato entre aspas (case-sensitive)
  try {
    await client.query(`SELECT 1 FROM "${table}" LIMIT 1`);
    return true;
  } catch (e) {
    return false;
  }
}

function buildUpsertSQL(table, columns) {
  const colList = columns.map(c => `"${c}"`).join(', ');
  const placeholders = columns.map((_, i) => `$${i+1}`).join(', ');
  const updateList = columns
    .filter(c => c !== 'id')
    .map(c => `"${c}" = EXCLUDED."${c}"`) // usa EXCLUDED para ON CONFLICT
    .join(', ');
  return `INSERT INTO "${table}" (${colList}) VALUES (${placeholders}) ON CONFLICT ("id") DO UPDATE SET ${updateList}`;
}

async function importTable(client, dir, table) {
  const file = path.join(dir, `${table}.json`);
  if (!fs.existsSync(file)) {
    console.warn(`⚠ Arquivo ${file} não encontrado, pulando ${table}`);
    return { table, imported: 0, skipped: true };
  }

  if (!(await tableExists(client, table))) {
    console.warn(`⚠ Tabela ${table} não existe no Postgres (Railway). Pulando.`);
    return { table, imported: 0, missingTable: true };
  }

  const rows = JSON.parse(await fs.promises.readFile(file, 'utf8'));
  if (!rows.length) {
    return { table, imported: 0 };
  }

  // Determina colunas a partir do primeiro registro
  const columns = Object.keys(rows[0]);
  const sql = buildUpsertSQL(table, columns);

  let imported = 0;
  for (const row of rows) {
    const values = columns.map(c => row[c] === null ? null : row[c]);
    try {
      await client.query(sql, values);
      imported++;
    } catch (e) {
      console.warn(`⚠ Falha ao inserir em ${table}: ${e.message}`);
    }
  }
  return { table, imported };
}

async function main() {
  const { DATABASE_URL } = process.env;
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL não definido. Este script deve rodar dentro do ambiente Railway (ou com URL externa válida).');
    process.exit(1);
  }
  const isInternal = DATABASE_URL.includes('railway.internal');
  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: isInternal ? undefined : { rejectUnauthorized: false }
  });
  await client.connect();

  const importDir = path.resolve('data','export');
  const tablesInOrder = [
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
  for (const t of tablesInOrder) {
    const res = await importTable(client, importDir, t);
    summary.push(res);
    console.log(`✔ ${t}: importados ${res.imported}${res.missingTable ? ' (tabela ausente)' : ''}`);
  }

  await client.end();
  const summaryFile = path.join(importDir, '_import_summary.json');
  await fs.promises.writeFile(summaryFile, JSON.stringify({ at: new Date().toISOString(), summary }, null, 2), 'utf8');
  console.log(`\nResumo de importação salvo em ${summaryFile}`);
}

main().catch(err => {
  console.error('❌ Erro na importação:', err);
  process.exit(1);
});
