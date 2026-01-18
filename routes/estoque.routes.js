import express from 'express';
import { EstoqueItem, EstoqueMovimentacao, sequelize } from '../models/index.js';

const router = express.Router();

function itemToClient(itemInstance) {
  const json = itemInstance?.toJSON ? itemInstance.toJSON() : itemInstance;
  if (!json) return json;
  return { ...json, _id: json.id };
}

function movimentacaoToClient(movInstance) {
  const json = movInstance?.toJSON ? movInstance.toJSON() : movInstance;
  if (!json) return json;

  const item = json.item || null;
  return {
    _id: json.id,
    tipo: json.tipo,
    quantidade: json.quantidade,
    motivo: json.motivo,
    observacao: json.observacao,
    data: json.data || json.createdAt,
    usuarioNome: json.usuarioNome,
    itemNome: item?.nome,
    itemTipo: item?.tipo === 'medicamento' ? 'Medicamento' : (item?.tipo === 'alimento' ? 'Alimento' : item?.tipo)
  };
}

function getEmpresaId(req) {
  return req.query?.empresaId || req.body?.empresaId || req.tenantEmpresaId || req.user?.empresaId || null;
}

// GET /api/estoque/medicamentos - Listar medicamentos do estoque
router.get('/medicamentos', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    const where = { tipo: 'medicamento' };
    if (empresaId) where.empresaId = empresaId;

    const itens = await EstoqueItem.findAll({
      where,
      order: [['nome', 'ASC']]
    });

    res.json(itens.map(itemToClient));
  } catch (error) {
    console.error('❌ Erro ao buscar medicamentos:', error);
    
    // Erro de tabela não existe
    if (error.name === 'SequelizeDatabaseError' && error.message.includes('does not exist')) {
      return res.status(503).json({ 
        error: 'Tabela de estoque não encontrada. Sistema em configuração.',
        details: 'Database table missing'
      });
    }
    
    res.status(500).json({ 
      error: 'Erro ao buscar medicamentos do estoque',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/estoque/medicamentos - Adicionar medicamento
router.post('/medicamentos', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    if (!empresaId) return res.status(400).json({ error: 'empresaId é obrigatório' });

    const payload = {
      empresaId,
      tipo: 'medicamento',
      nome: req.body.nome,
      quantidade: Number(req.body.quantidade) || 0,
      unidade: req.body.unidade,
      lote: req.body.lote,
      validade: req.body.validade,
      precoUnitario: req.body.precoUnitario,
      fornecedor: req.body.fornecedor,
      categoria: req.body.categoria,
      quantidadeMinima: Number(req.body.quantidadeMinima) || 0
    };

    const created = await EstoqueItem.create(payload);
    res.status(201).json(itemToClient(created));
  } catch (error) {
    console.error('Erro ao adicionar medicamento:', error);
    res.status(500).json({ error: 'Erro ao adicionar medicamento' });
  }
});

// GET /api/estoque/alimentos - Listar alimentos do estoque
router.get('/alimentos', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    const where = { tipo: 'alimento' };
    if (empresaId) where.empresaId = empresaId;

    const itens = await EstoqueItem.findAll({
      where,
      order: [['nome', 'ASC']]
    });

    res.json(itens.map(itemToClient));
  } catch (error) {
    console.error('Erro ao buscar alimentos:', error);
    res.status(500).json({ error: 'Erro ao buscar alimentos do estoque' });
  }
});

// POST /api/estoque/alimentos - Adicionar alimento
router.post('/alimentos', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    if (!empresaId) return res.status(400).json({ error: 'empresaId é obrigatório' });

    const payload = {
      empresaId,
      tipo: 'alimento',
      nome: req.body.nome,
      quantidade: Number(req.body.quantidade) || 0,
      unidade: req.body.unidade,
      lote: req.body.lote,
      validade: req.body.validade,
      precoUnitario: req.body.precoUnitario,
      fornecedor: req.body.fornecedor,
      categoria: req.body.categoria,
      quantidadeMinima: Number(req.body.quantidadeMinima) || 0
    };

    const created = await EstoqueItem.create(payload);
    res.status(201).json(itemToClient(created));
  } catch (error) {
    console.error('Erro ao adicionar alimento:', error);
    res.status(500).json({ error: 'Erro ao adicionar alimento' });
  }
});

