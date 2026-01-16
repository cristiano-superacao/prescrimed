import express from 'express';

// Router índice para consolidar endpoints da API
const router = express.Router();

// Rota temporária de teste
router.get('/test', (req, res) => {
  res.json({ 
    message: 'API funcionando sem banco de dados',
    timestamp: new Date().toISOString()
  });
});

// Rota de informações da API
router.get('/info', (req, res) => {
  res.json({
    name: 'Prescrimed API',
    version: '1.0.0',
    status: 'active',
    message: 'Sistema operando sem banco de dados (modo standalone)',
    endpoints: {
      health: '/health',
      test: '/api/test',
      info: '/api/info'
    }
  });
});

export default router;
