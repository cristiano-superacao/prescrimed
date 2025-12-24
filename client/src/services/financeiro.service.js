import api from './api';

export const financeiroService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.tipo) params.append('tipo', filters.tipo);
    if (filters.status) params.append('status', filters.status);
    if (filters.dataInicio) params.append('dataInicio', filters.dataInicio);
    if (filters.dataFim) params.append('dataFim', filters.dataFim);
    
    const response = await api.get(`/financeiro?${params.toString()}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/financeiro/stats');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/financeiro', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/financeiro/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/financeiro/${id}`);
    return response.data;
  }
};
