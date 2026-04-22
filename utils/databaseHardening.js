import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RLS_MIGRATION_PATH = path.resolve(__dirname, '..', 'supabase', 'migrations', '20260421_enable_public_rls.sql');

function maskConnectionString(connectionString = '') {
  return connectionString.replace(/:[^:@\s]+@/g, ':***@');
}

export async function loadPublicRlsMigrationSql() {
  return fs.readFile(RLS_MIGRATION_PATH, 'utf8');
}

export async function applyDatabaseHardening(sequelize, { logger = console } = {}) {
  const dialect = typeof sequelize?.getDialect === 'function' ? sequelize.getDialect() : null;

  if (dialect !== 'postgres') {
    logger?.log?.('ℹ️ Hardening de banco ignorado: aplicavel apenas a PostgreSQL.');
    return { skipped: true, reason: 'dialect_not_postgres' };
  }

  const sql = await loadPublicRlsMigrationSql();
  await sequelize.query(sql);
  logger?.log?.('🔒 Hardening do schema public aplicado com sucesso (RLS + revoke).');
  return { skipped: false };
}

export async function applyDatabaseHardeningFromUrl(connectionString, { logger = console } = {}) {
  if (!connectionString) {
    throw new Error('DATABASE_URL é obrigatória para aplicar o hardening manualmente.');
  }

  const isLocal = /localhost|127\.0\.0\.1|\[::1\]/i.test(connectionString);
  const client = new pg.Client({
    connectionString,
    ssl: isLocal ? undefined : { rejectUnauthorized: false }
  });

  try {
    logger?.log?.(`🔌 Aplicando hardening em ${maskConnectionString(connectionString)}`);
    await client.connect();
    const sql = await loadPublicRlsMigrationSql();
    await client.query(sql);
    logger?.log?.('✅ Hardening aplicado com sucesso no banco alvo.');
  } finally {
    await client.end().catch(() => undefined);
  }
}