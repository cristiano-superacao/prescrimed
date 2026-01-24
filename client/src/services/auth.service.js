import { post } from './request';

const authService = {
  register: async (data) => {
    return post('/auth/register', data);
  },

  login: async (email, senha) => {
    const data = await post('/auth/login', { email, senha });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      if (!user || user === 'undefined') return null;
      return JSON.parse(user);
    } catch (error) {
      console.error('Erro ao recuperar usuário:', error);
      localStorage.removeItem('user');
      return null;
    }
  },
};

export default authService;