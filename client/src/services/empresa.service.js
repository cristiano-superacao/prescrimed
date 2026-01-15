import api from './api';

export const empresaService = {
  getAll: async () => {
    const response = await api.get('/empresas');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/empresas', data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/empresas/${id}`);
    return response.data;
  },

  getMyCompany: async () => {
    const response = await api.get('/empresas/me');
    return response.data;
  },

  updateMyCompany: async (data) => {
    const response = await api.put('/empresas/me', data);
    return response.data;
  },
};