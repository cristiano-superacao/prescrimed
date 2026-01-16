import express from 'express';
import { authenticate, hasPermission } from '../middleware/auth.middleware.js';
import Prescricao from '../models/Prescricao.js';
import Paciente from '../models/Paciente.js';
import Usuario from '../models/Usuario.js';
import { calculateAge } from '../utils/date.js';
import { sendError } from '../utils/error.js';

const router = express.Router();

router.use(authenticate);
router.use(hasPermission('dashboard'));

// GET /api/dashboard/stats - Estatísticas do dashboard
router.get('/stats', async (req, res) => {
  try {
    const { periodo = '30' } = req.query; // dias
    
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - parseInt(periodo));

    // Contar totais
    const [totalPacientes, totalUsuarios, totalPrescricoes, totalPrescricoesAtivas] = await Promise.all([
      Paciente.countByEmpresa(req.user.empresaId),
      Usuario.countByEmpresa(req.user.empresaId),
      Prescricao.countByEmpresa(req.user.empresaId),
      Prescricao.countByEmpresa(req.user.empresaId, { status: 'ativa' }),
    ]);

    // Prescrições do período com dados diários para o gráfico
    const prescricoesPeriodo = await Prescricao.find({
      empresaId: req.user.empresaId,
      createdAt: { $gte: dataInicio }
    }).sort({ createdAt: 1 });

    // Agrupar por dia para o gráfico
    const dailyStats = {};
    prescricoesPeriodo.forEach(p => {
      const dateKey = new Date(p.createdAt).toISOString().split('T')[0];
      dailyStats[dateKey] = (dailyStats[dateKey] || 0) + 1;
    });

    const graficoPrescricoes = Object.entries(dailyStats).map(([data, total]) => ({
      data,
      total
    }));

    // Cálculo de crescimento
    const mesAnterior = new Date();
    mesAnterior.setMonth(mesAnterior.getMonth() - 1);
    
    const [pacientesMesAtual, pacientesMesAnterior] = await Promise.all([
      Paciente.countDocuments({
        empresaId: req.user.empresaId,
        createdAt: { $gte: dataInicio }
      }),
      Paciente.countDocuments({
        empresaId: req.user.empresaId,
        createdAt: { $gte: mesAnterior, $lt: dataInicio }
      })
    ]);

    const crescimentoPacientes = pacientesMesAnterior > 0 
      ? Math.round(((pacientesMesAtual - pacientesMesAnterior) / pacientesMesAnterior) * 100)
      : 0;

    res.json({
      stats: {
        totalPacientes,
        totalUsuarios,
        totalPrescricoes,
        totalPrescricoesAtivas,
        prescricoesPeriodo: prescricoesPeriodo.length,
        graficoPrescricoes,
        crescimentoPacientes,
        periodo: parseInt(periodo)
      },
      periodo: parseInt(periodo),
    });
  } catch (error) {
    return sendError(res, 500, 'Erro ao buscar estatísticas', error);
  }
});

// GET /api/dashboard/prescricoes-recentes - Prescrições recentes
router.get('/prescricoes-recentes', async (req, res) => {
  try {
    const prescricoes = await Prescricao.find({ empresaId: req.user.empresaId })
      .populate('pacienteId', 'nome cpf')
      .populate('medicoId', 'nome crm')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const prescricoesFormatadas = prescricoes.map(p => ({
      ...p,
      pacienteNome: p.pacienteId?.nome || 'Paciente não encontrado',
      medicoNome: p.medicoId?.nome || 'Médico não encontrado',
    }));

    res.json({ prescricoes: prescricoesFormatadas });
  } catch (error) {
    return sendError(res, 500, 'Erro ao buscar prescrições', error);
  }
});

