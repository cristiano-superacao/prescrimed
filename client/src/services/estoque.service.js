import { get, post } from './request';

const estoqueService = {
  // --- MEDICAMENTOS ---
  getMedicamentos: async () => {
    return get('/estoque/medicamentos');
  },

  createMedicamento: async (data) => {
    return post('/estoque/medicamentos', data);
  },

  movimentarMedicamento: async (data) => {
    // data: { medicamentoId, tipo: 'entrada'|'saida', quantidade, motivo, observacao }
    return post('/estoque/medicamentos/movimentacao', data);
  },

  // --- ALIMENTOS ---
  getAlimentos: async () => {
    return get('/estoque/alimentos');
  },

  createAlimento: async (data) => {
    return post('/estoque/alimentos', data);
  },

  movimentarAlimento: async (data) => {
    // data: { alimentoId, tipo: 'entrada'|'saida', quantidade, motivo, observacao }
    return post('/estoque/alimentos/movimentacao', data);
  },

  // --- ESTATÍSTICAS E RELATÓRIOS ---
  getStats: async () => {
    return get('/estoque/stats');
  },

  getMovimentacoes: async (tipo = '') => {
    const url = tipo ? `/estoque/movimentacoes?tipo=${tipo}` : '/estoque/movimentacoes';
    return get(url);
  }
};

export default estoqueService;
