import api from './api';

export const pacienteService = {
  getAll: async (search = '') => {
    const url = search ? `/pacientes?${search}` : '/pacientes';
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/pacientes/${id}`);
    return response.data;
  },

  getHistorico: async (id) => {
    const response = await api.get(`/pacientes/${id}/prescricoes`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/pacientes', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/pacientes/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/pacientes/${id}`);
    return response.data;
  },
};