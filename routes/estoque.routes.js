import express from 'express';
import Medicamento from '../models/Medicamento.js';
import Alimento from '../models/Alimento.js';
import MovimentacaoEstoque from '../models/MovimentacaoEstoque.js';
import { authenticate as authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// --- MEDICAMENTOS ---

// Listar todos os medicamentos (filtrado por empresa)
router.get('/medicamentos', authMiddleware, async (req, res) => {
  try {
    const medicamentos = await Medicamento.find({ empresaId: req.user.empresaId }).sort({ nome: 1 });
    res.json(medicamentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar medicamentos' });
  }
});

// Cadastrar medicamento (com empresaId)
router.post('/medicamentos', authMiddleware, async (req, res) => {
  try {
    const novoMedicamento = new Medicamento({
      ...req.body,
      empresaId: req.user.empresaId
    });
    await novoMedicamento.save();
    res.status(201).json(novoMedicamento);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao cadastrar medicamento', details: error.message });
  }
});

// Movimentação de Medicamento (Entrada/Saída) com controle de empresa
router.post('/medicamentos/movimentacao', authMiddleware, async (req, res) => {
  const { medicamentoId, tipo, quantidade, motivo, observacao } = req.body;

  try {
    const medicamento = await Medicamento.findOne({
      _id: medicamentoId,
      empresaId: req.user.empresaId
    });

    if (!medicamento) {
      return res.status(404).json({ error: 'Medicamento não encontrado ou não pertence à sua empresa' });
    }

    const qtd = Number(quantidade);
    if (isNaN(qtd) || qtd <= 0) {
      return res.status(400).json({ error: 'Quantidade inválida' });
    }

    if (tipo === 'saida' && medicamento.quantidade < qtd) {
      return res.status(400).json({ error: 'Estoque insuficiente' });
    }

    // Atualizar quantidade
    if (tipo === 'entrada') {
      medicamento.quantidade += qtd;
    } else {
      medicamento.quantidade -= qtd;
    }
    await medicamento.save();

    // Registrar movimentação
    const movimentacao = new MovimentacaoEstoque({
      empresaId: req.user.empresaId,
      tipo,
      itemTipo: 'Medicamento',
      itemId: medicamento._id,
      quantidade: qtd,
      usuarioId: req.user.id,
      motivo,
      observacao
    });
    await movimentacao.save();

    res.json({ medicamento, movimentacao });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar movimentação', details: error.message });
  }
});

// --- ALIMENTOS ---

// Listar todos os alimentos (filtrado por empresa)
router.get('/alimentos', authMiddleware, async (req, res) => {
  try {
    const alimentos = await Alimento.find({ empresaId: req.user.empresaId }).sort({ nome: 1 });
    res.json(alimentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar alimentos' });
  }
});

// Cadastrar alimento (com empresaId)
router.post('/alimentos', authMiddleware, async (req, res) => {
  try {
    const novoAlimento = new Alimento({
      ...req.body,
      empresaId: req.user.empresaId
    });
    await novoAlimento.save();
    res.status(201).json(novoAlimento);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao cadastrar alimento', details: error.message });
  }
});

// Movimentação de Alimento (Entrada/Saída) com controle de empresa
router.post('/alimentos/movimentacao', authMiddleware, async (req, res) => {
  const { alimentoId, tipo, quantidade, motivo, observacao } = req.body;

  try {
    const alimento = await Alimento.findOne({
      _id: alimentoId,
      empresaId: req.user.empresaId
    });

    if (!alimento) {
      return res.status(404).json({ error: 'Alimento não encontrado ou não pertence à sua empresa' });
    }

    const qtd = Number(quantidade);
    if (isNaN(qtd) || qtd <= 0) {
      return res.status(400).json({ error: 'Quantidade inválida' });
    }

    if (tipo === 'saida' && alimento.quantidade < qtd) {
      return res.status(400).json({ error: 'Estoque insuficiente' });
    }

    // Atualizar quantidade
    if (tipo === 'entrada') {
      alimento.quantidade += qtd;
    } else {
      alimento.quantidade -= qtd;
    }
    await alimento.save();

    // Registrar movimentação
    const movimentacao = new MovimentacaoEstoque({
      empresaId: req.user.empresaId,
      tipo,
      itemTipo: 'Alimento',
      itemId: alimento._id,
      quantidade: qtd,
      usuarioId: req.user.id,
      motivo,
      observacao
    });
    await movimentacao.save();

    res.json({ alimento, movimentacao });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar movimentação', details: error.message });
  }
});

// --- ESTATÍSTICAS E RELATÓRIOS ---

// Estatísticas do estoque
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [medicamentos, alimentos] = await Promise.all([
      Medicamento.find({ empresaId: req.user.empresaId }).lean(),
      Alimento.find({ empresaId: req.user.empresaId }).lean()
    ]);

    const totalItens = medicamentos.length + alimentos.length;
    
    // Itens com baixo estoque
    const baixoEstoque = [
      ...medicamentos.filter(m => m.quantidade <= (m.quantidadeMinima || 0)),
      ...alimentos.filter(a => a.quantidade <= (a.quantidadeMinima || 0))
    ].length;

    // Itens vencendo em 30 dias
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + 30);
    
    const vencendo = [
      ...medicamentos.filter(m => m.validade && new Date(m.validade) <= dataLimite && new Date(m.validade) > new Date()),
      ...alimentos.filter(a => a.validade && new Date(a.validade) <= dataLimite && new Date(a.validade) > new Date())
    ].length;

    // Movimentações dos últimos 30 dias
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
    
    const movimentacoesRecentes = await MovimentacaoEstoque.countDocuments({
      empresaId: req.user.empresaId,
      data: { $gte: trintaDiasAtras }
    });

    // Categorias
    const categorias = new Set([
      ...medicamentos.map(m => m.categoria || 'Geral'),
      ...alimentos.map(a => a.categoria || 'Geral')
    ]);

    res.json({
      totalItens,
      totalMedicamentos: medicamentos.length,
      totalAlimentos: alimentos.length,
      baixoEstoque,
      vencendo,
      movimentacoesRecentes,
      totalCategorias: categorias.size
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas', details: error.message });
  }
});

// Histórico de movimentações
router.get('/movimentacoes', authMiddleware, async (req, res) => {
  try {
    const { limit = 50, tipo } = req.query;
    
    const query = { empresaId: req.user.empresaId };
    if (tipo) query.tipo = tipo;

    const movimentacoes = await MovimentacaoEstoque.find(query)
      .populate('usuarioId', 'nome')
      .sort({ data: -1 })
      .limit(parseInt(limit))
      .lean();

    // Buscar nomes dos itens
    const movimentacoesComNomes = await Promise.all(
      movimentacoes.map(async (mov) => {
        let itemNome = 'Item não encontrado';
        if (mov.itemTipo === 'Medicamento') {
          const med = await Medicamento.findById(mov.itemId).select('nome').lean();
          itemNome = med?.nome || itemNome;
        } else if (mov.itemTipo === 'Alimento') {
          const alim = await Alimento.findById(mov.itemId).select('nome').lean();
          itemNome = alim?.nome || itemNome;
        }
        return {
          ...mov,
          itemNome,
          usuarioNome: mov.usuarioId?.nome || 'Usuário não encontrado'
        };
      })
    );

    res.json({ movimentacoes: movimentacoesComNomes });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar movimentações', details: error.message });
  }
});

export default router;
