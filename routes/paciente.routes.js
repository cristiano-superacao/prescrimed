import express from 'express';
import { Paciente, Empresa } from '../models/index.js';
import { authenticate, tenantIsolation } from '../middleware/auth.middleware.js';

const router = express.Router();

// Listar todos os pacientes
router.get('/', authenticate, tenantIsolation, async (req, res) => {
  try {
    const { empresaId, page = 1, pageSize = 10 } = req.query;
    const where = empresaId ? { empresaId } : {};
    const limit = Math.max(1, parseInt(pageSize));
    const offset = (Math.max(1, parseInt(page)) - 1) * limit;

    const { rows, count } = await Paciente.findAndCountAll({
      where,
      include: [{ model: Empresa, as: 'empresa', attributes: ['id', 'nome'] }],
      order: [['updatedAt', 'DESC']],
      limit,
      offset
    });
    res.json({ items: rows, total: count, page: parseInt(page), pageSize: limit });
  } catch (error) {
    console.error('Erro ao listar pacientes:', error);
    res.status(500).json({ error: 'Erro ao listar pacientes' });
  }
});

// Buscar paciente por ID
router.get('/:id', authenticate, tenantIsolation, async (req, res) => {
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

// Helper: verifica se role pode cadastrar residente conforme tipoSistema
const canCreateResident = (tipoSistema, role) => {
  if (role === 'superadmin') return true;
  const casaRepousoPetshopRoles = ['admin', 'enfermeiro', 'assistente_social', 'medico'];
  const fisioterapiaRoles = ['admin', 'enfermeiro', 'assistente_social', 'fisioterapeuta', 'medico'];
  if (tipoSistema === 'fisioterapia') return fisioterapiaRoles.includes(role);
  // casa-repouso e petshop
  return casaRepousoPetshopRoles.includes(role);
};

// Criar novo paciente
router.post('/', authenticate, tenantIsolation, async (req, res) => {
  try {
    // empresaId já foi forçado pelo middleware tenantIsolation
    const empresaId = req.body?.empresaId || req.tenantEmpresaId;
    const empresa = await Empresa.findByPk(empresaId);
    const role = req.user?.role;

    if (!empresa) {
      return res.status(400).json({ error: 'Empresa inválida para cadastro do residente' });
    }

    if (!canCreateResident(empresa.tipoSistema, role)) {
      return res.status(403).json({ error: 'Acesso negado: seu perfil não pode cadastrar residentes neste módulo' });
    }

    const paciente = await Paciente.create(req.body);
    res.status(201).json(paciente);
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    res.status(500).json({ error: 'Erro ao criar paciente' });
  }
});

// Atualizar paciente
router.put('/:id', authenticate, tenantIsolation, async (req, res) => {
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
router.delete('/:id', authenticate, tenantIsolation, async (req, res) => {
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
