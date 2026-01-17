import express from 'express';
import { CasaRepousoLeito } from '../models/index.js';
import { authenticate, tenantIsolation, checkResourceOwnership } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/leitos', authenticate, tenantIsolation, async (req, res) => {
  const items = await CasaRepousoLeito.findAll({ where: { empresaId: req.query.empresaId } });
  res.json(items);
});

router.post('/leitos', authenticate, tenantIsolation, async (req, res) => {
  const item = await CasaRepousoLeito.create({
    empresaId: req.body.empresaId,
    numero: req.body.numero,
    status: req.body.status,
    observacoes: req.body.observacoes,
  });
  res.status(201).json(item);
});

router.get('/leitos/:id', authenticate, tenantIsolation, checkResourceOwnership(CasaRepousoLeito), async (req, res) => {
  const item = await CasaRepousoLeito.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Leito não encontrado' });
  res.json(item);
});

router.put('/leitos/:id', authenticate, tenantIsolation, checkResourceOwnership(CasaRepousoLeito), async (req, res) => {
  const item = await CasaRepousoLeito.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Leito não encontrado' });
  await item.update({
    numero: req.body.numero ?? item.numero,
    status: req.body.status ?? item.status,
    observacoes: req.body.observacoes ?? item.observacoes,
  });
  res.json(item);
});

router.delete('/leitos/:id', authenticate, tenantIsolation, checkResourceOwnership(CasaRepousoLeito), async (req, res) => {
  const item = await CasaRepousoLeito.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Leito não encontrado' });
  await item.destroy();
  res.status(204).send();
});

export default router;
