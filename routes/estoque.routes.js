import express from 'express';

const router = express.Router();

// GET /api/estoque/medicamentos - Listar medicamentos do estoque
router.get('/medicamentos', async (req, res) => {
  try {
    // Mock data - em produção, buscar do banco de dados
    const medicamentos = [
      {
        id: 1,
        nome: 'Paracetamol 500mg',
        quantidade: 150,
        unidade: 'comprimidos',
        lote: 'LOT2024001',
        validade: '2025-12-31',
        precoUnitario: 0.50,
        fornecedor: 'FarmaDistribuidora',
        categoria: 'Analgésico'
      },
      {
        id: 2,
        nome: 'Dipirona 500mg',
        quantidade: 200,
        unidade: 'comprimidos',
        lote: 'LOT2024002',
        validade: '2025-11-30',
        precoUnitario: 0.35,
        fornecedor: 'FarmaDistribuidora',
        categoria: 'Analgésico'
      },
      {
        id: 3,
        nome: 'Amoxicilina 500mg',
        quantidade: 80,
        unidade: 'cápsulas',
        lote: 'LOT2024003',
        validade: '2026-03-15',
        precoUnitario: 1.20,
        fornecedor: 'MedSupply',
        categoria: 'Antibiótico'
      }
    ];

    res.json({
      success: true,
      data: medicamentos,
      total: medicamentos.length
    });
  } catch (error) {
    console.error('Erro ao buscar medicamentos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar medicamentos do estoque'
    });
  }
});

// GET /api/estoque/stats - Estatísticas do estoque
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalMedicamentos: 3,
      totalItens: 430,
      valorTotal: 325.50,
      proximosVencer: 1,
      emFalta: 0,
      alertas: [
        {
          tipo: 'validade',
          mensagem: 'Dipirona 500mg vence em 60 dias',
          severidade: 'warning'
        }
      ]
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do estoque:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas'
    });
  }
});

// POST /api/estoque/medicamentos - Adicionar medicamento
router.post('/medicamentos', async (req, res) => {
  try {
    const { nome, quantidade, unidade, lote, validade, precoUnitario, fornecedor, categoria } = req.body;

    const novoMedicamento = {
      id: Date.now(),
      nome,
      quantidade,
      unidade,
      lote,
      validade,
      precoUnitario,
      fornecedor,
      categoria,
      criadoEm: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: novoMedicamento,
      message: 'Medicamento adicionado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao adicionar medicamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao adicionar medicamento'
    });
  }
});

// PUT /api/estoque/medicamentos/:id - Atualizar medicamento
router.put('/medicamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    res.json({
      success: true,
      data: { id, ...updates },
      message: 'Medicamento atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar medicamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar medicamento'
    });
  }
});

// DELETE /api/estoque/medicamentos/:id - Remover medicamento
router.delete('/medicamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      success: true,
      message: 'Medicamento removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover medicamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover medicamento'
    });
  }
});

export default router;
