import { get, post, put, buildQueryString } from './request';

export const prescricaoService = {
  getAll: async (filters = {}) => {
    const qs = buildQueryString(filters);
    return get(`/prescricoes${qs}`);
  },

  getByPaciente: async (pacienteId) => {
    return get(`/prescricoes/paciente/${pacienteId}`);
  },

  getById: async (id) => {
    return get(`/prescricoes/${id}`);
  },

  create: async (data) => {
    return post('/prescricoes', data);
  },

  cancelar: async (id) => {
    return put(`/prescricoes/${id}/cancelar`);
  },

  arquivar: async (id) => {
    return put(`/prescricoes/${id}/arquivar`);
  },
};