import express from 'express';
import { Paciente, Empresa } from '../models/index.js';

const router = express.Router();

// Listar todos os pacientes
router.get('/', async (req, res) => {
  try {
    const { empresaId } = req.query;
    const where = empresaId ? { empresaId } : {};
    
    const pacientes = await Paciente.findAll({
      where,
      include: [{ model: Empresa, as: 'empresa', attributes: ['id', 'nome'] }]
    });
    res.json(pacientes);
  } catch (error) {
    console.error('Erro ao listar pacientes:', error);
    res.status(500).json({ error: 'Erro ao listar pacientes' });
  }
});

// Buscar paciente por ID
router.get('/:id', async (req, res) => {
  try {
    const { empresaId } = req.query;
    const where = { id: req.params.id };
    
    // Aplica filtro de empresa se não for superadmin
    if (empresaId) {
      where.empresaId = empresaId;
    }
    
    const paciente = await Paciente.findOne({
      where,
      include: [{ model: Empresa, as: 'empresa', attributes: ['id', 'nome'] }]
    });
    
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado ou sem permissão de acesso' });
    }
    
    res.json(paciente);
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    res.status(500).json({ error: 'Erro ao buscar paciente' });
  }
});

// Criar novo paciente
router.post('/', async (req, res) => {
  try {
    // empresaId já foi forçado pelo middleware tenantIsolation
    const paciente = await Paciente.create(req.body);
    res.status(201).json(paciente);
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    res.status(500).json({ error: 'Erro ao criar paciente' });
  }
});

// Atualizar paciente
router.put('/:id', async (req, res) => {
  try {
    const where = { id: req.params.id };
    
    // Força filtro por empresa se não for superadmin
    if (req.tenantEmpresaId) {
      where.empresaId = req.tenantEmpresaId;
    }
    
    const paciente = await Paciente.findOne({ where });
    
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado ou sem permissão de acesso' });
    }
    
    // Remove empresaId do body para evitar alteração
    const { empresaId, ...updateData } = req.body;
    
    await paciente.update(updateData);
    res.json(paciente);
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    res.status(500).json({ error: 'Erro ao atualizar paciente' });
  }
});

// Deletar paciente
router.delete('/:id', async (req, res) => {
  try {
    const where = { id: req.params.id };
    
    // Força filtro por empresa se não for superadmin
    if (req.tenantEmpresaId) {
      where.empresaId = req.tenantEmpresaId;
    }
    
    const paciente = await Paciente.findOne({ where });
    
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado ou sem permissão de acesso' });
    }
    
    await paciente.destroy();
    res.json({ message: 'Paciente deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    res.status(500).json({ error: 'Erro ao deletar paciente' });
  }
});

export default router;
