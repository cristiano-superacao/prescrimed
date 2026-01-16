import { get, post, put, del, buildQueryString } from './request';

export const financeiroService = {
  getAll: async (filters = {}) => {
    const qs = buildQueryString({
      tipo: filters.tipo,
      status: filters.status,
      dataInicio: filters.dataInicio,
      dataFim: filters.dataFim,
    });
    return get(`/financeiro${qs}`);
  },

  getStats: async () => {
    return get('/financeiro/stats');
  },

  create: async (data) => {
    return post('/financeiro', data);
  },

  update: async (id, data) => {
    return put(`/financeiro/${id}`, data);
  },

  delete: async (id) => {
    return del(`/financeiro/${id}`);
  }
};
