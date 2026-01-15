import api from './api';

export const estoqueService = {
  // --- MEDICAMENTOS ---
  getMedicamentos: async () => {
    const response = await api.get('/estoque/medicamentos');
    return response.data;
  },

  createMedicamento: async (data) => {
    const response = await api.post('/estoque/medicamentos', data);
    return response.data;
  },

  movimentarMedicamento: async (data) => {
    // data: { medicamentoId, tipo: 'entrada'|'saida', quantidade, motivo, observacao }
    const response = await api.post('/estoque/medicamentos/movimentacao', data);
    return response.data;
  },

  // --- ALIMENTOS ---
  getAlimentos: async () => {
    const response = await api.get('/estoque/alimentos');
    return response.data;
  },

  createAlimento: async (data) => {
    const response = await api.post('/estoque/alimentos', data);
    return response.data;
  },

  movimentarAlimento: async (data) => {
    // data: { alimentoId, tipo: 'entrada'|'saida', quantidade, motivo, observacao }
    const response = await api.post('/estoque/alimentos/movimentacao', data);
    return response.data;
  },

  // --- ESTATÍSTICAS E RELATÓRIOS ---
  getStats: async () => {
    const response = await api.get('/estoque/stats');
    return response.data;
  },

  getMovimentacoes: async (tipo = '') => {
    const url = tipo ? `/estoque/movimentacoes?tipo=${tipo}` : '/estoque/movimentacoes';
    const response = await api.get(url);
    return response.data;
  }
};
