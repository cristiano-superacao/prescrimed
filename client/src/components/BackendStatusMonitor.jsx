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
        // Se não há raiz configurada (ex.: variável não definida no cliente em produção),
        // não mostramos alerta para evitar falso positivo em ambientes hospedados.
        if (!healthUrlRoot) {
          setIsOnline(true);
          setShowAlert(false);
          setLastCheck(new Date());
          return;
        }
        const healthUrl = `${healthUrlRoot}/health`;
        const response = await fetch(healthUrl, {
          method: 'GET',
          mode: 'cors',
        });
        
        if (response.ok) {
          setIsOnline(true);
          setShowAlert(false);
        } else {
          setIsOnline(false);
          setShowAlert(true);
        }
      } catch (error) {
        setIsOnline(false);
        setShowAlert(true);
      }
      setLastCheck(new Date());
    };

    // Checa imediatamente
    checkBackendStatus();

    // Checa a cada 10 segundos
    const interval = setInterval(checkBackendStatus, 10000);

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
            <a
              href={(getApiRootUrl() || '') + '/health'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline hover:no-underline"
            >
              Testar Conexão
            </a>
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
            <strong>Como resolver:</strong> Verifique se a API está rodando no Railway e se a variável <code className="bg-red-800 px-2 py-1 rounded text-xs">VITE_API_URL</code> está configurada corretamente no frontend.
          </p>
        </div>
      </div>
    </div>
  );
}
