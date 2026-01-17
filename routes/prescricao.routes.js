import express from 'express';
import { Prescricao, Paciente, Usuario } from '../models/index.js';

const router = express.Router();

// Listar todas as prescrições
router.get('/', async (req, res) => {
  try {
    const { empresaId, pacienteId } = req.query;
    const where = {};
    if (empresaId) where.empresaId = empresaId;
    if (pacienteId) where.pacienteId = pacienteId;
    
    const prescricoes = await Prescricao.findAll({
      where,
      include: [
        { model: Paciente, as: 'paciente', attributes: ['id', 'nome', 'cpf'] },
        { model: Usuario, as: 'nutricionista', attributes: ['id', 'nome', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(prescricoes);
  } catch (error) {
    console.error('Erro ao listar prescrições:', error);
    res.status(500).json({ error: 'Erro ao listar prescrições' });
  }
});

// Buscar prescrição por ID
router.get('/:id', async (req, res) => {
  try {
    const { empresaId } = req.query;
    const where = { id: req.params.id };
    
    // Aplica filtro de empresa se não for superadmin
    if (empresaId) {
      where.empresaId = empresaId;
    }
    
    const prescricao = await Prescricao.findOne({
      where,
      include: [
        { model: Paciente, as: 'paciente' },
        { model: Usuario, as: 'nutricionista', attributes: ['id', 'nome', 'email'] }
      ]
    });
    
    if (!prescricao) {
      return res.status(404).json({ error: 'Prescrição não encontrada ou sem permissão de acesso' });
    }
    
    res.json(prescricao);
  } catch (error) {
    console.error('Erro ao buscar prescrição:', error);
    res.status(500).json({ error: 'Erro ao buscar prescrição' });
  }
});

// Criar nova prescrição
router.post('/', async (req, res) => {
  try {
    // empresaId já foi forçado pelo middleware tenantIsolation
    const prescricao = await Prescricao.create(req.body);
    res.status(201).json(prescricao);
  } catch (error) {
    console.error('Erro ao criar prescrição:', error);
    res.status(500).json({ error: 'Erro ao criar prescrição' });
  }
});

// Atualizar prescrição
router.put('/:id', async (req, res) => {
  try {
    const where = { id: req.params.id };
    
    // Força filtro por empresa se não for superadmin
    if (req.tenantEmpresaId) {
      where.empresaId = req.tenantEmpresaId;
    }
    
    const prescricao = await Prescricao.findOne({ where });
    
    if (!prescricao) {
      return res.status(404).json({ error: 'Prescrição não encontrada ou sem permissão de acesso' });
    }
    
    // Remove empresaId do body para evitar alteração
    const { empresaId, ...updateData } = req.body;
    
    await prescricao.update(updateData);
    res.json(prescricao);
  } catch (error) {
    console.error('Erro ao atualizar prescrição:', error);
    res.status(500).json({ error: 'Erro ao atualizar prescrição' });
  }
});

// Deletar prescrição
router.delete('/:id', async (req, res) => {
  try {
    const where = { id: req.params.id };
    
    // Força filtro por empresa se não for superadmin
    if (req.tenantEmpresaId) {
      where.empresaId = req.tenantEmpresaId;
    }
    
    const prescricao = await Prescricao.findOne({ where });
    
    if (!prescricao) {
      return res.status(404).json({ error: 'Prescrição não encontrada ou sem permissão de acesso' });
    }
    
    await prescricao.destroy();
    res.json({ message: 'Prescrição deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar prescrição:', error);
    res.status(500).json({ error: 'Erro ao deletar prescrição' });
  }
});

export default router;
