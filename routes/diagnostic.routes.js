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

export default router;
