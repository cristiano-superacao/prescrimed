import { useEffect, useState } from 'react';
import { AlertCircle, WifiOff } from 'lucide-react';
import { getApiRootUrl } from '../services/api';

export default function BackendStatusMonitor() {
  const [status, setStatus] = useState('online'); // online | degraded | offline
  const [showAlert, setShowAlert] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);

  useEffect(() => {
    const evaluateHealthResponse = async (response) => {
      // offline: erro de rede ou CORS (tratado no catch)
      // degraded: backend respondeu, mas DB não conectou ainda ou retornou 503
      // online: backend respondeu e DB conectado

      let data = null;
      try {
        data = await response.clone().json();
      } catch (_) {
        data = null;
      }

      // Se /health não retorna JSON (ex.: caiu no frontend estático), trate como offline
      if (response.ok && !data) {
        setStatus('offline');
        setDbStatus(null);
        setShowAlert(true);
        return;
      }

      // Alguns ambientes retornam 503 quando o banco não está pronto
      if (response.status === 503) {
        setStatus('degraded');
        setDbStatus('connecting');
        setShowAlert(true);
        return;
      }

      if (!response.ok) {
        setStatus('offline');
        setDbStatus(null);
        setShowAlert(true);
        return;
      }

      const reportedDb = data?.database;
      if (reportedDb && reportedDb !== 'connected') {
        setStatus('degraded');
        setDbStatus(reportedDb);
        setShowAlert(true);
        return;
      }

      setStatus('online');
      setDbStatus(reportedDb || 'connected');
      setShowAlert(false);
    };

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

          await evaluateHealthResponse(response);
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

            await evaluateHealthResponse(response);
            setLastCheck(new Date());
            return;
          }

          // Em produção Railway integrada, use a mesma origem
          if (window.location.hostname.includes('railway.app')) {
            const response = await fetch('/health', {
              method: 'GET',
              signal: AbortSignal.timeout(5000)
            });

            await evaluateHealthResponse(response);
            setLastCheck(new Date());
            return;
          }

          console.warn('⚠️ BackendStatusMonitor: VITE_BACKEND_ROOT não configurado, desabilitando healthcheck');
          setStatus('online');
          setDbStatus(null);
          setShowAlert(false);
          setLastCheck(new Date());
          return;
        }

        // Evitar tentar localhost em produção hospedada
        if (healthUrlRoot.includes('localhost') && 
          (window.location.hostname.includes('railway.app') || 
           window.location.hostname.includes('github.io'))) {
          console.error('❌ BackendStatusMonitor: tentando acessar localhost em produção! Configure VITE_BACKEND_ROOT.');
          setStatus('offline');
          setDbStatus(null);
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

        await evaluateHealthResponse(response);
      } catch (error) {
        console.error('BackendStatusMonitor error:', error.message);
        setStatus('offline');
        setDbStatus(null);
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

  const isOffline = status === 'offline';
  const isDegraded = status === 'degraded';

  const title = isOffline ? 'Backend Offline' : 'Backend Online (Banco Inicializando)';
  const description = isOffline
    ? 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.'
    : 'O servidor respondeu, mas o banco de dados ainda não está conectado. Aguarde alguns instantes e tente novamente.';

  const testUrl = getApiRootUrl() ? getApiRootUrl() + '/health' : null;

  const barClass = isOffline ? 'bg-red-600' : 'bg-amber-500';
  const barSubClass = isOffline ? 'bg-red-700' : 'bg-amber-600';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
      <div className={`${barClass} text-white px-4 py-3 shadow-lg`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isOffline ? (
              <WifiOff className="w-5 h-5 animate-pulse" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm opacity-90">
                {description}
              </p>
              {isDegraded && dbStatus ? (
                <p className="text-xs opacity-90 mt-1">
                  Status do banco: <span className="font-semibold">{dbStatus}</span>
                </p>
              ) : null}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {testUrl ? (
              <a
                href={testUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline hover:no-underline"
              >
                Testar Conexão
              </a>
            ) : null}
            <button
              onClick={() => setShowAlert(false)}
              className="text-white hover:bg-black/15 rounded p-1 transition-colors"
              aria-label="Fechar alerta"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
      
      <div className={`${barSubClass} px-4 py-2`}>
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-white/90">
            <strong>Como resolver:</strong>{' '}
            {isOffline ? (
              <>Verifique se a API está rodando no Railway e se as variáveis <code className="bg-black/20 px-2 py-1 rounded text-xs">VITE_BACKEND_ROOT</code> ou <code className="bg-black/20 px-2 py-1 rounded text-xs">VITE_API_URL</code> estão configuradas corretamente no frontend.</>
            ) : (
              <>No Railway, confirme se o Postgres foi criado e se <code className="bg-black/20 px-2 py-1 rounded text-xs">DATABASE_URL</code> está presente. Enquanto isso, o sistema pode ficar parcialmente indisponível.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
