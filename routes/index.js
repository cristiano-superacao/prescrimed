import express from 'express';
import authRoutes from './auth.routes.js';
import empresaRoutes from './empresa.routes.js';
import usuarioRoutes from './usuario.routes.js';
import pacienteRoutes from './paciente.routes.js';
import prescricaoRoutes from './prescricao.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import diagnosticRoutes from './diagnostic.routes.js';

// Router índice para consolidar endpoints da API
const router = express.Router();

// Rota de teste
router.get('/test', (req, res) => {
  res.json({ 
    message: 'API Prescrimed com PostgreSQL',
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL + Sequelize'
  });
});

// Rotas principais
router.use('/auth', authRoutes);
router.use('/empresas', empresaRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/pacientes', pacienteRoutes);
router.use('/prescricoes', prescricaoRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/diagnostic', diagnosticRoutes);

export default router;
