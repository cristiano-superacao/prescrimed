import api from './api';

export const agendamentoService = {
  getAll: async (params) => {
    const response = await api.get('/agendamentos', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/agendamentos', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/agendamentos/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/agendamentos/${id}`);
    return response.data;
  },
};
