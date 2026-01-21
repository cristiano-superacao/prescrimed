import express from 'express';
import { Op } from 'sequelize';
import { FinanceiroTransacao, Paciente } from '../models/index.js';

const router = express.Router();

function getEmpresaId(req) {
  return req.query?.empresaId || req.body?.empresaId || req.tenantEmpresaId || req.user?.empresaId || null;
}

function transacaoToClient(instance) {
  const json = instance?.toJSON ? instance.toJSON() : instance;
  if (!json) return json;
  const paciente = json.paciente || null;
  return {
    ...json,
    _id: json.id,
    paciente: paciente ? { id: paciente.id, nome: paciente.nome } : null
  };
}

// GET /api/financeiro - Listar movimentações financeiras
router.get('/', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    const where = {};
    if (empresaId) where.empresaId = empresaId;

    if (req.query?.tipo) where.tipo = req.query.tipo;
    if (req.query?.status) where.status = req.query.status;

    if (req.query?.dataInicio || req.query?.dataFim) {
      where.data = {};
      if (req.query.dataInicio) where.data[Op.gte] = req.query.dataInicio;
      if (req.query.dataFim) where.data[Op.lte] = req.query.dataFim;
    }

    const transacoes = await FinanceiroTransacao.findAll({
      where,
      order: [['data', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json(transacoes.map(transacaoToClient));
  } catch (error) {
    console.error('❌ Erro ao buscar movimentações financeiras:', error);
    
    // Erro de tabela não existe
    if (error.name === 'SequelizeDatabaseError' && error.message.includes('does not exist')) {
      return res.status(503).json({ 
        error: 'Tabela financeira não encontrada. Sistema em configuração.',
        details: 'Database table missing'
      });
    }
    
    res.status(500).json({ 
      error: 'Erro ao buscar movimentações financeiras',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/financeiro/stats - Estatísticas financeiras
router.get('/stats', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    const where = {};
    if (empresaId) where.empresaId = empresaId;

    const transacoes = await FinanceiroTransacao.findAll({ where, attributes: ['tipo', 'status', 'valor'] });

    const sum = (arr) => arr.reduce((acc, v) => acc + (Number(v) || 0), 0);

    const receitas = sum(transacoes.filter((t) => t.tipo === 'receita' && t.status === 'pago').map((t) => t.valor));
    const despesas = sum(transacoes.filter((t) => t.tipo === 'despesa' && t.status === 'pago').map((t) => t.valor));
    const receitasPendentes = sum(transacoes.filter((t) => t.tipo === 'receita' && t.status === 'pendente').map((t) => t.valor));
    const despesasPendentes = sum(transacoes.filter((t) => t.tipo === 'despesa' && t.status === 'pendente').map((t) => t.valor));

    const stats = {
      receitas,
      despesas,
      saldo: receitas - despesas,
      receitasPendentes,
      despesasPendentes
    };

    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas financeiras:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas financeiras' });
  }
});

// POST /api/financeiro - Adicionar movimentação
router.post('/', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    if (!empresaId) return res.status(400).json({ error: 'empresaId é obrigatório' });

    const payload = {
      empresaId,
      pacienteId: req.body.pacienteId || null,
      tipo: req.body.tipo,
      descricao: req.body.descricao,
      valor: req.body.valor,
      categoria: req.body.categoria,
      dataVencimento: req.body.dataVencimento || req.body.data,
      dataPagamento: req.body.dataPagamento || null,
      status: req.body.status || 'pendente',
      formaPagamento: req.body.formaPagamento,
      observacoes: req.body.observacoes
    };

    const created = await FinanceiroTransacao.create(payload);
    const full = await FinanceiroTransacao.findByPk(created.id, {
      include: [{ model: Paciente, as: 'paciente', attributes: ['id', 'nome'] }]
    });

    res.status(201).json(transacaoToClient(full));
  } catch (error) {
    console.error('Erro ao adicionar movimentação:', error);
    
    // Erros de validação Sequelize
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({ 
        error: 'Dados inválidos para movimentação',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        fields: error.errors?.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    res.status(500).json({ 
      error: 'Erro ao adicionar movimentação',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/financeiro/:id - Atualizar movimentação
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = getEmpresaId(req);
    const where = { id };
    if (empresaId) where.empresaId = empresaId;

    const transacao = await FinanceiroTransacao.findOne({ where });
    if (!transacao) return res.status(404).json({ error: 'Movimentação não encontrada' });

    // Evitar sobrescrever empresaId via update
    const { empresaId: _ignored, id: _ignored2, _id: _ignored3, ...safeUpdates } = req.body || {};

    await transacao.update(safeUpdates);
    const full = await FinanceiroTransacao.findByPk(transacao.id, {
      include: [{ model: Paciente, as: 'paciente', attributes: ['id', 'nome'] }]
    });

    res.json(transacaoToClient(full));
  } catch (error) {
    console.error('Erro ao atualizar movimentação:', error);
    res.status(500).json({ error: 'Erro ao atualizar movimentação' });
  }
});

// DELETE /api/financeiro/:id - Remover movimentação
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const empresaId = getEmpresaId(req);
    const where = { id };
    if (empresaId) where.empresaId = empresaId;

    const deleted = await FinanceiroTransacao.destroy({ where });
    if (!deleted) return res.status(404).json({ error: 'Movimentação não encontrada' });

    res.json({ ok: true });
  } catch (error) {
    console.error('Erro ao remover movimentação:', error);
    res.status(500).json({ error: 'Erro ao remover movimentação' });
  }
});

export default router;
