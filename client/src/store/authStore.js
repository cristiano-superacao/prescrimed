import { create } from 'zustand';
import { authService } from '../services/auth.service';

const getUser = () => {
  const user = authService.getCurrentUser();
  const token = localStorage.getItem('token');
  if (!user || !token) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
  return user;
};

export const useAuthStore = create((set) => ({
  user: getUser(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!getUser(),

  login: async (email, senha) => {
    const data = await authService.login(email, senha);
    set({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  hasPermission: (modulo) => {
    const state = useAuthStore.getState();
    if (!state.user) return false;
    if (state.user.role === 'admin' || state.user.role === 'superadmin') return true;
    return state.user.permissoes?.includes(modulo) || false;
  },
}));