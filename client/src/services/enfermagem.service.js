import { get, post, put, del } from './request';

const enfermagemService = {
  getAll: async (params) => {
    return get('/enfermagem', { params });
  },

  getById: async (id) => {
    return get(`/enfermagem/${id}`);
  },

  create: async (data) => {
    return post('/enfermagem', data);
  },

  update: async (id, data) => {
    return put(`/enfermagem/${id}`, data);
  },

  delete: async (id) => {
    return del(`/enfermagem/${id}`);
  },

  getStats: async () => {
    return get('/enfermagem/stats/dashboard');
  }
};

export default enfermagemService;
