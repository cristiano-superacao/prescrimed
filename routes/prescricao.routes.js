import express from 'express';
import { body } from 'express-validator';
import { authenticate, hasPermission } from '../middleware/auth.middleware.js';
import Prescricao from '../models/Prescricao.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { sendError } from '../utils/error.js';

const router = express.Router();

const findPrescricaoByEmpresa = async (id, req, res) => {
  const prescricao = await Prescricao.findById(id, req.user.empresaId);
  if (!prescricao) {
    res.status(404).json({ error: 'Prescrição não encontrada' });
    return null;
  }
  return prescricao;
};

const executarAcaoPrescricao = async (action, id, req, res, successMessage) => {
  try {
    const prescricao = await action(id, req.user.empresaId);
    res.json({ message: successMessage, prescricao });
  } catch (error) {
    return sendError(res, 500, error.message, error);
  }
};

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
    return sendError(res, 500, 'Erro ao listar prescrições', error);
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
    return sendError(res, 500, 'Erro ao buscar prescrições', error);
  }
});

// GET /api/prescricoes/:id - Buscar prescrição
router.get('/:id', async (req, res) => {
  try {
    const prescricao = await findPrescricaoByEmpresa(req.params.id, req, res);
    if (!prescricao) return;
    res.json(prescricao);
  } catch (error) {
    return sendError(res, 500, 'Erro ao buscar prescrição', error);
  }
});

// POST /api/prescricoes - Criar prescrição
router.post('/', [
  body('pacienteId').notEmpty(),
  body('medicamentos').isArray().notEmpty(),
  validateRequest,
], async (req, res) => {
  try {
    const prescricao = await Prescricao.create({
      ...req.body,
      empresaId: req.user.empresaId,
      medicoId: req.user.id,
    });

    res.status(201).json({ message: 'Prescrição criada com sucesso', prescricao });
  } catch (error) {
    return sendError(res, 500, 'Erro ao criar prescrição', error);
  }
});

// PUT /api/prescricoes/:id/cancelar - Cancelar prescrição
router.put('/:id/cancelar', async (req, res) => {
  return executarAcaoPrescricao(
    Prescricao.cancel,
    req.params.id,
    req,
    res,
    'Prescrição cancelada com sucesso'
  );
});

// PUT /api/prescricoes/:id/arquivar - Arquivar prescrição
router.put('/:id/arquivar', async (req, res) => {
  return executarAcaoPrescricao(
    Prescricao.archive,
    req.params.id,
    req,
    res,
    'Prescrição arquivada com sucesso'
  );
});

export default router;