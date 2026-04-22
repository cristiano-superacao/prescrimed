import { supabaseClient } from '../lib/supabase';
import { post } from './request';

const authService = {
  /**
   * Login via Supabase Auth.
   * O authStore chama esta função e lida com o estado resultante.
   * Não armazena token manualmente — o Supabase SDK gerencia a sessão.
   */
  login: async (email, senha) => {
    if (!supabaseClient) {
      throw Object.assign(new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'), {
        response: { status: 503, data: { error: 'Supabase não configurado.' } },
      });
    }

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      // Supabase retorna 400 para credenciais inválidas — mapeia para 401
      const status = error.status === 400 ? 401 : (error.status || 401);
      throw Object.assign(new Error(error.message), {
        response: { status, data: { error: error.message } },
      });
    }
  },

  /**
   * Logout: encerra a sessão no Supabase e limpa dados locais.
   */
  logout: async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    localStorage.removeItem('prescrimed_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Retorna o usuário salvo localmente (compatível com sessões antigas).
   */
  getCurrentUser: () => {
    try {
      const raw = localStorage.getItem('prescrimed_user') || localStorage.getItem('user');
      if (!raw || raw === 'undefined') return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Registro: cria a empresa + usuário no banco via backend e cria a conta
   * no Supabase Auth para permitir login via supabase.auth.signInWithPassword.
   */
  register: async (data) => {
    // 1. Cria Empresa + Usuario no banco da aplicação
    await post('/auth/register', data);

    // 2. Cria conta no Supabase Auth (permite login futuro sem JWT customizado)
    if (supabaseClient) {
      const { error } = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.senha,
        options: {
          data: { nome: data.nomeAdmin || data.nomeUsuario },
        },
      });
      if (error && error.message !== 'User already registered') {
        console.warn('[Supabase Auth] signUp:', error.message);
      }
    }
  },
};

export default authService;