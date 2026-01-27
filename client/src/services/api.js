import axios from 'axios';
import { getSelectedEmpresaId } from '../utils/empresaContext';

// Raiz do backend em produção (configurável via Vite)
const VITE_BACKEND_ROOT = import.meta.env.VITE_BACKEND_ROOT;
// Fallback para domínio padrão caso variável não esteja definida
const DEFAULT_RAILWAY_URL = 'https://prescrimed-backend-production.up.railway.app';
const RAILWAY_URL = VITE_BACKEND_ROOT || DEFAULT_RAILWAY_URL;

// Configuração da API baseada no ambiente
export const getApiUrl = () => {
  // Detectar se está no Railway
  const isRailwayHost = window.location.hostname.includes('railway.app');
  
  // Se está no Railway, sempre usar /api (mesmo serviço)
  if (isRailwayHost && import.meta.env.PROD) {
    console.log('🚂 Railway detectado - usando /api (mesmo serviço)');
    return '/api';
  }

  // Se está no GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io');
  if (isGitHubPages && import.meta.env.PROD) {
    console.log('📄 GitHub Pages detectado - conectando ao backend configurado');
    return `${RAILWAY_URL}/api`;
  }

  // Em desenvolvimento local
  // Verifica variável de ambiente ou tenta detectar porta automaticamente
  const devApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';
  console.log('💻 Desenvolvimento local - usando', devApiUrl);
  return devApiUrl;
};

// Obtém a URL raiz do backend (sem o sufixo /api) para endpoints como /health
export const getApiRootUrl = () => {
  // Se está no Railway
  const isRailwayHost = window.location.hostname.includes('railway.app');
  if (isRailwayHost && import.meta.env.PROD) {
    return ''; // Mesma origem
  }

  // Se está no GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io');
  if (isGitHubPages && import.meta.env.PROD) {
    return RAILWAY_URL;
  }

  // Em desenvolvimento local
  const devBackendRoot = import.meta.env.VITE_BACKEND_ROOT || 'http://localhost:8001';
  return devBackendRoot;
};

console.log('🌐 API URL configurada:', getApiUrl());
console.log('🏠 API Root URL:', getApiRootUrl());

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

    // Contexto opcional de empresa para superadmin
    // (permite usar módulos multi-tenant com uma empresa selecionada)
    try {
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      const selectedEmpresaId = getSelectedEmpresaId();

      if (user?.role === 'superadmin' && selectedEmpresaId) {
        config.headers['X-Empresa-Id'] = selectedEmpresaId;
      }
    } catch {
      // ignora parsing inválido
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

    // Se o token expirou, tenta renovar (mas NÃO se já estiver tentando renovar!)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // IMPORTANTE: Não tentar renovar se a requisição já é para /auth/refresh ou /auth/login
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        localStorage.clear();
        if (window && window.location && !window.location.hash.includes('#/login')) {
          window.location.hash = '#/login';
        }
        return Promise.reject({ message: 'Sessão expirada. Faça login novamente.' });
      }

      originalRequest._retry = true;

      try {
        // Pega o token atual para tentar renovar
        const currentToken = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        
        // Se não houver token, redireciona para login imediatamente SEM tentar renovar
        if (!currentToken && !refreshToken) {
          localStorage.clear();
          if (window && window.location && !window.location.hash.includes('#/login')) {
            window.location.hash = '#/login';
          }
          return Promise.reject({ message: 'Sessão expirada. Faça login novamente.' });
        }
        
        // Tenta renovar o token usando o token atual ou refreshToken
        const response = await api.post('/auth/refresh', { 
          refreshToken: refreshToken || currentToken 
        });
        
        const { token } = response.data;
        localStorage.setItem('token', token);
        
        // Se houver dados de usuário na resposta, atualiza
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se falhar ao renovar, limpa storage e redireciona para login
        console.error('🔴 Falha ao renovar token:', refreshError);
        localStorage.clear();
        
        // Em apps SPA com HashRouter (ex.: GitHub Pages), garanta redirecionamento correto
        if (window && window.location && !window.location.hash.includes('#/login')) {
          window.location.hash = '#/login';
        }
        return Promise.reject({ 
          message: 'Sessão expirada. Faça login novamente.',
          originalError: refreshError 
        });
      }
    }

    // Log detalhado de erros
    if (error.response?.status === 404) {
      console.error('🔴 Rota não encontrada:', originalRequest.url);
    } else if (error.response?.status === 400) {
      console.error('🔴 Requisição inválida:', originalRequest.url, error.response.data);
    }

    // Erros 5xx/503: mantém UI responsiva e comunica de forma elegante
    if (error.response?.status >= 500) {
      const status = error.response.status;
      const serverMessage = error.response?.data?.error;
      const message = status === 503
        ? (serverMessage || 'Serviço temporariamente indisponível. Tente novamente em instantes.')
        : (serverMessage || 'Erro interno no servidor. Tente novamente em instantes.');

      if (window.showToast) {
        window.showToast(message, 'error');
      }
    }

    return Promise.reject(error);
  }
);

export default api;