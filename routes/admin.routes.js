import express from 'express';
import Empresa from '../models/Empresa.js';
import Usuario from '../models/Usuario.js';
import Paciente from '../models/Paciente.js';

const router = express.Router();

// Rota temporária de diagnóstico - REMOVER EM PRODUÇÃO
router.get('/diagnostico', async (req, res) => {
  try {
    const empresas = await Empresa.countDocuments();
    const usuarios = await Usuario.countDocuments();
    const pacientes = await Paciente.countDocuments();
    
    const empresasList = await Empresa.find().select('nome tipoSistema email');
    
    res.json({
      status: 'ok',
      database: 'connected',
      counts: {
        empresas,
        usuarios,
        pacientes
      },
      empresas: empresasList
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Rota para executar seed manual - REMOVER EM PRODUÇÃO
router.post('/seed', async (req, res) => {
  try {
    const { execSync } = await import('child_process');
    
    const output = execSync('node scripts/seed-cloud.js', {
      cwd: process.cwd(),
      encoding: 'utf-8'
    });
    
    res.json({
      status: 'success',
      output
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      output: error.stdout || error.stderr
    });
  }
});

// Rota para executar init-db manual - REMOVER EM PRODUÇÃO
router.post('/init-db', async (req, res) => {
  try {
    const { execSync } = await import('child_process');
    
    const output = execSync('node scripts/init-db.js', {
      cwd: process.cwd(),
      encoding: 'utf-8'
    });
    
    res.json({
      status: 'success',
      output
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      output: error.stdout || error.stderr
    });
  }
});

export default router;
