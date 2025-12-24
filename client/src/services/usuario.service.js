import api from './api';

export const usuarioService = {
  getAll: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/usuarios', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },

  updatePermissions: async (id, permissoes) => {
    const response = await api.put(`/usuarios/${id}/permissoes`, { permissoes });
    return response.data;
  },

  updatePassword: async (id, senhaAtual, novaSenha) => {
    const response = await api.put(`/usuarios/${id}/senha`, { senhaAtual, novaSenha });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/usuarios/me');
    return response.data;
  },

  getProfileSummary: async () => {
    const response = await api.get('/usuarios/me/summary');
    return response.data;
  },

  updateMe: async (data) => {
    const response = await api.put('/usuarios/me', data);
    return response.data;
  },
};