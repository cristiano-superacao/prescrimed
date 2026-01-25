import express from 'express';
import { Pet } from '../models/index.js';
import { authenticate, tenantIsolation, checkResourceOwnership } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/pets', authenticate, tenantIsolation, async (req, res) => {
  const empresaId = req.query.empresaId || req.user?.empresaId;
  const items = await Pet.findAll({ where: { empresaId } });
  res.json(items);
});

router.post('/pets', authenticate, tenantIsolation, async (req, res) => {
  const item = await Pet.create({
    empresaId: req.body.empresaId,
    nome: req.body.nome,
    especie: req.body.especie,
    raca: req.body.raca,
    tutorNome: req.body.tutorNome,
    observacoes: req.body.observacoes,
  });
  res.status(201).json(item);
});

router.get('/pets/:id', authenticate, tenantIsolation, checkResourceOwnership(Pet), async (req, res) => {
  const item = await Pet.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Pet não encontrado' });
  res.json(item);
});

router.put('/pets/:id', authenticate, tenantIsolation, checkResourceOwnership(Pet), async (req, res) => {
  const item = await Pet.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Pet não encontrado' });
  await item.update({
    nome: req.body.nome ?? item.nome,
    especie: req.body.especie ?? item.especie,
    raca: req.body.raca ?? item.raca,
    tutorNome: req.body.tutorNome ?? item.tutorNome,
    observacoes: req.body.observacoes ?? item.observacoes,
  });
  res.json(item);
});

router.delete('/pets/:id', authenticate, tenantIsolation, checkResourceOwnership(Pet), async (req, res) => {
  const item = await Pet.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Pet não encontrado' });
  await item.destroy();
  res.status(204).send();
});

export default router;
