import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, checkEmpresaOwnership } from '../middleware/auth.middleware.js';
import Agendamento from '../models/Agendamento.js';
import Paciente from '../models/Paciente.js';
import Usuario from '../models/Usuario.js';

const router = express.Router();

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
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao listar agendamentos' });
  }
});

// POST /api/agendamentos - Criar agendamento
router.post('/', [
  body('titulo').notEmpty().withMessage('Título é obrigatório'),
  body('dataHoraInicio').isISO8601().withMessage('Data de início inválida'),
  body('dataHoraFim').isISO8601().withMessage('Data de fim inválida'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

    const agendamentoPopulated = await Agendamento.findById(agendamento._id)
      .populate('pacienteId', 'nome telefone')
      .populate('medicoId', 'nome');

    res.status(201).json(agendamentoPopulated);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

// PUT /api/agendamentos/:id - Atualizar agendamento
router.put('/:id', async (req, res) => {
  try {
    const { status, observacoes, dataHoraInicio, dataHoraFim, titulo, local, participante } = req.body;
    const agendamento = await Agendamento.findOne({ _id: req.params.id, empresaId: req.user.empresaId });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    if (status) agendamento.status = status;
    if (observacoes) agendamento.observacoes = observacoes;
    if (dataHoraInicio) agendamento.dataHoraInicio = dataHoraInicio;
    if (dataHoraFim) agendamento.dataHoraFim = dataHoraFim;
    if (titulo) agendamento.titulo = titulo;
    if (local) agendamento.local = local;
    if (participante) agendamento.participante = participante;

    await agendamento.save();

    const agendamentoPopulated = await Agendamento.findById(agendamento._id)
      .populate('pacienteId', 'nome telefone')
      .populate('medicoId', 'nome');

    res.json(agendamentoPopulated);
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
});

// DELETE /api/agendamentos/:id - Excluir agendamento
router.delete('/:id', async (req, res) => {
  try {
    const agendamento = await Agendamento.findOneAndDelete({ _id: req.params.id, empresaId: req.user.empresaId });
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    res.json({ message: 'Agendamento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    res.status(500).json({ error: 'Erro ao excluir agendamento' });
  }
});

export default router;
