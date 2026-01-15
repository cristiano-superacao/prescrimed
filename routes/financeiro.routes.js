import express from 'express';
import mongoose from 'mongoose';
import Transacao from '../models/Transacao.js';
import { authenticate as auth } from '../middleware/auth.middleware.js';

const router = express.Router();

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
    res.status(500).json({ message: 'Erro ao buscar transações', error: error.message });
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
    res.status(500).json({ message: 'Erro ao buscar estatísticas', error: error.message });
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
    res.status(400).json({ message: 'Erro ao criar transação', error: error.message });
  }
});

// Atualizar transação
router.put('/:id', async (req, res) => {
  try {
    const transacao = await Transacao.findOneAndUpdate(
      { _id: req.params.id, empresaId: req.user.empresaId },
      req.body,
      { new: true }
    );

    if (!transacao) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }

    res.json(transacao);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar transação', error: error.message });
  }
});

// Excluir transação
router.delete('/:id', async (req, res) => {
  try {
    const transacao = await Transacao.findOneAndDelete({
      _id: req.params.id,
      empresaId: req.user.empresaId
    });

    if (!transacao) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }

    res.json({ message: 'Transação excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir transação', error: error.message });
  }
});

export default router;
