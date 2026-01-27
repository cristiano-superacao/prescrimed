import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { requireRole } from '../middleware/auth.middleware.js';
import { Empresa } from '../models/index.js';
import { BACKUP_DIR, safeFilename, createBackupForEmpresa, listBackupsForEmpresa } from '../utils/backupCore.js';

const router = express.Router();


// Listar backups de uma empresa
router.get('/empresas/:empresaId', requireRole('superadmin'), async (req, res) => {
  try {
    const { empresaId } = req.params;
    const empresa = await Empresa.findByPk(empresaId);
    if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' });

    const items = await listBackupsForEmpresa(empresaId);
    return res.json({ empresa: { id: empresa.id, nome: empresa.nome, codigo: empresa.codigo || null }, items });
  } catch (error) {
    console.error('Erro ao listar backups:', error);
    return res.status(500).json({ error: 'Erro ao listar backups' });
  }
});

// Gerar backup agora (e opcionalmente enviar por e-mail)
router.post('/empresas/:empresaId', requireRole('superadmin'), async (req, res) => {
  try {
    const { empresaId } = req.params;
    const sendEmail = req.body?.sendEmail !== false; // default: true

    const result = await createBackupForEmpresa(empresaId, { sendEmail });
    return res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao gerar backup:', error);
    const status = error?.status || 500;
    return res.status(status).json({ error: error.message || 'Erro ao gerar backup' });
  }
});

// Download de um backup específico
router.get('/empresas/:empresaId/download/:filename', requireRole('superadmin'), async (req, res) => {
  try {
    const { empresaId } = req.params;
    const filename = safeFilename(req.params.filename);

    const filePath = path.join(BACKUP_DIR, safeFilename(empresaId), filename);

    // Confere existência
    await fs.stat(filePath);

    res.setHeader('Content-Type', 'application/gzip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.sendFile(filePath);
  } catch (error) {
    console.error('Erro ao baixar backup:', error);
    return res.status(404).json({ error: 'Backup não encontrado' });
  }
});

export default router;
