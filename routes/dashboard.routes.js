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

// Dashboard - pacientes recentes
router.get('/pacientes-recentes', async (req, res) => {
  try {
    const { empresaId, limit = 10 } = req.query;
    const where = empresaId ? { empresaId } : {};
    
    const pacientes = await Paciente.findAll({
      where,
      include: [
        { model: Empresa, as: 'empresa', attributes: ['id', 'nome'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });
    
    res.json(pacientes);
  } catch (error) {
    console.error('Erro ao buscar pacientes recentes:', error);
    res.status(500).json({ error: 'Erro ao buscar pacientes recentes' });
  }
});

// Dashboard - próximos passos (ações recomendadas)
router.get('/next-steps', async (req, res) => {
  try {
    const { empresaId } = req.query;
    const where = empresaId ? { empresaId } : {};
    
    // Buscar prescrições pendentes ou que precisam revisão
    const prescricoesPendentes = await Prescricao.count({
      where: { ...where, status: 'pendente' }
    });
    
    // Buscar pacientes sem prescrição ativa
    const prescricoesAtivas = await Prescricao.findAll({
      where: { ...where, status: 'ativa' },
      attributes: ['pacienteId'],
      raw: true
    });
    
    const pacientesComPrescricao = prescricoesAtivas.map(p => p.pacienteId);
    const pacientesSemPrescricao = await Paciente.count({
      where: {
        ...where,
        ...(pacientesComPrescricao.length > 0 ? { id: { [Op.notIn]: pacientesComPrescricao } } : {})
      }
    });
    
    const nextSteps = [];
    
    if (prescricoesPendentes > 0) {
      nextSteps.push({
        id: 'prescricoes-pendentes',
        title: 'Prescrições Pendentes',
        description: `${prescricoesPendentes} prescrição(ões) aguardando aprovação`,
        action: 'Ver Prescrições',
        link: '/prescricoes',
        priority: 'high'
      });
    }
    
    if (pacientesSemPrescricao > 0) {
      nextSteps.push({
        id: 'pacientes-sem-prescricao',
        title: 'Pacientes sem Prescrição Ativa',
        description: `${pacientesSemPrescricao} paciente(s) sem prescrição ativa`,
        action: 'Ver Pacientes',
        link: '/pacientes',
        priority: 'medium'
      });
    }
    
    // Sempre sugerir criar nova prescrição se houver pacientes
    const totalPacientes = await Paciente.count({ where });
    if (totalPacientes > 0 && nextSteps.length < 3) {
      nextSteps.push({
        id: 'criar-prescricao',
        title: 'Nova Prescrição',
        description: 'Criar uma nova prescrição para paciente',
        action: 'Criar Prescrição',
        link: '/prescricoes/nova',
        priority: 'low'
      });
    }
    
    res.json({ steps: nextSteps });
  } catch (error) {
    console.error('Erro ao buscar próximos passos:', error);
    res.status(500).json({ error: 'Erro ao buscar próximos passos' });
  }
});

// Dashboard - alertas prioritários
router.get('/alerts', async (req, res) => {
  try {
    const { empresaId } = req.query;
    const where = empresaId ? { empresaId } : {};
    
    const alerts = [];
    
    // Verificar prescrições expirando (criadas há mais de 30 dias)
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);
    
    const prescricoesAntigas = await Prescricao.count({
      where: {
        ...where,
        status: 'ativa',
        createdAt: { [Op.lt]: dataLimite }
      }
    });
    
    if (prescricoesAntigas > 0) {
      alerts.push({
        id: 'prescricoes-antigas',
        title: 'Prescrições para Revisão',
        message: `${prescricoesAntigas} prescrição(ões) ativa(s) há mais de 30 dias`,
        severity: 'warning',
        action: 'Revisar',
        link: '/prescricoes'
      });
    }
    
    // Verificar se há pacientes cadastrados recentemente (últimos 7 dias)
    const dataRecente = new Date();
    dataRecente.setDate(dataRecente.getDate() - 7);
    
    const pacientesNovos = await Paciente.count({
      where: {
        ...where,
        createdAt: { [Op.gte]: dataRecente }
      }
    });
    
    if (pacientesNovos > 0) {
      alerts.push({
        id: 'pacientes-novos',
        title: 'Novos Pacientes',
        message: `${pacientesNovos} novo(s) paciente(s) cadastrado(s) esta semana`,
        severity: 'info',
        action: 'Ver Pacientes',
        link: '/pacientes'
      });
    }
    
    res.json({ alerts });
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    res.status(500).json({ error: 'Erro ao buscar alertas' });
  }
});

export default router;
