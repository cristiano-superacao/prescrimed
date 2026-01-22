import express from 'express';
import { Usuario, Empresa, Paciente, Prescricao, Agendamento, CasaRepousoLeito, EstoqueItem, FinanceiroTransacao } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

const router = express.Router();

// Dashboard - estatísticas gerais
router.get('/stats', async (req, res) => {
  try {
    const { empresaId } = req.query;
    const where = empresaId ? { empresaId } : {};
    
    // Contadores principais
    const totalEmpresas = await Empresa.count();
    const totalUsuarios = await Usuario.count({ where });
    const totalPacientes = await Paciente.count({ where });
    const totalPrescricoes = await Prescricao.count({ where });
    
    const prescrioesAtivas = await Prescricao.count({
      where: { ...where, status: 'ativa' }
    });

    // Estatísticas de agendamentos
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const agendamentosHoje = await Agendamento.count({
      where: {
        ...where,
        dataHora: {
          [Op.gte]: hoje,
          [Op.lt]: amanha
        }
      }
    });

    // Estatísticas de leitos
    const leitosOcupados = await CasaRepousoLeito.count({
      where: { ...where, status: 'ocupado' }
    });
    
    const leitosDisponiveis = await CasaRepousoLeito.count({
      where: { ...where, status: 'disponivel' }
    });

    // Estatísticas de estoque
    const itensEstoque = await EstoqueItem.count({ where });
    const itensAbaixoMinimo = await EstoqueItem.count({
      where: {
        ...where,
        [Op.and]: [
          sequelize.where(
            sequelize.col('quantidade'),
            '<=',
            sequelize.col('quantidadeMinima')
          )
        ]
      }
    });

    // Estatísticas financeiras
    const financeiro = await FinanceiroTransacao.findAll({
      where,
      attributes: [
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN tipo = 'receita' AND status = 'pago' THEN valor ELSE 0 END")), 'receitasPagas'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN tipo = 'despesa' AND status = 'pago' THEN valor ELSE 0 END")), 'despesasPagas'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN tipo = 'receita' AND status = 'pendente' THEN valor ELSE 0 END")), 'receitasPendentes'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN tipo = 'despesa' AND status = 'pendente' THEN valor ELSE 0 END")), 'despesasPendentes'],
      ],
      raw: true
    });

    const financeiroData = financeiro[0] || {};
    const saldo = (parseFloat(financeiroData.receitasPagas || 0) - parseFloat(financeiroData.despesasPagas || 0));

    // Gráfico de prescrições dos últimos 30 dias
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - 30);

    const graficoPrescricoes = await Prescricao.findAll({
      where: {
        ...where,
        createdAt: { [Op.gte]: dataInicio }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'data'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });
    
    res.json({
      totalEmpresas,
      totalUsuarios,
      totalPacientes,
      totalPrescricoes,
      prescrioesAtivas,
      agendamentosHoje,
      leitos: {
        ocupados: leitosOcupados,
        disponiveis: leitosDisponiveis,
        total: leitosOcupados + leitosDisponiveis
      },
      estoque: {
        total: itensEstoque,
        abaixoMinimo: itensAbaixoMinimo
      },
      financeiro: {
        receitasPagas: parseFloat(financeiroData.receitasPagas || 0),
        despesasPagas: parseFloat(financeiroData.despesasPagas || 0),
        receitasPendentes: parseFloat(financeiroData.receitasPendentes || 0),
        despesasPendentes: parseFloat(financeiroData.despesasPendentes || 0),
        saldo
      },
      graficoPrescricoes
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
    
    // Buscar prescrições ativas
    const prescricoesAtivas = await Prescricao.count({
      where: { ...where, status: 'ativa' }
    });
    
    // Buscar pacientes sem prescrição ativa
    const totalPacientes = await Paciente.count({ where });
    const pacientesComPrescricao = await Prescricao.findAll({
      where: { ...where, status: 'ativa' },
      attributes: ['pacienteId'],
      raw: true
    });
    
    const pacientesIds = pacientesComPrescricao.map(p => p.pacienteId);
    const pacientesSemPrescricao = await Paciente.count({
      where: {
        ...where,
        ...(pacientesIds.length > 0 ? { id: { [Op.notIn]: pacientesIds } } : {})
      }
    });

    const nextSteps = [];

    if (pacientesSemPrescricao > 0) {
      nextSteps.push({
        id: 'pacientes-sem-prescricao',
        title: 'Pacientes sem Prescrição',
        description: `${pacientesSemPrescricao} paciente(s) sem prescrição ativa`,
        ctaLabel: 'Ver Pacientes',
        ctaRoute: '/residentes'
      });
    }

    if (prescricoesAtivas > 0) {
      nextSteps.push({
        id: 'prescricoes-ativas',
        title: 'Prescrições Ativas',
        description: `${prescricoesAtivas} prescrição(ões) em uso`,
        ctaLabel: 'Ver Prescrições',
        ctaRoute: '/prescricoes'
      });
    }
    
    // Sempre sugerir criar nova prescrição se houver pacientes
    if (totalPacientes > 0) {
      nextSteps.push({
        id: 'criar-prescricao',
        title: 'Nova Prescrição',
        description: 'Criar prescrição para um paciente',
        ctaLabel: 'Criar',
        ctaRoute: '/prescricoes/nova'
      });
    }
    
    res.json({ nextSteps });
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
