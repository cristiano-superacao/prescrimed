import { get, post, put, del } from './request';

const empresaService = {
  // Listar todas as empresas (apenas superadmin)
  getAll: async () => {
    return get('/empresas');
  },

  // Buscar empresa por ID (apenas superadmin)
  getById: async (id) => {
    return get(`/empresas/${id}`);
  },

  // Criar nova empresa (apenas superadmin)
  create: async (data) => {
    return post('/empresas', data);
  },

  // Atualizar empresa por ID (apenas superadmin)
  update: async (id, data) => {
    return put(`/empresas/${id}`, data);
  },

  // Deletar empresa (apenas superadmin)
  delete: async (id) => {
    return del(`/empresas/${id}`);
  },

  // Buscar empresa do usuário autenticado
  getMyCompany: async () => {
    return get('/empresas/me');
  },

  // Atualizar empresa do usuário autenticado
  updateMyCompany: async (data) => {
    return put('/empresas/me', data);
  },
};

export default empresaService;