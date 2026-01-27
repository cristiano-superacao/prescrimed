import { Empresa } from '../models/index.js';
import { createBackupForEmpresa, pruneBackupsForEmpresa } from './backupCore.js';

let started = false;

function parseBool(value, fallback = false) {
  if (value == null) return fallback;
  const v = String(value).trim().toLowerCase();
  if (v === 'true' || v === '1' || v === 'yes') return true;
  if (v === 'false' || v === '0' || v === 'no') return false;
  return fallback;
}

function parseIntOr(value, fallback) {
  const n = Number.parseInt(String(value ?? '').trim(), 10);
  return Number.isFinite(n) ? n : fallback;
}

export function startBackupScheduler({ logger = console } = {}) {
  if (started) return;

  const enabled = parseBool(process.env.BACKUP_AUTO_ENABLED, false);
  if (!enabled) {
    logger.log('🟦 Backup scheduler: desativado (BACKUP_AUTO_ENABLED != true)');
    return;
  }

  started = true;

  const intervalHours = Math.max(1, parseIntOr(process.env.BACKUP_AUTO_INTERVAL_HOURS, 24));
  const intervalMs = intervalHours * 60 * 60 * 1000;

  const sendEmail = parseBool(process.env.BACKUP_AUTO_SEND_EMAIL, true);
  const includeInactive = parseBool(process.env.BACKUP_AUTO_INCLUDE_INACTIVE, false);

  const retentionCount = parseIntOr(process.env.BACKUP_RETENTION_COUNT, 30);
  const retentionDays = process.env.BACKUP_RETENTION_DAYS != null ? parseIntOr(process.env.BACKUP_RETENTION_DAYS, null) : null;

  const runOnce = async () => {
    try {
      const where = includeInactive ? {} : { ativo: true };
      const empresas = await Empresa.findAll({ where, attributes: ['id', 'nome', 'codigo', 'ativo'] });

      logger.log(`🟦 Backup scheduler: iniciando rotina (empresas=${empresas.length}, interval=${intervalHours}h)`);

      for (const empresa of empresas) {
        try {
          const result = await createBackupForEmpresa(empresa.id, { sendEmail });
          const pruned = await pruneBackupsForEmpresa(empresa.id, { retentionCount, retentionDays });
          logger.log(
            `✅ Backup auto: ${empresa.codigo || empresa.id} (${empresa.nome}) → ${result.filename}` +
              (pruned?.deleted ? ` (retidos: -${pruned.deleted})` : '')
          );
        } catch (e) {
          logger.warn(`⚠️ Backup auto falhou (${empresa.codigo || empresa.id}):`, e?.message || e);
        }
      }

      logger.log('🟦 Backup scheduler: rotina concluída');
    } catch (e) {
      logger.warn('⚠️ Backup scheduler: rotina falhou:', e?.message || e);
    }
  };

  // Primeira execução atrasada para não competir com startup
  const initialDelayMs = Math.max(5_000, parseIntOr(process.env.BACKUP_AUTO_INITIAL_DELAY_MS, 60_000));
  setTimeout(() => {
    runOnce().catch(() => {});
    setInterval(() => runOnce().catch(() => {}), intervalMs);
  }, initialDelayMs);

  logger.log(
    `🟦 Backup scheduler: ativo (interval=${intervalHours}h, sendEmail=${sendEmail}, retentionCount=${retentionCount}` +
      (retentionDays ? `, retentionDays=${retentionDays}` : '') +
      ')'
  );
}