// GET /api/dashboard/pacientes-recentes - Pacientes recentes
router.get('/pacientes-recentes', async (req, res) => {
  try {
    const pacientes = await Paciente.find({ empresaId: req.user.empresaId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    const pacientesComIdade = pacientes.map(p => ({
      ...p,
      idade: calculateAge(p.dataNascimento)
    }));

    res.json({ pacientes: pacientesComIdade });
  } catch (error) {
    return sendError(res, 500, 'Erro ao buscar pacientes recentes', error);
  }
});

// GET /api/dashboard/next-steps - Próximos passos operacionais
router.get('/next-steps', async (req, res) => {
  try {
    const empresaId = req.user.empresaId;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [pacientesPendentes, prescricoesControladasPendentes, usuariosInativos] = await Promise.all([
      Paciente.countDocuments({
        empresaId,
        $or: [
          { cpf: { $exists: false } },
          { cpf: '' },
          { telefone: { $exists: false } },
          { telefone: '' },
        ],
      }),
      Prescricao.countDocuments({
        empresaId,
        status: 'ativa',
        tipo: 'controlado',
        updatedAt: { $lte: thirtyDaysAgo },
      }),
      Usuario.countDocuments({ empresaId, status: 'inativo' }),
    ]);

    const nextSteps = [];

    if (pacientesPendentes > 0) {
      nextSteps.push({
        id: 'pending-patients',
        title: 'Completar cadastros pendentes',
        description: `${pacientesPendentes} paciente(s) sem CPF ou telefone confirmado.`,
        ctaLabel: 'Ir para Pacientes',
        ctaRoute: '/pacientes',
      });
    }

    if (prescricoesControladasPendentes > 0) {
      nextSteps.push({
        id: 'controlled-review',
        title: 'Revisar prescrições controladas',
        description: `${prescricoesControladasPendentes} prescrição(ões) ativas há mais de 30 dias`,
        ctaLabel: 'Abrir Prescrições',
        ctaRoute: '/prescricoes',
      });
    }

    if (usuariosInativos > 0) {
      nextSteps.push({
        id: 'inactive-users',
        title: 'Reativar usuários essenciais',
        description: `${usuariosInativos} usuário(s) com acesso inativo nesta conta.`,
        ctaLabel: 'Gerenciar Usuários',
        ctaRoute: '/usuarios',
      });
    }

    if (nextSteps.length === 0) {
      nextSteps.push({
        id: 'all-good',
        title: 'Tudo em dia',
        description: 'Nenhuma pendência operacional identificada nas últimas 24h.',
        ctaLabel: 'Ver dashboard',
        ctaRoute: '/dashboard',
      });
    }

    res.json({ nextSteps });
  } catch (error) {
    return sendError(res, 500, 'Erro ao buscar próximos passos', error);
  }
});

// GET /api/dashboard/alerts - Alertas críticos
router.get('/alerts', async (req, res) => {
  try {
    const empresaId = req.user.empresaId;
    const fortyEightHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 48);

    const [usuariosSemCrm, pacientesInativos, ultimaPrescricao] = await Promise.all([
      Usuario.countDocuments({
        empresaId,
        role: { $ne: 'admin' },
        $or: [
          { crm: { $exists: false } },
          { crm: '' },
        ],
      }),
      Paciente.countDocuments({ empresaId, status: 'inativo' }),
      Prescricao.findOne({ empresaId }).sort({ updatedAt: -1 }).select('updatedAt'),
    ]);

    const alerts = [];

    if (usuariosSemCrm > 0) {
      alerts.push({
        id: 'crm-missing',
        title: 'Profissionais sem CRM informado',
        detail: `${usuariosSemCrm} membro(s) da equipe precisam atualizar o CRM antes de emitir controlados.`,
        severity: 'warning',
      });
    }

    if (pacientesInativos > 0) {
      alerts.push({
        id: 'inactive-patients',
        title: 'Pacientes inativos com histórico recente',
        detail: `${pacientesInativos} paciente(s) foram marcados como inativos nas últimas semanas.`,
        severity: 'info',
      });
    }

    if (!ultimaPrescricao || ultimaPrescricao.updatedAt < fortyEightHoursAgo) {
      alerts.push({
        id: 'sync-delay',
        title: 'Sincronização atrasada',
        detail: 'Não há novas prescrições registradas há mais de 48 horas.',
        severity: 'critical',
      });
    }

    res.json({ alerts });
  } catch (error) {
    return sendError(res, 500, 'Erro ao buscar alertas', error);
  }
});

export default router;