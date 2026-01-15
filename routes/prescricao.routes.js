import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, hasPermission } from '../middleware/auth.middleware.js';
import Prescricao from '../models/Prescricao.js';

const router = express.Router();

router.use(authenticate);
router.use(hasPermission('prescricoes'));

// GET /api/prescricoes - Listar prescrições
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0, ...filters } = req.query;
    
    const prescricoes = await Prescricao.findByEmpresa(
      req.user.empresaId,
      filters,
      parseInt(limit),
      parseInt(offset)
    );

    const total = await Prescricao.countByEmpresa(req.user.empresaId, filters);

    res.json({ prescricoes, total, limit: parseInt(limit), offset: parseInt(offset) });
  } catch (error) {
    console.error('Erro ao listar prescrições:', error);
    res.status(500).json({ error: 'Erro ao listar prescrições' });
  }
});

// GET /api/prescricoes/paciente/:pacienteId - Prescrições de um paciente
router.get('/paciente/:pacienteId', async (req, res) => {
  try {
    const prescricoes = await Prescricao.findByPaciente(
      req.params.pacienteId,
      req.user.empresaId
    );
    res.json({ prescricoes });
  } catch (error) {
    console.error('Erro ao buscar prescrições do paciente:', error);
    res.status(500).json({ error: 'Erro ao buscar prescrições' });
  }
});

// GET /api/prescricoes/:id - Buscar prescrição
router.get('/:id', async (req, res) => {
  try {
    const prescricao = await Prescricao.findById(req.params.id, req.user.empresaId);
    if (!prescricao) {
      return res.status(404).json({ error: 'Prescrição não encontrada' });
    }
    res.json(prescricao);
  } catch (error) {
    console.error('Erro ao buscar prescrição:', error);
    res.status(500).json({ error: 'Erro ao buscar prescrição' });
  }
});

// POST /api/prescricoes - Criar prescrição
router.post('/', [
  body('pacienteId').notEmpty(),
  body('medicamentos').isArray().notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const prescricao = await Prescricao.create({
      ...req.body,
      empresaId: req.user.empresaId,
      medicoId: req.user.id,
    });

    res.status(201).json({ message: 'Prescrição criada com sucesso', prescricao });
  } catch (error) {
    console.error('Erro ao criar prescrição:', error);
    res.status(500).json({ error: 'Erro ao criar prescrição' });
  }
});

// PUT /api/prescricoes/:id/cancelar - Cancelar prescrição
router.put('/:id/cancelar', async (req, res) => {
  try {
    const prescricao = await Prescricao.cancel(req.params.id, req.user.empresaId);
    res.json({ message: 'Prescrição cancelada com sucesso', prescricao });
  } catch (error) {
    console.error('Erro ao cancelar prescrição:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/prescricoes/:id/arquivar - Arquivar prescrição
router.put('/:id/arquivar', async (req, res) => {
  try {
    const prescricao = await Prescricao.archive(req.params.id, req.user.empresaId);
    res.json({ message: 'Prescrição arquivada com sucesso', prescricao });
  } catch (error) {
    console.error('Erro ao arquivar prescrição:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;