import api from './api';

export const prescricaoService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/prescricoes${params ? `?${params}` : ''}`);
    return response.data;
  },

  getByPaciente: async (pacienteId) => {
    const response = await api.get(`/prescricoes/paciente/${pacienteId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/prescricoes/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/prescricoes', data);
    return response.data;
  },

  cancelar: async (id) => {
    const response = await api.put(`/prescricoes/${id}/cancelar`);
    return response.data;
  },

  arquivar: async (id) => {
    const response = await api.put(`/prescricoes/${id}/arquivar`);
    return response.data;
  },
};