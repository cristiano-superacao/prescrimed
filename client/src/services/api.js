import axios from 'axios';

// Configuração da API baseada no ambiente
export const getApiUrl = () => {
  // Em produção (Netlify), tenta usar a variável de ambiente primeiro
  if (import.meta.env.PROD) {
    // Se VITE_API_URL estiver definida, usa ela (Railway URL)
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    // Fallback para proxy local
    return '/api';
  }
  // Em desenvolvimento, usa a variável de ambiente ou fallback
  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
};

// Obtém a URL raiz do backend (sem o sufixo /api) para endpoints como /health
export const getApiRootUrl = () => {
  const base = getApiUrl();
  if (base === '/api') {
    // Em produção com proxy Netlify, /health está na origem do site do backend
    // Para o frontend hospedado separadamente, /api proxia para o backend e /health deve ir direto
    // Usaremos o domínio público do backend se fornecido por variável:
    if (import.meta.env.VITE_BACKEND_ROOT) {
      return import.meta.env.VITE_BACKEND_ROOT;
    }
    // Fallback: tentar mesma origem (não ideal para SPA em Netlify com proxy)
    return '';
  }
  // Remove sufixo /api de URLs completas
  return base.replace(/\/api$/, '');
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Erro de rede - backend não está rodando
    if (!error.response) {
      console.error('🔴 Backend offline:', error.message);
      const errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3000';
      
      // Tenta mostrar um toast se disponível
      if (window.showToast) {
        window.showToast(errorMessage, 'error');
      } else {
        console.error(errorMessage);
      }
      
      return Promise.reject({ 
        message: errorMessage,
        originalError: error,
        isNetworkError: true 
      });
    }

    // Se o token expirou, tenta renovar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/auth/refresh', { refreshToken });
        
        const { token } = response.data;
        localStorage.setItem('token', token);
        
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se falhar ao renovar, redireciona para login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Log detalhado de erros
    if (error.response?.status === 404) {
      console.error('🔴 Rota não encontrada:', originalRequest.url);
    } else if (error.response?.status === 400) {
      console.error('🔴 Requisição inválida:', originalRequest.url, error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;