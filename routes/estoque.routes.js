import express from 'express';
import Medicamento from '../models/Medicamento.js';
import Alimento from '../models/Alimento.js';
import MovimentacaoEstoque from '../models/MovimentacaoEstoque.js';
import { authenticate as authMiddleware } from '../middleware/auth.middleware.js';
import { sendError } from '../utils/error.js';

const router = express.Router();

const processarMovimentacao = async ({
  Model,
  itemId,
  itemTipo,
  itemLabel,
  req,
  res,
  tipo,
  quantidade,
  motivo,
  observacao,
}) => {
  const item = await Model.findOne({
    _id: itemId,
    empresaId: req.user.empresaId,
  });

  if (!item) {
    res.status(404).json({ error: `${itemLabel} não encontrado ou não pertence à sua empresa` });
    return null;
  }

  const qtd = Number(quantidade);
  if (isNaN(qtd) || qtd <= 0) {
    res.status(400).json({ error: 'Quantidade inválida' });
    return null;
  }

  if (tipo === 'saida' && item.quantidade < qtd) {
    res.status(400).json({ error: 'Estoque insuficiente' });
    return null;
  }

  if (tipo === 'entrada') {
    item.quantidade += qtd;
  } else {
    item.quantidade -= qtd;
  }
  await item.save();

  const movimentacao = new MovimentacaoEstoque({
    empresaId: req.user.empresaId,
    tipo,
    itemTipo,
    itemId: item._id,
    quantidade: qtd,
    usuarioId: req.user.id,
    motivo,
    observacao,
  });
  await movimentacao.save();

  return { item, movimentacao };
};

const listarItensPorEmpresa = async (Model, req, res, errorMessage) => {
  try {
    const itens = await Model.find({ empresaId: req.user.empresaId }).sort({ nome: 1 });
    res.json(itens);
  } catch (error) {
    return sendError(res, 500, errorMessage, error, { log: false });
  }
};

const cadastrarItemPorEmpresa = async (Model, req, res, errorMessage) => {
  try {
    const novoItem = new Model({
      ...req.body,
      empresaId: req.user.empresaId,
    });
    await novoItem.save();
    res.status(201).json(novoItem);
  } catch (error) {
    return sendError(res, 400, errorMessage, error, {
      includeDetails: true,
      log: false,
    });
  }
};

// --- MEDICAMENTOS ---

// Listar todos os medicamentos (filtrado por empresa)
router.get('/medicamentos', authMiddleware, async (req, res) => {
  return listarItensPorEmpresa(Medicamento, req, res, 'Erro ao buscar medicamentos');
});

// Cadastrar medicamento (com empresaId)
router.post('/medicamentos', authMiddleware, async (req, res) => {
  return cadastrarItemPorEmpresa(Medicamento, req, res, 'Erro ao cadastrar medicamento');
});

// Movimentação de Medicamento (Entrada/Saída) com controle de empresa
router.post('/medicamentos/movimentacao', authMiddleware, async (req, res) => {
  const { medicamentoId, tipo, quantidade, motivo, observacao } = req.body;

  try {
    const resultado = await processarMovimentacao({
      Model: Medicamento,
      itemId: medicamentoId,
      itemTipo: 'Medicamento',
      itemLabel: 'Medicamento',
      req,
      res,
      tipo,
      quantidade,
      motivo,
      observacao,
    });

    if (!resultado) return;

    res.json({ medicamento: resultado.item, movimentacao: resultado.movimentacao });
  } catch (error) {
    return sendError(res, 500, 'Erro ao registrar movimentação', error, {
      includeDetails: true,
      log: false,
    });
  }
});

// --- ALIMENTOS ---

// Listar todos os alimentos (filtrado por empresa)
router.get('/alimentos', authMiddleware, async (req, res) => {
  return listarItensPorEmpresa(Alimento, req, res, 'Erro ao buscar alimentos');
});

// Cadastrar alimento (com empresaId)
router.post('/alimentos', authMiddleware, async (req, res) => {
  return cadastrarItemPorEmpresa(Alimento, req, res, 'Erro ao cadastrar alimento');
});

// Movimentação de Alimento (Entrada/Saída) com controle de empresa
router.post('/alimentos/movimentacao', authMiddleware, async (req, res) => {
  const { alimentoId, tipo, quantidade, motivo, observacao } = req.body;

  try {
    const resultado = await processarMovimentacao({
      Model: Alimento,
      itemId: alimentoId,
      itemTipo: 'Alimento',
      itemLabel: 'Alimento',
      req,
      res,
      tipo,
      quantidade,
      motivo,
      observacao,
    });

    if (!resultado) return;

    res.json({ alimento: resultado.item, movimentacao: resultado.movimentacao });
  } catch (error) {
    return sendError(res, 500, 'Erro ao registrar movimentação', error, {
      includeDetails: true,
      log: false,
    });
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
    return sendError(res, 500, 'Erro ao buscar estatísticas', error, {
      includeDetails: true,
      log: false,
    });
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
    return sendError(res, 500, 'Erro ao buscar movimentações', error, {
      includeDetails: true,
      log: false,
    });
  }
});

export default router;
