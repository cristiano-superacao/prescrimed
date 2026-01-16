import { get, post, put, del } from './request';

export const empresaService = {
  getAll: async () => {
    return get('/empresas');
  },

  create: async (data) => {
    return post('/empresas', data);
  },

  delete: async (id) => {
    return del(`/empresas/${id}`);
  },

  getMyCompany: async () => {
    return get('/empresas/me');
  },

  updateMyCompany: async (data) => {
    return put('/empresas/me', data);
  },
};