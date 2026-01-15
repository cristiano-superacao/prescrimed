import axios from 'axios';

// Configuração da API baseada no ambiente
export const getApiUrl = () => {
  // Detectar se está em ambiente hospedado (Railway/Netlify/Pages)
  const isHostedProd = import.meta.env.PROD && (
    window.location.hostname.includes('railway.app') ||
    window.location.hostname.includes('netlify.app') ||
    window.location.hostname.includes('github.io')
  );

  // Se VITE_API_URL estiver definida, usa ela (prioridade máxima)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback: se BACKEND_ROOT estiver definido, monta /api a partir dele
  if (import.meta.env.VITE_BACKEND_ROOT) {
    const root = import.meta.env.VITE_BACKEND_ROOT.replace(/\/$/, '');
    return `${root}/api`;
  }

  // Em produção hospedada SEM variáveis configuradas, usar proxy relativo
  if (isHostedProd) {
    console.warn('⚠️ VITE_API_URL não configurada. Configure as variáveis de ambiente no Railway/Netlify.');
    return '/api';
  }

  // Em desenvolvimento local
  return 'http://localhost:3000/api';
};

// Obtém a URL raiz do backend (sem o sufixo /api) para endpoints como /health
export const getApiRootUrl = () => {
  // Prioridade 1: variável explícita
  if (import.meta.env.VITE_BACKEND_ROOT) {
    return import.meta.env.VITE_BACKEND_ROOT.replace(/\/$/, '');
  }

  // Prioridade 2: derivar de VITE_API_URL
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api$/, '');
  }

  // Fallback: tentar derivar do getApiUrl
  const base = getApiUrl();
  if (base === '/api') {
    // Proxy relativo - healthcheck não funcionará sem BACKEND_ROOT
    console.warn('⚠️ VITE_BACKEND_ROOT não configurado. Banner de status offline não funcionará.');
    return '';
  }
  
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