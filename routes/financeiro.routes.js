import express from 'express';
import mongoose from 'mongoose';
import Transacao from '../models/Transacao.js';
import { authenticate as auth } from '../middleware/auth.middleware.js';
import { sendError } from '../utils/error.js';

const router = express.Router();

const getTransacaoFilter = (req) => ({
  _id: req.params.id,
  empresaId: req.user.empresaId,
});

const handleTransacaoNotFound = (res) => {
  res.status(404).json({ message: 'Transação não encontrada' });
};

// Middleware de autenticação para todas as rotas
router.use(auth);

// Listar transações
router.get('/', async (req, res) => {
  try {
    const { tipo, status, dataInicio, dataFim } = req.query;
    const query = { empresaId: req.user.empresaId };

    if (tipo) query.tipo = tipo;
    if (status) query.status = status;
    
    if (dataInicio || dataFim) {
      query.data = {};
      if (dataInicio) query.data.$gte = new Date(dataInicio);
      if (dataFim) query.data.$lte = new Date(dataFim);
    }

    const transacoes = await Transacao.find(query)
      .sort({ data: -1 })
      .populate('pacienteId', 'nome')
      .populate('criadoPor', 'nome');

    res.json(transacoes);
  } catch (error) {
    return sendError(res, 500, 'Erro ao buscar transações', error, {
      messageKey: 'message',
      errorKey: 'error',
      log: false,
    });
  }
});

// Obter estatísticas
router.get('/stats', async (req, res) => {
  try {
    const empresaId = new mongoose.Types.ObjectId(req.user.empresaId);
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    // Agregação para totais do mês
    const stats = await Transacao.aggregate([
      {
        $match: {
          empresaId: empresaId,
          data: { $gte: inicioMes, $lte: fimMes }
        }
      },
      {
        $group: {
          _id: '$tipo',
          total: { $sum: '$valor' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Pendentes
    const pendentes = await Transacao.aggregate([
      {
        $match: {
          empresaId: empresaId,
          status: 'pendente'
        }
      },
      {
        $group: {
          _id: '$tipo',
          total: { $sum: '$valor' }
        }
      }
    ]);

    const receitas = stats.find(s => s._id === 'receita')?.total || 0;
    const despesas = stats.find(s => s._id === 'despesa')?.total || 0;
    const saldo = receitas - despesas;

    const receitasPendentes = pendentes.find(s => s._id === 'receita')?.total || 0;
    const despesasPendentes = pendentes.find(s => s._id === 'despesa')?.total || 0;

    res.json({
      receitas,
      despesas,
      saldo,
      receitasPendentes,
      despesasPendentes
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Erro ao buscar estatísticas', error, {
      messageKey: 'message',
      errorKey: 'error',
      log: false,
    });
  }
});

// Criar transação
router.post('/', async (req, res) => {
  try {
    const transacao = new Transacao({
      ...req.body,
      empresaId: req.user.empresaId,
      criadoPor: req.user.id
    });

    await transacao.save();
    res.status(201).json(transacao);
  } catch (error) {
    return sendError(res, 400, 'Erro ao criar transação', error, {
      messageKey: 'message',
      errorKey: 'error',
      log: false,
    });
  }
});

// Atualizar transação
router.put('/:id', async (req, res) => {
  try {
    const transacao = await Transacao.findOneAndUpdate(
      getTransacaoFilter(req),
      req.body,
      { new: true }
    );

    if (!transacao) {
      handleTransacaoNotFound(res);
      return;
    }

    res.json(transacao);
  } catch (error) {
    return sendError(res, 400, 'Erro ao atualizar transação', error, {
      messageKey: 'message',
      errorKey: 'error',
      log: false,
    });
  }
});

// Excluir transação
router.delete('/:id', async (req, res) => {
  try {
    const transacao = await Transacao.findOneAndDelete(getTransacaoFilter(req));

    if (!transacao) {
      handleTransacaoNotFound(res);
      return;
    }

    res.json({ message: 'Transação excluída com sucesso' });
  } catch (error) {
    return sendError(res, 500, 'Erro ao excluir transação', error, {
      messageKey: 'message',
      errorKey: 'error',
      log: false,
    });
  }
});

export default router;
