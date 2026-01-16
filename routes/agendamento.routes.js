import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware.js';
import Agendamento from '../models/Agendamento.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { sendError } from '../utils/error.js';

const router = express.Router();

const handleAgendamentoNotFound = (res) =>
  res.status(404).json({ error: 'Agendamento não encontrado' });

const populateAgendamento = (id) =>
  Agendamento.findById(id)
    .populate('pacienteId', 'nome telefone')
    .populate('medicoId', 'nome');

const findAgendamentoByEmpresa = async (id, req, res) => {
  const agendamento = await Agendamento.findOne({ _id: id, empresaId: req.user.empresaId });

  if (!agendamento) {
    handleAgendamentoNotFound(res);
    return null;
  }

  return agendamento;
};

router.use(authenticate);

// GET /api/agendamentos - Listar agendamentos (com filtros)
router.get('/', async (req, res) => {
  try {
    const { dataInicio, dataFim, medicoId, pacienteId } = req.query;
    const query = { empresaId: req.user.empresaId };

    if (dataInicio && dataFim) {
      query.dataHoraInicio = {
        $gte: new Date(dataInicio),
        $lte: new Date(dataFim)
      };
    }

    if (medicoId) query.medicoId = medicoId;
    if (pacienteId) query.pacienteId = pacienteId;

    const agendamentos = await Agendamento.find(query)
      .populate('pacienteId', 'nome telefone')
      .populate('medicoId', 'nome')
      .sort({ dataHoraInicio: 1 });

    res.json(agendamentos);
  } catch (error) {
    return sendError(res, 500, 'Erro ao listar agendamentos', error);
  }
});

// POST /api/agendamentos - Criar agendamento
router.post('/', [
  body('titulo').notEmpty().withMessage('Título é obrigatório'),
  body('dataHoraInicio').isISO8601().withMessage('Data de início inválida'),
  body('dataHoraFim').isISO8601().withMessage('Data de fim inválida'),
  validateRequest,
], async (req, res) => {
  try {
    const { titulo, local, participante, pacienteId, medicoId, dataHoraInicio, dataHoraFim, tipo, observacoes } = req.body;

    // Verificar conflitos de horário para o médico
    const medico = medicoId || req.user.id; // Se não informado, usa o usuário logado
    
    const conflito = await Agendamento.findOne({
      empresaId: req.user.empresaId,
      medicoId: medico,
      status: { $ne: 'cancelado' },
      $or: [
        {
          dataHoraInicio: { $lt: new Date(dataHoraFim) },
          dataHoraFim: { $gt: new Date(dataHoraInicio) }
        }
      ]
    });

    if (conflito) {
      return res.status(400).json({ error: 'Horário indisponível para este médico' });
    }

    const agendamento = await Agendamento.create({
      empresaId: req.user.empresaId,
      medicoId: medico,
      pacienteId: pacienteId || null,
      titulo,
      local,
      participante,
      dataHoraInicio,
      dataHoraFim,
      tipo,
      observacoes,
      status: 'agendado'
    });

    const agendamentoPopulated = await populateAgendamento(agendamento._id);

    res.status(201).json(agendamentoPopulated);
  } catch (error) {
    return sendError(res, 500, 'Erro ao criar agendamento', error);
  }
});

// PUT /api/agendamentos/:id - Atualizar agendamento
router.put('/:id', async (req, res) => {
  try {
    const { status, observacoes, dataHoraInicio, dataHoraFim, titulo, local, participante } = req.body;
    const agendamento = await findAgendamentoByEmpresa(req.params.id, req, res);
    if (!agendamento) return;

    if (status) agendamento.status = status;
    if (observacoes) agendamento.observacoes = observacoes;
    if (dataHoraInicio) agendamento.dataHoraInicio = dataHoraInicio;
    if (dataHoraFim) agendamento.dataHoraFim = dataHoraFim;
    if (titulo) agendamento.titulo = titulo;
    if (local) agendamento.local = local;
    if (participante) agendamento.participante = participante;

    await agendamento.save();

    const agendamentoPopulated = await populateAgendamento(agendamento._id);

    res.json(agendamentoPopulated);
  } catch (error) {
    return sendError(res, 500, 'Erro ao atualizar agendamento', error);
  }
});

// DELETE /api/agendamentos/:id - Excluir agendamento
router.delete('/:id', async (req, res) => {
  try {
    const agendamento = await Agendamento.findOneAndDelete({ _id: req.params.id, empresaId: req.user.empresaId });
    
    if (!agendamento) {
      return handleAgendamentoNotFound(res);
    }

    res.json({ message: 'Agendamento excluído com sucesso' });
  } catch (error) {
    return sendError(res, 500, 'Erro ao excluir agendamento', error);
  }
});

export default router;
