import express from 'express';

const router = express.Router();

// GET /api/financeiro - Listar movimentações financeiras
router.get('/', async (req, res) => {
  try {
    const movimentacoes = [
      {
        id: 1,
        tipo: 'receita',
        descricao: 'Consulta - João Silva',
        valor: 150.00,
        categoria: 'Consultas',
        data: '2026-01-15',
        status: 'pago',
        formaPagamento: 'Cartão'
      },
      {
        id: 2,
        tipo: 'despesa',
        descricao: 'Compra de medicamentos',
        valor: 320.50,
        categoria: 'Estoque',
        data: '2026-01-14',
        status: 'pago',
        formaPagamento: 'Boleto'
      },
      {
        id: 3,
        tipo: 'receita',
        descricao: 'Fisioterapia - Maria Santos',
        valor: 200.00,
        categoria: 'Fisioterapia',
        data: '2026-01-13',
        status: 'pendente',
        formaPagamento: 'Dinheiro'
      }
    ];

    res.json({
      success: true,
      data: movimentacoes,
      total: movimentacoes.length
    });
  } catch (error) {
    console.error('Erro ao buscar movimentações financeiras:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar movimentações financeiras'
    });
  }
});

// GET /api/financeiro/stats - Estatísticas financeiras
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      receitasMes: 2350.00,
      despesasMes: 1420.50,
      saldoMes: 929.50,
      receitasPendentes: 450.00,
      despesasPendentes: 120.00,
      fluxoCaixa: {
        receitas: [
          { mes: 'Jan', valor: 2350 },
          { mes: 'Dez', valor: 2100 },
          { mes: 'Nov', valor: 1950 }
        ],
        despesas: [
          { mes: 'Jan', valor: 1420 },
          { mes: 'Dez', valor: 1300 },
          { mes: 'Nov', valor: 1150 }
        ]
      },
      categorias: [
        { nome: 'Consultas', valor: 1200, percentual: 51 },
        { nome: 'Fisioterapia', valor: 800, percentual: 34 },
        { nome: 'Outros', valor: 350, percentual: 15 }
      ]
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas financeiras:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas financeiras'
    });
  }
});

// POST /api/financeiro - Adicionar movimentação
router.post('/', async (req, res) => {
  try {
    const { tipo, descricao, valor, categoria, data, formaPagamento } = req.body;

    const novaMovimentacao = {
      id: Date.now(),
      tipo,
      descricao,
      valor,
      categoria,
      data,
      status: 'pago',
      formaPagamento,
      criadoEm: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: novaMovimentacao,
      message: 'Movimentação registrada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao adicionar movimentação:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar movimentação'
    });
  }
});

// PUT /api/financeiro/:id - Atualizar movimentação
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    res.json({
      success: true,
      data: { id, ...updates },
      message: 'Movimentação atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar movimentação:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar movimentação'
    });
  }
});

// DELETE /api/financeiro/:id - Remover movimentação
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      success: true,
      message: 'Movimentação removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover movimentação:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover movimentação'
    });
  }
});

export default router;
