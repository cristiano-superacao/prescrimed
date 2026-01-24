import { get, post, put, del } from './request';

const pacienteService = {
  getAll: async (search = '') => {
    const url = search ? `/pacientes?${search}` : '/pacientes';
    return get(url);
  },

  getById: async (id) => {
    return get(`/pacientes/${id}`);
  },

  getHistorico: async (id) => {
    return get(`/pacientes/${id}/prescricoes`);
  },

  create: async (data) => {
    return post('/pacientes', data);
  },

  update: async (id, data) => {
    return put(`/pacientes/${id}`, data);
  },

  delete: async (id) => {
    return del(`/pacientes/${id}`);
  },
};

export default pacienteService;