async function registrarMovimentacao({
  req,
  res,
  itemId,
  tipoMov,
  quantidade,
  motivo,
  observacao
}) {
  const empresaId = getEmpresaId(req);
  if (!empresaId) return res.status(400).json({ error: 'empresaId é obrigatório' });
  if (!itemId) return res.status(400).json({ error: 'itemId é obrigatório' });
  if (!['entrada', 'saida'].includes(tipoMov)) return res.status(400).json({ error: 'tipo deve ser entrada ou saida' });
  const qtd = Number(quantidade);
  if (!Number.isFinite(qtd) || qtd <= 0) return res.status(400).json({ error: 'quantidade inválida' });

  return sequelize.transaction(async (t) => {
    const item = await EstoqueItem.findOne({
      where: { id: itemId, empresaId },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    if (tipoMov === 'saida' && item.quantidade < qtd) {
      return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
    }

    const novaQuantidade = tipoMov === 'entrada' ? (item.quantidade + qtd) : (item.quantidade - qtd);
    await item.update({ quantidade: novaQuantidade }, { transaction: t });

    const mov = await EstoqueMovimentacao.create({
      empresaId,
      estoqueItemId: item.id,
      usuarioId: req.user?.id || null,
      usuarioNome: req.user?.nome || null,
      tipo: tipoMov,
      quantidade: qtd,
      motivo,
      observacao,
      data: new Date()
    }, { transaction: t });

    const movFull = await EstoqueMovimentacao.findByPk(mov.id, {
      include: [{ model: EstoqueItem, as: 'item', attributes: ['id', 'nome', 'tipo'] }],
      transaction: t
    });

    return res.status(201).json(movimentacaoToClient(movFull));
  });
}

// POST /api/estoque/medicamentos/movimentacao
router.post('/medicamentos/movimentacao', async (req, res) => {
  try {
    return await registrarMovimentacao({
      req,
      res,
      itemId: req.body.medicamentoId,
      tipoMov: req.body.tipo,
      quantidade: req.body.quantidade,
      motivo: req.body.motivo,
      observacao: req.body.observacao
    });
  } catch (error) {
    console.error('Erro ao registrar movimentação de medicamento:', error);
    return res.status(500).json({ error: 'Erro ao registrar movimentação' });
  }
});

// POST /api/estoque/alimentos/movimentacao
router.post('/alimentos/movimentacao', async (req, res) => {
  try {
    return await registrarMovimentacao({
      req,
      res,
      itemId: req.body.alimentoId,
      tipoMov: req.body.tipo,
      quantidade: req.body.quantidade,
      motivo: req.body.motivo,
      observacao: req.body.observacao
    });
  } catch (error) {
    console.error('Erro ao registrar movimentação de alimento:', error);
    return res.status(500).json({ error: 'Erro ao registrar movimentação' });
  }
});

// GET /api/estoque/movimentacoes?tipo=medicamento|alimento
router.get('/movimentacoes', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    const where = {};
    if (empresaId) where.empresaId = empresaId;

    const include = [{ model: EstoqueItem, as: 'item', attributes: ['id', 'nome', 'tipo'] }];

    // Filtrar por tipo do item se vier query tipo
    const tipoItem = req.query?.tipo;
    if (tipoItem) {
      include[0].where = { tipo: tipoItem };
      include[0].required = true;
    }

    const movimentacoes = await EstoqueMovimentacao.findAll({
      where,
      include,
      order: [['data', 'DESC']],
      limit: 50
    });

    res.json({ movimentacoes: movimentacoes.map(movimentacaoToClient) });
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    res.status(500).json({ error: 'Erro ao buscar movimentações' });
  }
});

// GET /api/estoque/stats - Estatísticas do estoque
router.get('/stats', async (req, res) => {
  try {
    const empresaId = getEmpresaId(req);
    const where = {};
    if (empresaId) where.empresaId = empresaId;

    const itens = await EstoqueItem.findAll({ where });

    const totalMedicamentos = itens.filter((i) => i.tipo === 'medicamento').length;
    const totalItens = itens.reduce((acc, i) => acc + (Number(i.quantidade) || 0), 0);
    const valorTotal = itens.reduce((acc, i) => {
      const qtd = Number(i.quantidade) || 0;
      const pu = Number(i.precoUnitario) || 0;
      return acc + (qtd * pu);
    }, 0);

    const now = new Date();
    const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const proximosVencer = itens.filter((i) => {
      if (!i.validade) return false;
      const v = new Date(i.validade);
      return v >= now && v <= in30;
    }).length;

    const emFalta = itens.filter((i) => (Number(i.quantidade) || 0) <= (Number(i.quantidadeMinima) || 0)).length;

    const alertas = [];
    itens.forEach((i) => {
      const qtd = Number(i.quantidade) || 0;
      const min = Number(i.quantidadeMinima) || 0;
      if (qtd <= min && i.nome) {
        alertas.push({ tipo: 'estoque', mensagem: `${i.nome} está abaixo do mínimo`, severidade: 'warning' });
      }
      if (i.validade) {
        const v = new Date(i.validade);
        if (v >= now && v <= in30) {
          alertas.push({ tipo: 'validade', mensagem: `${i.nome} vence em breve`, severidade: 'warning' });
        }
      }
    });

    res.json({
      totalMedicamentos,
      totalItens,
      valorTotal,
      proximosVencer,
      emFalta,
      alertas: alertas.slice(0, 10)
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do estoque:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

export default router;
