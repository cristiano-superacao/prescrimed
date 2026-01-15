import express from 'express';

import authRoutes from './auth.routes.js';
import empresaRoutes from './empresa.routes.js';
import usuarioRoutes from './usuario.routes.js';
import prescricaoRoutes from './prescricao.routes.js';
import pacienteRoutes from './paciente.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import agendamentoRoutes from './agendamento.routes.js';
import estoqueRoutes from './estoque.routes.js';
import financeiroRoutes from './financeiro.routes.js';
import adminRoutes from './admin.routes.js';

// Router índice para consolidar endpoints da API
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/empresas', empresaRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/prescricoes', prescricaoRoutes);
router.use('/pacientes', pacienteRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/agendamentos', agendamentoRoutes);
router.use('/estoque', estoqueRoutes);
router.use('/financeiro', financeiroRoutes);
router.use('/admin', adminRoutes);

export default router;
