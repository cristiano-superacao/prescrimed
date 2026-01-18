import axios from 'axios';

// Fallback padrão para produção em GitHub Pages quando variáveis não estão presentes
const DEFAULT_RAILWAY_ROOT = 'https://prescrimed-backend-production.up.railway.app';
const DEFAULT_RAILWAY_API = `${DEFAULT_RAILWAY_ROOT}/api`;

// Configuração da API baseada no ambiente
export const getApiUrl = () => {
  // Detectar se está em ambiente hospedado (Railway/Netlify/Pages)
  const isHostedProd = import.meta.env.PROD && (
    window.location.hostname.includes('railway.app') ||
    window.location.hostname.includes('netlify.app') ||
    window.location.hostname.includes('github.io')
  );

  // Detecta se este host é o próprio backend padrão do Railway
  // (quando backend e frontend estiverem servidos pelo mesmo serviço)
  const defaultBackendHost = new URL(DEFAULT_RAILWAY_ROOT).hostname;
  const isOnDefaultBackendHost = window.location.hostname === defaultBackendHost;

  // Se VITE_API_URL estiver definida, usa ela (prioridade máxima)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback: se BACKEND_ROOT estiver definido, monta /api a partir dele
  if (import.meta.env.VITE_BACKEND_ROOT) {
    const root = import.meta.env.VITE_BACKEND_ROOT.replace(/\/$/, '');
    return `${root}/api`;
  }

  // Em produção hospedada SEM variáveis configuradas
  if (isHostedProd) {
    // Se estivermos no host do backend (mesmo domínio), use proxy relativo
    if (isOnDefaultBackendHost) {
      return '/api';
    }

    // Caso contrário, use o backend público padrão no Railway
    console.warn('⚠️ VITE_* não configurada. Usando fallback para Railway backend público.');
    return DEFAULT_RAILWAY_API;
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
  if (base === '/api') return '';
  
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
        // Usa a raiz do backend se disponível para dar instruções mais úteis
        const root = getApiRootUrl();
        const hostHint = root ? `${root}` : 'seu backend/configurações de ambiente';
        const errorMessage = `Não foi possível conectar ao servidor. Verifique se o backend está acessível em ${hostHint} e se as variáveis de ambiente do frontend estão configuradas.`;
      
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