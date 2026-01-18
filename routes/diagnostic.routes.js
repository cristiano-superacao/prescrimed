import express from 'express';
import { sequelize } from '../models/index.js';

const router = express.Router();

// Verificação de tabelas e colunas no PostgreSQL
router.get('/db-check', async (req, res) => {
  try {
    const dialect = typeof sequelize.getDialect === 'function' ? sequelize.getDialect() : undefined;
    if (dialect && dialect !== 'postgres') {
      return res.status(400).json({
        ok: false,
        dialect,
        hint: 'Este diagnóstico espera PostgreSQL. No Railway, configure DATABASE_URL (Postgres) no serviço do backend.'
      });
    }

    const [tables] = await sequelize.query(
      "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
    );
    const tableNames = tables.map(t => t.tablename);
    const expected = ['empresas', 'usuarios', 'pacientes', 'prescricoes'];

    const colChecks = [
      { table: 'empresas', columns: ['id', 'nome', 'tipoSistema', 'cnpj', 'ativo'] },
      { table: 'usuarios', columns: ['id', 'nome', 'email', 'role', 'empresaId', 'cpf', 'contato'] },
      { table: 'pacientes', columns: ['id', 'nome', 'empresaId'] },
      { table: 'prescricoes', columns: ['id', 'tipo', 'status', 'empresaId', 'pacienteId'] },
    ];

    const results = [];
    for (const check of colChecks) {
      const [colsRows] = await sequelize.query(
        `SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name=$1`,
        { bind: [check.table] }
      );
      const cols = colsRows.map(r => r.column_name);
      const missing = check.columns.filter(c => !cols.includes(c));
      results.push({ table: check.table, ok: missing.length === 0, missing, columns: cols });
    }

    res.json({
      tables: tableNames,
      expected,
      results,
      ok: results.every(r => r.ok)
    });
  } catch (err) {
    console.error('Erro diagnóstico DB:', err);
    res.status(500).json({ error: err.message });
  }
});

// Verificação de ambiente e configuração
router.get('/env-check', async (req, res) => {
  try {
    const dialect = typeof sequelize.getDialect === 'function' ? sequelize.getDialect() : 'unknown';
    
    res.json({
      ok: true,
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        TZ: process.env.TZ || 'not set',
        PORT: process.env.PORT || 'not set',
      },
      database: {
        dialect: dialect,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        isConnected: false, // Will be updated below
      },
      jwt: {
        hasJwtSecret: !!process.env.JWT_SECRET,
        sessionTimeout: process.env.SESSION_TIMEOUT || '8h',
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Erro verificação ambiente:', err);
    res.status(500).json({ error: err.message });
  }
});

// Verificação rápida de conexão com banco
router.get('/db-ping', async (req, res) => {
  try {
    await sequelize.authenticate();
    const dialect = typeof sequelize.getDialect === 'function' ? sequelize.getDialect() : 'unknown';
    
    res.json({
      ok: true,
      dialect: dialect,
      message: 'Banco de dados conectado com sucesso',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Erro ping DB:', err);
    res.status(503).json({ 
      ok: false,
      error: 'Falha ao conectar com o banco de dados',
      details: err.message,
      hint: 'Verifique se DATABASE_URL está configurado corretamente no Railway'
    });
  }
});

export default router;
