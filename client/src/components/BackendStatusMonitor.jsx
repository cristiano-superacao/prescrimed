import { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import api, { getApiRootUrl } from '../services/api';

export default function BackendStatusMonitor() {
  const [isOnline, setIsOnline] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const healthUrlRoot = getApiRootUrl();
        // Comparar ORIGIN (host + porta) para decidir mesma origem
        let isSameOrigin = false;
        try {
          if (!healthUrlRoot) {
            isSameOrigin = true; // sem root explícito, tenta mesma origem (caso backend sirva o frontend)
          } else {
            const backendOrigin = new URL(healthUrlRoot).origin;
            isSameOrigin = backendOrigin === window.location.origin;
          }
        } catch (_) {
          isSameOrigin = false;
        }

        if (isSameOrigin) {
          // Frontend e backend na MESMA origem (mesmo host+porta)
          const response = await fetch('/health', {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
          });
          
          if (response.ok) {
            setIsOnline(true);
            setShowAlert(false);
          } else {
            setIsOnline(false);
            setShowAlert(true);
          }
          setLastCheck(new Date());
          return;
        }

        // Se não há raiz configurada e não é mesma origem, assumir localhost:3000 em desenvolvimento
        if (!healthUrlRoot) {
          if (import.meta.env.DEV) {
            const guessedRoot = 'http://localhost:3000';
            const response = await fetch(`${guessedRoot}/health`, {
              method: 'GET',
              signal: AbortSignal.timeout(5000)
            });
            if (response.ok) {
              setIsOnline(true);
              setShowAlert(false);
            } else {
              setIsOnline(false);
              setShowAlert(true);
            }
            setLastCheck(new Date());
            return;
          } else {
            console.warn('⚠️ BackendStatusMonitor: VITE_BACKEND_ROOT não configurado, desabilitando healthcheck');
            setIsOnline(true);
            setShowAlert(false);
            setLastCheck(new Date());
            return;
          }
        }

        // Evitar tentar localhost em produção hospedada
        if (healthUrlRoot.includes('localhost') && 
            (window.location.hostname.includes('railway.app') || 
             window.location.hostname.includes('netlify.app') ||
             window.location.hostname.includes('github.io'))) {
          console.error('❌ BackendStatusMonitor: tentando acessar localhost em produção! Configure VITE_BACKEND_ROOT.');
          setIsOnline(false);
          setShowAlert(true);
          setLastCheck(new Date());
          return;
        }

        const healthUrl = `${healthUrlRoot}/health`;
        const response = await fetch(healthUrl, {
          method: 'GET',
          mode: 'cors',
          signal: AbortSignal.timeout(5000) // timeout de 5s
        });
        
        if (response.ok) {
          setIsOnline(true);
          setShowAlert(false);
        } else {
          setIsOnline(false);
          setShowAlert(true);
        }
      } catch (error) {
        console.error('BackendStatusMonitor error:', error.message);
        setIsOnline(false);
        setShowAlert(true);
      }
      setLastCheck(new Date());
    };

    // Checa imediatamente
    checkBackendStatus();

    // Checa a cada 30 segundos (reduzido de 10s para economizar requisições)
    const interval = setInterval(checkBackendStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!showAlert) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
      <div className="bg-red-600 text-white px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 animate-pulse" />
            <div>
              <p className="font-semibold">Backend Offline</p>
              <p className="text-sm opacity-90">
                Não foi possível conectar ao servidor. Verifique se o backend está rodando.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {getApiRootUrl() ? (
              <a
                href={getApiRootUrl() + '/health'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline hover:no-underline"
              >
                Testar Conexão
              </a>
            ) : null}
            <button
              onClick={() => setShowAlert(false)}
              className="text-white hover:bg-red-700 rounded p-1 transition-colors"
              aria-label="Fechar alerta"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-red-700 px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-white/90">
            <strong>Como resolver:</strong> Verifique se a API está rodando no Railway e se as variáveis <code className="bg-red-800 px-2 py-1 rounded text-xs">VITE_BACKEND_ROOT</code> ou <code className="bg-red-800 px-2 py-1 rounded text-xs">VITE_API_URL</code> estão configuradas corretamente no frontend.
          </p>
        </div>
      </div>
    </div>
  );
}
