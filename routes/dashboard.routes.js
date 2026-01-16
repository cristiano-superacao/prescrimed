import express from 'express';
import { Usuario, Empresa, Paciente, Prescricao } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Dashboard - estatísticas gerais
router.get('/stats', async (req, res) => {
  try {
    const { empresaId } = req.query;
    const where = empresaId ? { empresaId } : {};
    
    const totalEmpresas = await Empresa.count();
    const totalUsuarios = await Usuario.count({ where });
    const totalPacientes = await Paciente.count({ where });
    const totalPrescricoes = await Prescricao.count({ where });
    
    const prescrioesAtivas = await Prescricao.count({
      where: { ...where, status: 'ativa' }
    });
    
    res.json({
      totalEmpresas,
      totalUsuarios,
      totalPacientes,
      totalPrescricoes,
      prescrioesAtivas
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Dashboard - prescrições recentes
router.get('/prescricoes-recentes', async (req, res) => {
  try {
    const { empresaId, limit = 10 } = req.query;
    const where = empresaId ? { empresaId } : {};
    
    const prescricoes = await Prescricao.findAll({
      where,
      include: [
        { model: Paciente, as: 'paciente', attributes: ['id', 'nome'] },
        { model: Usuario, as: 'nutricionista', attributes: ['id', 'nome'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });
    
    res.json(prescricoes);
  } catch (error) {
    console.error('Erro ao buscar prescrições recentes:', error);
    res.status(500).json({ error: 'Erro ao buscar prescrições recentes' });
  }
});

export default router;
