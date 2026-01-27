import fs from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import {
  Empresa,
  Usuario,
  Paciente,
  Prescricao,
  Agendamento,
  CasaRepousoLeito,
  Pet,
  SessaoFisio,
  EstoqueItem,
  EstoqueMovimentacao,
  FinanceiroTransacao,
  RegistroEnfermagem
} from '../models/index.js';
import { sendBackupEmailIfConfigured } from './mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, '..', 'data', 'backups');

export function safeFilename(input) {
  const base = String(input || '').trim();
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export async function collectEmpresaData(empresaId) {
  const empresa = await Empresa.findByPk(empresaId);
  if (!empresa) {
    const err = new Error('Empresa não encontrada');
    err.status = 404;
    throw err;
  }

  const where = { empresaId };

  const [
    usuarios,
    pacientes,
    prescricoes,
    agendamentos,
    leitos,
    pets,
    sessoesFisio,
    estoqueItens,
    estoqueMovimentacoes,
    financeiroTransacoes,
    registrosEnfermagem
  ] = await Promise.all([
    Usuario.findAll({ where, attributes: { exclude: ['senha'] } }),
    Paciente.findAll({ where }),
    Prescricao.findAll({ where }),
    Agendamento.findAll({ where }),
    CasaRepousoLeito.findAll({ where }),
    Pet.findAll({ where }),
    SessaoFisio.findAll({ where }),
    EstoqueItem.findAll({ where }),
    EstoqueMovimentacao.findAll({ where }),
    FinanceiroTransacao.findAll({ where }),
    RegistroEnfermagem.findAll({ where })
  ]);

  return {
    meta: {
      schema: 'prescrimed-backup-v1',
      createdAt: new Date().toISOString(),
      empresaId: empresa.id,
      empresaCodigo: empresa.codigo || null,
      empresaNome: empresa.nome
    },
    empresa: empresa.toJSON(),
    data: {
      usuarios: usuarios.map((u) => u.toJSON()),
      pacientes: pacientes.map((p) => p.toJSON()),
      prescricoes: prescricoes.map((p) => p.toJSON()),
      agendamentos: agendamentos.map((a) => a.toJSON()),
      leitos: leitos.map((l) => l.toJSON()),
      pets: pets.map((p) => p.toJSON()),
      sessoesFisio: sessoesFisio.map((s) => s.toJSON()),
      estoqueItens: estoqueItens.map((e) => e.toJSON()),
      estoqueMovimentacoes: estoqueMovimentacoes.map((m) => m.toJSON()),
      financeiroTransacoes: financeiroTransacoes.map((t) => t.toJSON()),
      registrosEnfermagem: registrosEnfermagem.map((r) => r.toJSON())
    }
  };
}

async function resolveBackupRecipientEmail(empresaId) {
  const empresa = await Empresa.findByPk(empresaId);
  if (!empresa) return null;
  if (empresa.email) return empresa.email;

  const admin = await Usuario.findOne({
    where: { empresaId, role: 'admin' },
    attributes: ['email']
  });

  return admin?.email || null;
}

export async function createBackupForEmpresa(empresaId, { sendEmail } = {}) {
  const empresa = await Empresa.findByPk(empresaId);
  if (!empresa) {
    const err = new Error('Empresa não encontrada');
    err.status = 404;
    throw err;
  }

  const dir = path.join(BACKUP_DIR, safeFilename(empresaId));
  await ensureDir(dir);

  const stamp = nowStamp();
  const tag = safeFilename(empresa.codigo || 'empresa');
  const filename = `backup_${tag}_${stamp}.json.gz`;
  const filePath = path.join(dir, filename);

  const payload = await collectEmpresaData(empresaId);
  const json = Buffer.from(JSON.stringify(payload, null, 2), 'utf-8');
  const gz = zlib.gzipSync(json);
  await fs.writeFile(filePath, gz);

  let emailStatus = { status: 'skipped' };
  if (sendEmail) {
    const to = await resolveBackupRecipientEmail(empresaId);
    if (to) {
      emailStatus = await sendBackupEmailIfConfigured({
        to,
        subject: `Prescrimed - Backup ${empresa.nome} (${empresa.codigo || empresa.id})`,
        text: `Segue o backup gerado em ${new Date().toLocaleString('pt-BR')}.`,
        attachments: [{ filename, path: filePath }]
      });
    } else {
      emailStatus = { status: 'skipped', reason: 'no_recipient_email' };
    }
  }

  const stat = await fs.stat(filePath);
  return {
    empresaId,
    filename,
    size: stat.size,
    createdAt: new Date().toISOString(),
    email: emailStatus
  };
}

export async function listBackupsForEmpresa(empresaId) {
  const dir = path.join(BACKUP_DIR, safeFilename(empresaId));
  try {
    const items = await fs.readdir(dir);
    const backups = [];
    for (const file of items) {
      if (!file.endsWith('.json.gz')) continue;
      const stat = await fs.stat(path.join(dir, file));
      backups.push({ filename: file, size: stat.size, mtime: stat.mtime });
    }
    backups.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    return backups.map((b) => ({ filename: b.filename, size: b.size, updatedAt: b.mtime.toISOString() }));
  } catch {
    return [];
  }
}

export async function pruneBackupsForEmpresa(empresaId, { retentionCount, retentionDays } = {}) {
  const keepCount = Number.isFinite(Number(retentionCount)) ? Math.max(1, Number(retentionCount)) : null;
  const keepDays = Number.isFinite(Number(retentionDays)) ? Math.max(1, Number(retentionDays)) : null;

  const dir = path.join(BACKUP_DIR, safeFilename(empresaId));
  let deleted = 0;

  try {
    const items = await fs.readdir(dir);
    const backups = [];
    for (const file of items) {
      if (!file.endsWith('.json.gz')) continue;
      const full = path.join(dir, file);
      const stat = await fs.stat(full);
      backups.push({ filename: file, fullPath: full, mtime: stat.mtime });
    }

    backups.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    const cutoff = keepDays ? Date.now() - keepDays * 24 * 60 * 60 * 1000 : null;

    for (let idx = 0; idx < backups.length; idx++) {
      const b = backups[idx];
      const beyondCount = keepCount ? idx >= keepCount : false;
      const beyondDays = cutoff ? b.mtime.getTime() < cutoff : false;

      if (beyondCount || beyondDays) {
        try {
          await fs.unlink(b.fullPath);
          deleted++;
        } catch {
          // ignore
        }
      }
    }

    return { deleted };
  } catch {
    return { deleted: 0 };
  }
}
