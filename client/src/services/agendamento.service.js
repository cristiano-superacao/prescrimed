import { get, post, put, del } from './request';

export const agendamentoService = {
  getAll: async (params) => {
    return get('/agendamentos', { params });
  },

  create: async (data) => {
    return post('/agendamentos', data);
  },

  update: async (id, data) => {
    return put(`/agendamentos/${id}`, data);
  },

  delete: async (id) => {
    return del(`/agendamentos/${id}`);
  },
};
