import express from 'express';
import { SessaoFisio } from '../models/index.js';
import { authenticate, tenantIsolation, checkResourceOwnership } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/sessoes', authenticate, tenantIsolation, async (req, res) => {
  const empresaId = req.query.empresaId || req.user?.empresaId;
  const { page = 1, pageSize = 10 } = req.query;
  const where = { empresaId };
  const limit = Math.max(1, parseInt(pageSize));
  const offset = (Math.max(1, parseInt(page)) - 1) * limit;
  const { rows, count } = await SessaoFisio.findAndCountAll({ where, order: [['updatedAt', 'DESC']], limit, offset });
  res.json({ items: rows, total: count, page: parseInt(page), pageSize: limit });
});

router.post('/sessoes', authenticate, tenantIsolation, async (req, res) => {
  const item = await SessaoFisio.create({
    empresaId: req.body.empresaId,
    pacienteId: req.body.pacienteId,
    protocolo: req.body.protocolo,
    dataHora: req.body.dataHora,
    duracao: req.body.duracao,
    observacoes: req.body.observacoes,
  });
  res.status(201).json(item);
});

router.get('/sessoes/:id', authenticate, tenantIsolation, checkResourceOwnership(SessaoFisio), async (req, res) => {
  const item = await SessaoFisio.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Sessão não encontrada' });
  res.json(item);
});

router.put('/sessoes/:id', authenticate, tenantIsolation, checkResourceOwnership(SessaoFisio), async (req, res) => {
  const item = await SessaoFisio.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Sessão não encontrada' });
  await item.update({
    pacienteId: req.body.pacienteId ?? item.pacienteId,
    protocolo: req.body.protocolo ?? item.protocolo,
    dataHora: req.body.dataHora ?? item.dataHora,
    duracao: req.body.duracao ?? item.duracao,
    observacoes: req.body.observacoes ?? item.observacoes,
  });
  res.json(item);
});

router.delete('/sessoes/:id', authenticate, tenantIsolation, checkResourceOwnership(SessaoFisio), async (req, res) => {
  const item = await SessaoFisio.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Sessão não encontrada' });
  await item.destroy();
  res.status(204).send();
});

export default router;
