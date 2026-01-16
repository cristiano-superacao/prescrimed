import express from 'express';
import Empresa from '../models/Empresa.js';
import Usuario from '../models/Usuario.js';
import Paciente from '../models/Paciente.js';
import { sendError } from '../utils/error.js';

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
    return sendError(res, 500, error?.message, error, {
      messageKey: 'message',
      extraPayload: { status: 'error' },
      log: false,
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
    return sendError(res, 500, error?.message, error, {
      messageKey: 'message',
      extraPayload: {
        status: 'error',
        ...(error.stdout || error.stderr ? { output: error.stdout || error.stderr } : {}),
      },
      log: false,
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
    return sendError(res, 500, error?.message, error, {
      messageKey: 'message',
      extraPayload: {
        status: 'error',
        ...(error.stdout || error.stderr ? { output: error.stdout || error.stderr } : {}),
      },
      log: false,
    });
  }
});

export default router;
