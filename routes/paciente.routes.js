import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, hasPermission } from '../middleware/auth.middleware.js';
import Paciente from '../models/Paciente.js';
import Prescricao from '../models/Prescricao.js';

const router = express.Router();

router.use(authenticate);
router.use(hasPermission('pacientes'));

// GET /api/pacientes - Listar pacientes
// Helper para cálculo de idade
function calcularIdade(dataNascimento) {
  if (!dataNascimento) return null;

  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade;
}

router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0, search, status } = req.query;

    let query = { empresaId: req.user.empresaId };

    if (search) {
      query.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { cpf: { $regex: search.replace(/\D/g, ''), $options: 'i' } },
      ];
    }
    
    if (status) {
      query.status = status;
    }

    const [pacientes, total] = await Promise.all([
      Paciente.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .lean(),
      Paciente.countDocuments(query)
    ]);

    // Adicionar idade calculada
    const pacientesComIdade = pacientes.map(p => ({
      ...p,
      id: p._id,
      idade: calcularIdade(p.dataNascimento),
    }));

    res.json({ pacientes: pacientesComIdade, total, limit: parseInt(limit), offset: parseInt(offset) });
  } catch (error) {
    console.error('Erro ao listar pacientes:', error);
    res.status(500).json({ error: 'Erro ao listar pacientes' });
  }
});

// GET /api/pacientes/:id - Buscar paciente
router.get('/:id', async (req, res) => {
  try {
    const paciente = await Paciente.findOne({
      _id: req.params.id,
      empresaId: req.user.empresaId
    }).lean();

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    const idade = calcularIdade(paciente.dataNascimento);

    res.json({ ...paciente, id: paciente._id, idade });
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    res.status(500).json({ error: 'Erro ao buscar paciente' });
  }
});

// GET /api/pacientes/:id/prescricoes - Histórico de prescrições do paciente
router.get('/:id/prescricoes', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const paciente = await Paciente.findOne({
      _id: req.params.id,
      empresaId: req.user.empresaId
    });

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    const [prescricoes, total] = await Promise.all([
      Prescricao.find({
        empresaId: req.user.empresaId,
        pacienteId: req.params.id
      })
        .populate('medicoId', 'nome crm')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .lean(),
      Prescricao.countDocuments({
        empresaId: req.user.empresaId,
        pacienteId: req.params.id
      })
    ]);

    res.json({ prescricoes, total });
  } catch (error) {
    console.error('Erro ao buscar prescrições do paciente:', error);
    res.status(500).json({ error: 'Erro ao buscar prescrições' });
  }
});

// POST /api/pacientes - Criar paciente
router.post('/', [
  body('nome').trim().notEmpty(),
  body('dataNascimento').notEmpty(),
  body('sexo').isIn(['M', 'F', 'Outro']),
  body('telefone').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const paciente = await Paciente.create({
      ...req.body,
      empresaId: req.user.empresaId,
      criadoPor: req.user.id,
    });

    res.status(201).json({ message: 'Paciente criado com sucesso', paciente });
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    res.status(500).json({ error: 'Erro ao criar paciente' });
  }
});

// PUT /api/pacientes/:id - Atualizar paciente
router.put('/:id', async (req, res) => {
  try {
    const paciente = await Paciente.update(req.params.id, req.user.empresaId, req.body);
    res.json({ message: 'Paciente atualizado com sucesso', paciente });
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/pacientes/:id - Deletar paciente
router.delete('/:id', async (req, res) => {
  try {
    await Paciente.delete(req.params.id, req.user.empresaId);
    res.json({ message: 'Paciente desativado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;