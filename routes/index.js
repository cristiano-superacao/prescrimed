import express from 'express';
import authRoutes from './auth.routes.js';
import empresaRoutes from './empresa.routes.js';
import usuarioRoutes from './usuario.routes.js';
import pacienteRoutes from './paciente.routes.js';
import prescricaoRoutes from './prescricao.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import diagnosticRoutes from './diagnostic.routes.js';
import agendamentoRoutes from './agendamento.routes.js';
import casaRepousoRoutes from './casa-repouso.routes.js';
import petshopRoutes from './petshop.routes.js';
import fisioterapiaRoutes from './fisioterapia.routes.js';
import estoqueRoutes from './estoque.routes.js';
import financeiroRoutes from './financeiro.routes.js';
import enfermagemRoutes from './enfermagem.routes.js';
import { authenticate, tenantIsolation } from '../middleware/auth.middleware.js';
import { sequelize } from '../models/index.js';

// Router índice para consolidar endpoints da API
const router = express.Router();

// Rota de teste
router.get('/test', (req, res) => {
  const dialect = typeof sequelize.getDialect === 'function' ? sequelize.getDialect() : 'unknown';
  res.json({ 
    message: 'API Prescrimed com PostgreSQL',
    timestamp: new Date().toISOString(),
    database: `${dialect} + Sequelize`
  });
});

// Rotas públicas (sem autenticação)
router.use('/auth', authRoutes);
router.use('/diagnostic', diagnosticRoutes);

// Rotas protegidas com autenticação e isolamento multi-tenant
router.use('/empresas', authenticate, empresaRoutes);
router.use('/usuarios', authenticate, tenantIsolation, usuarioRoutes);
router.use('/pacientes', authenticate, tenantIsolation, pacienteRoutes);
router.use('/prescricoes', authenticate, tenantIsolation, prescricaoRoutes);
router.use('/dashboard', authenticate, tenantIsolation, dashboardRoutes);
router.use('/agendamentos', authenticate, tenantIsolation, agendamentoRoutes);

// Rotas específicas por tipo de sistema
router.use('/casa-repouso', authenticate, tenantIsolation, casaRepousoRoutes);
router.use('/petshop', authenticate, tenantIsolation, petshopRoutes);
router.use('/fisioterapia', authenticate, tenantIsolation, fisioterapiaRoutes);

// Rotas de estoque e financeiro
router.use('/estoque', authenticate, tenantIsolation, estoqueRoutes);
router.use('/financeiro', authenticate, tenantIsolation, financeiroRoutes);

// Rotas de enfermagem
router.use('/enfermagem', authenticate, tenantIsolation, enfermagemRoutes);

export default router;
