import axios from 'axios';
import { getSelectedEmpresaId } from '../utils/empresaContext';

const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const isProduction = import.meta.env.PROD;
const explicitApiUrl = import.meta.env.VITE_API_URL?.trim();
const explicitBackendRoot = import.meta.env.VITE_BACKEND_ROOT?.trim();

const getRootFromApiUrl = (apiUrl) => {
  if (!apiUrl) return '';
  return apiUrl.replace(/\/api\/?$/, '');
};

// Configuração da API baseada no ambiente
export const getApiUrl = () => {
  const isRailwayHost = hostname.includes('railway.app');

  if (isProduction && explicitApiUrl) {
    console.log('🌍 Produção com API explícita configurada:', explicitApiUrl);
    return explicitApiUrl;
  }
  
  if (isRailwayHost && isProduction) {
    console.log('🚂 Railway detectado - usando /api (mesmo serviço)');
    return '/api';
  }

  if (isProduction) {
    console.log('🌐 Produção em domínio próprio - usando /api na mesma origem');
    return '/api';
  }

  const devApiUrl = explicitApiUrl || 'http://localhost:8000/api';
  console.log('💻 Desenvolvimento local - usando', devApiUrl);
  return devApiUrl;
};

// Obtém a URL raiz do backend (sem o sufixo /api) para endpoints como /health
export const getApiRootUrl = () => {
  const isRailwayHost = hostname.includes('railway.app');

  if (isProduction && explicitBackendRoot) {
    return explicitBackendRoot;
  }

  if (isProduction && explicitApiUrl) {
    return getRootFromApiUrl(explicitApiUrl);
  }

  if (isRailwayHost && isProduction) {
    return ''; // Mesma origem
  }

  if (isProduction) {
    return ''; // Domínio próprio servindo API e frontend na mesma origem
  }

  const devBackendRoot = explicitBackendRoot || getRootFromApiUrl(explicitApiUrl) || 'http://localhost:8000';
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