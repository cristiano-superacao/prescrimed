// ...arquivo consolidado, sem marcadores de conflito...
/**
 * Servidor Principal - Prescrimed Backend
 * 
 * Arquivo principal do servidor Express que configura e inicia a aplicação backend.
 * 
 * Funcionalidades:
 * - Configuração de middlewares de segurança (Helmet, CORS)
 * - Configuração de otimização (Compression, Morgan logger)
 * - Conexão com banco de dados PostgreSQL via Sequelize
 * - Registro de rotas da API REST
 * - Servir frontend estático (build do Vite)
 * - Health check para monitoramento
 * - Tratamento global de erros
 * - Fallback automático de portas em caso de conflito
 */

// Importa framework Express para criação do servidor web
import express from 'express';

// Log inicial indicando início do servidor
console.log('🎬 Iniciando servidor Prescrimed...');

// Define timezone do Brasil (Horário de Brasília)
process.env.TZ = process.env.TZ || 'America/Sao_Paulo';
console.log(`🌍 Timezone configurado: ${process.env.TZ}`);

// Importa middlewares essenciais
import cors from 'cors';              // Habilita CORS (Cross-Origin Resource Sharing)
import helmet from 'helmet';          // Adiciona headers de segurança HTTP
import compression from 'compression'; // Compressão gzip de respostas
import morgan from 'morgan';          // Logger de requisições HTTP
import dotenv from 'dotenv';          // Carrega variáveis de ambiente do .env
import path from 'path';              // Manipulação de caminhos de arquivos
import { fileURLToPath } from 'url'; // Conversão de URL para path (necessário em ES Modules)

// Importa rotas e configuração do banco de dados
import apiRouter from './routes/index.js'; // Router principal da API
import { sequelize, Usuario } from './models/index.js'; // Instância do Sequelize (ORM)

/**
 * Configuração do __dirname para ES Modules
 * (Em CommonJS __dirname é global, mas em ES Modules precisa ser criado)
 */
const __filename = fileURLToPath(import.meta.url); // Caminho do arquivo atual
const __dirname = path.dirname(__filename);         // Diretório do arquivo atual

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Define porta inicial do servidor (padrão 8000 se não especificada)
function parsePort(value, fallbackPort = 8000) {
  const raw = (value ?? '').toString().trim();
  const parsed = Number.parseInt(raw, 10);

  // Railway/Nixpacks exige PORT numérico; ainda assim, garantimos fallback seguro.
  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) return fallbackPort;
  if (parsed < 0 || parsed > 65535) return fallbackPort;
  return parsed;
}

let PORT = parsePort(process.env.PORT, 8000);

// Cria instância do aplicativo Express
const app = express();

// Flag para indicar se banco de dados está pronto (compartilhado entre rotas)
app.locals.dbReady = false;
// Último erro de conexão do banco (para diagnóstico via /health)
app.locals.dbLastError = null;

/**
 * Configuração de secrets padrão para desenvolvimento
 * Previne erros 500 por falta de variáveis JWT em ambiente local
 */
if (process.env.NODE_ENV !== 'production') {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me';
  process.env.SESSION_TIMEOUT = process.env.SESSION_TIMEOUT || '8h';
} else {
  // Em produção, garante que JWT_SECRET tenha um valor válido
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET não definido. Usando valor padrão (NÃO RECOMENDADO EM PRODUÇÃO!)');
    process.env.JWT_SECRET = 'production-default-secret-CHANGE-ME-IMMEDIATELY';
  }
  process.env.SESSION_TIMEOUT = process.env.SESSION_TIMEOUT || '8h';
}

/**
 * Função para conectar ao banco de dados PostgreSQL
 * Executa em background para não bloquear início do servidor
 */
async function connectDB(retryCount = 0) {
  try {
    console.log(`📡 Conectando ao banco de dados... (tentativa ${retryCount + 1})`);
    app.locals.dbLastError = null;
    
    // Testa conexão com o banco
    await sequelize.authenticate();
    console.log('✅ Banco de dados conectado com sucesso');

    // Marca banco como pronto imediatamente após autenticar
    app.locals.dbReady = true;

    // Em PostgreSQL, ENUM não aceita novos valores sem ALTER TYPE.
    // Para manter compatibilidade com bancos já existentes no Railway,
    // adiciona (se necessário) as novas funções no enum de usuarios.role.
    try {
      const dialect = typeof sequelize.getDialect === 'function' ? sequelize.getDialect() : undefined;
      if (dialect === 'postgres') {
        const qi = sequelize.getQueryInterface();
        const enumTypeName = 'enum_usuarios_role';
        const roleValues = [
          'superadmin',
          'admin',
          'nutricionista',
          'atendente',
          'enfermeiro',
          'tecnico_enfermagem',
          'fisioterapeuta',
          'assistente_social',
          'auxiliar_administrativo'
        ];

        for (const value of roleValues) {
          // Só tenta alterar se o tipo existir e o label não existir
          await qi.sequelize.query(
            `DO $$
            BEGIN
              IF EXISTS (SELECT 1 FROM pg_type WHERE typname = '${enumTypeName}') AND
                 NOT EXISTS (
                   SELECT 1
                   FROM pg_type t
                   JOIN pg_enum e ON t.oid = e.enumtypid
                   WHERE t.typname = '${enumTypeName}' AND e.enumlabel = '${value}'
                 )
              THEN
                EXECUTE format('ALTER TYPE %I ADD VALUE %L', '${enumTypeName}', '${value}');
              END IF;
            END $$;`
          );
        }
      }
    } catch (e) {
      console.warn('⚠️ Não foi possível garantir valores do ENUM usuarios.role:', e?.message || e);
    }
    
    /**
     * Sincronização de modelos com banco de dados
     * Cria/atualiza tabelas baseado nos modelos Sequelize
     */
    if (process.env.NODE_ENV !== 'production') {
      // DESENVOLVIMENTO: detecta schema desatualizado (ex.: nova coluna 'tipo' em EstoqueItens)
      let devAlter = false;
      try {
        const qi = sequelize.getQueryInterface();
        const cols = await qi.describeTable('EstoqueItens');
        if (!cols?.tipo) {
          console.log("🔧 Schema dev desatualizado (faltando coluna 'tipo' em EstoqueItens) - aplicando alter...");
          devAlter = true;
        }
      } catch {
        // Se tabela não existir ainda, cria com alter
        devAlter = true;
      }
      await sequelize.sync({ force: false, alter: devAlter });
      console.log(`✅ Tabelas sincronizadas (modo desenvolvimento${devAlter ? ' com ALTER' : ''})`);
    } else {
      // PRODUÇÃO: usa alter apenas se FORCE_SYNC=true
      // Útil para primeira implantação ou atualizações de schema
      let useAlter = process.env.FORCE_SYNC === 'true';

      // Se for uma atualização incremental (ex.: adicionamos novas colunas),
      // tenta detectar schema desatualizado e aplicar alter automaticamente.
      if (!useAlter) {
        try {
          const qi = sequelize.getQueryInterface();
          const tableName = Usuario.getTableName();
          const cols = await qi.describeTable(tableName);
          if (!cols?.permissoes) {
            console.log('🔧 Schema desatualizado detectado (faltando coluna permissoes) - aplicando alter...');
            useAlter = true;
          }
        } catch {
          // Se a tabela ainda não existir (primeiro deploy), precisa criar.
          useAlter = true;
        }
      }
      if (useAlter) {
        const alterReason = process.env.FORCE_SYNC === 'true' ? 'FORCE_SYNC' : 'ALTER';
        console.log(`🔧 ${alterReason} ativado - criando/atualizando tabelas...`);
        await sequelize.sync({ alter: true }); // Altera estrutura existente
        console.log(`✅ Tabelas criadas/sincronizadas (produção com ${alterReason})`);
      } else {
        await sequelize.sync({ force: false }); // Não altera estrutura
        console.log('✅ Modelos sincronizados (produção)');
      }
    }
    
    // Garante flag de pronto após sincronização
    app.locals.dbReady = true;

    // Seed opcional (útil no primeiro deploy do Railway)
    // Executa somente quando explicitamente ativado via variável de ambiente.
    if (process.env.SEED_MINIMAL === 'true') {
      const dialect = typeof sequelize.getDialect === 'function' ? sequelize.getDialect() : undefined;
      if (dialect && dialect !== 'postgres') {
        console.warn(`⚠️ SEED_MINIMAL=true ignorado: dialeto atual é '${dialect}'. Configure DATABASE_URL (Postgres) no Railway.`);
      } else {
        try {
          console.log('🌱 SEED_MINIMAL=true - executando seed mínimo...');
          const { seedMinimal } = await import('./scripts/seed-minimal-demo.js');
          await seedMinimal({ closeConnection: false });
          console.log('✅ Seed mínimo executado com sucesso');
        } catch (seedError) {
          console.error('❌ Seed mínimo falhou:', seedError);
        }
      }
    }

    console.log('🎉 Sistema pronto para uso!');
  } catch (error) {
    console.error('❌ Erro ao conectar no banco de dados:', error.message);
    app.locals.dbReady = false;
    app.locals.dbLastError = error?.message || String(error);
    
    // Retry automático com backoff exponencial
    const delayMs = Math.min(5000 * Math.pow(2, retryCount), 30000); // Máximo 30 segundos
    console.log(`🔄 Tentando reconectar em ${delayMs / 1000} segundos...`);
    setTimeout(() => connectDB(retryCount + 1), delayMs);
  }
}

// Inicia conexão com banco de dados (não aguarda conclusão - assíncrono)
connectDB();

// CORS liberal APENAS para endpoints de health (para funcionar no GitHub Pages)
const healthCors = cors({ origin: true, methods: ['GET', 'OPTIONS'] });

/**
 * Rota de Health Check
 * Endpoint simples para verificar se servidor está online
 * Usado por sistemas de monitoramento (Railway, Render, AWS, etc)
 */
app.options('/health', healthCors);
app.get('/health', healthCors, (req, res) => {
  console.log('🔎 [HEALTH] Requisição recebida em /health');
  
  // Garante CORS universal para o health (útil para UIs em domínios diferentes)
  // Mesmo usando o middleware cors({ origin: true }), alguns proxies podem
  // omitir o header. Forçamos aqui para evitar bloqueios de verificação.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Responde imediatamente para evitar timeout do Railway
  res.status(200).json({ 
    status: 'ok',                              // Status do servidor
    uptime: process.uptime(),                  // Tempo ativo em segundos
    database: app.locals.dbReady ? 'connected' : 'connecting', // Status do banco
    timestamp: new Date().toISOString(),       // Timestamp atual
    env: process.env.NODE_ENV
  });
});

// Alternativa: health sob namespace da API, útil para plataformas que esperam /api/health
app.options('/api/health', healthCors);
app.get('/api/health', healthCors, (req, res) => {
  console.log('🔎 [HEALTH] Requisição recebida em /api/health');
  
  // Garante CORS universal para o health da API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Responde imediatamente para evitar timeout
  res.status(200).json({ 
    status: 'ok',
    uptime: process.uptime(),
    database: app.locals.dbReady ? 'connected' : 'connecting',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

/**
 * Configuração de Middlewares de Segurança e Performance
 */

// Helmet: adiciona headers de segurança HTTP
app.use(helmet({
  contentSecurityPolicy: false, // Desabilita CSP para não bloquear recursos do frontend
}));

// Compression: comprime respostas com gzip para reduzir tamanho
app.use(compression());

// Morgan: logger de requisições HTTP em modo desenvolvimento
app.use(morgan('dev'));

/**
 * Configuração de CORS (Cross-Origin Resource Sharing)
 * Define quais origens externas podem acessar a API
 */

// Lista base de origens permitidas
// Compatibilidade com variáveis comuns no Railway
// (alguns projetos usam URL_FRONTEND/CORS_ORIGIN em vez de FRONTEND_URL/ALLOWED_ORIGINS)
if (!process.env.FRONTEND_URL && process.env.URL_FRONTEND) {
  process.env.FRONTEND_URL = process.env.URL_FRONTEND;
}

const corsOriginEnv = (process.env.CORS_ORIGIN || '').trim();

const baseOrigins = [
  'http://localhost:5173',  // Vite dev server (frontend em desenvolvimento)
  'http://localhost:3000',  // Backend local
  // Railway frontend (domínio principal em produção)
  'https://prescrimed.up.railway.app',
  'https://prescrimed-production.up.railway.app',
  // Railway backend (API em produção)
  'https://prescrimed-backend-production.up.railway.app',
  // GitHub Pages (hospedagem alternativa)
  'https://cristiano-superacao.github.io',
  'https://cristiano-superacao.github.io/prescrimed',
  process.env.FRONTEND_URL, // URL customizada via variável de ambiente
  process.env.URL_FRONTEND,
  corsOriginEnv || null,
  process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null
].filter(Boolean); // Remove valores null/undefined

// Origens adicionais via variável de ambiente (separadas por vírgula)
const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')          // Divide string em array
  .map(o => o.trim())  // Remove espaços em branco
  .filter(Boolean);    // Remove strings vazias

if (corsOriginEnv) {
  extraOrigins.push(corsOriginEnv);
}

// Combina e remove duplicatas
const allowedOrigins = Array.from(new Set([...baseOrigins, ...extraOrigins]));

// Opções de configuração do CORS
const corsOptions = {
  /**
   * Função que valida se a origem da requisição é permitida
   */
  origin: function (origin, callback) {
    // Permite requisições sem origin (mobile apps, curl, Postman, etc)
    if (!origin) return callback(null, true);
    
    // Verifica se origem está na lista permitida OU é ambiente de desenvolvimento
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true); // Permite acesso
    } else {
      console.warn(`CORS bloqueado para origem: ${origin}`);
      callback(new Error('Origem não permitida pelo CORS')); // Bloqueia acesso
    }
  },
  credentials: true, // Permite envio de cookies e headers de autenticação
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
};

// Responde preflight (OPTIONS) também fora de /api.
// Alguns hosts/CDNs fazem OPTIONS para assets/HTML e, sem isso, podem retornar 405.
const globalCors = cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
app.options('*', globalCors);

// Aplica CORS apenas nas rotas /api/* (não afeta /health)
app.use('/api', cors(corsOptions));

// Se o banco ainda não estiver pronto, evite 500 em produção e retorne 503 com mensagem clara
app.use('/api', (req, res, next) => {
  // Permitir endpoint de teste mesmo se o DB estiver indisponível
  if (req.path === '/test') return next();
  // Permitir diagnóstico (pode responder 503/500 conforme conexão)
  if (req.path.startsWith('/diagnostic')) return next();

  if (!app.locals.dbReady) {
    return res.status(503).json({
      error: 'Banco de dados indisponível no momento',
      hint: 'Verifique se o PostgreSQL do Railway está criado e se DATABASE_URL está configurada.'
    });
  }
  next();
});

// Trata requisições OPTIONS (preflight) para todas as rotas de API
app.options('/api/*', cors(corsOptions));

// Responde requisições HEAD nas rotas de API (verificações de conectividade)
app.head('/api/*', (req, res) => {
  res.status(200).end(); // Retorna 200 OK sem corpo
});

/**
 * Body Parser - DEVE VIR ANTES das rotas
 * Permite que Express processe requisições com corpo JSON e URL-encoded
 */
app.use(express.json()); // Parse de JSON no corpo da requisição
app.use(express.urlencoded({ extended: true })); // Parse de formulários

/**
 * Middleware de validação de métodos HTTP
 * Garante que apenas métodos permitidos sejam aceitos
 */
// Log detalhado de requisições na API (sem bloquear métodos incomuns)
app.use('/api', (req, res, next) => {
  console.log(`[API] ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * Registro de Rotas da API
 * Todas as rotas da API são prefixadas com /api
 */
app.use('/api', apiRouter);

/**
 * Servir Arquivos Estáticos do Frontend
 * Serve o build do frontend React (gerado pelo Vite)
 */

// Caminho para a pasta dist do cliente (build de produção)
const clientDistPath = path.join(__dirname, 'client', 'dist');
console.log(`📁 Servindo arquivos estáticos de: ${clientDistPath}`);

// Importa módulo fs para verificar se diretório existe
import fs from 'fs';

// Verifica se o diretório dist existe antes de tentar servir
if (fs.existsSync(clientDistPath)) {
  // Configura Express para servir arquivos estáticos da pasta dist
  // Rota explícita para assets com cache agressivo
  app.use('/assets', (req, res, next) => {
    console.log(`[STATIC] ${req.method} ${req.originalUrl}`);
    next();
  }, express.static(path.join(clientDistPath, 'assets'), {
    immutable: true,
    maxAge: '1y'
  }));

  // Servir demais arquivos estáticos (index.html, favicon, etc.)
  // Evita cache agressivo de HTML para não ficar referenciando assets antigos (hash).
  app.use(express.static(clientDistPath, {
    maxAge: 0,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  }));

  // Favicon explícito (garante /favicon.ico mesmo com fallback SPA)
  app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'favicon.ico'), (err) => {
      if (err) res.status(404).end();
    });
  });
  console.log('✅ Frontend estático disponível');
} else {
  // Se não existir, API funciona mas frontend não está disponível
  console.log('⚠️ Diretório client/dist não encontrado - frontend não será servido (modo backend only)');
}

/**
 * Servir Pasta WEB Estática (Landing Page Institucional)
 * Pasta opcional para site institucional/marketing
 */
const webStaticPath = path.join(__dirname, 'WEB');
if (fs.existsSync(webStaticPath)) {
  // Serve arquivos da pasta WEB na rota /web
  app.use('/web', express.static(webStaticPath));
  console.log(`✅ Pasta WEB servida em /web de: ${webStaticPath}`);
} else {
  // Pasta WEB é opcional, não é erro se não existir
  console.log('ℹ️ Pasta WEB não encontrada (opcional).');
}

/**
 * SPA Fallback
 * Todas as rotas não encontradas (exceto /api) retornam index.html
 * Isso permite que o React Router funcione corretamente em produção
 */
app.use((req, res, next) => {
  // Se for rota de API, retorna erro 404 JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Rota de API não encontrada' });
  }

  // Nunca faça fallback SPA para arquivos estáticos.
  // Se um asset não existir (hash antigo em cache), queremos 404 (não index.html).
  if (req.path.startsWith('/assets/')) {
    return res.status(404).end();
  }
  if (path.extname(req.path)) {
    return res.status(404).end();
  }
  
  // Se frontend não existe, retorna informações da API
  if (!fs.existsSync(clientDistPath)) {
    return res.status(200).json({ 
      message: 'Backend Prescrimed API',
      status: 'online',
      mode: 'api-only',
      endpoints: {
        health: '/health',
        api: '/api/*',
        diagnostic: '/api/diagnostic/db-check'
      }
    });
  }
  
  /**
   * Para todas as outras rotas (SPA routing), serve index.html
   * Isso permite que React Router gerencie navegação no lado do cliente
   * Exemplo: /dashboard, /prescricoes, etc. são rotas do React Router
   */
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      // Log detalhado de erro para depuração
      console.error('❌ Erro ao servir index.html:', err);
      console.error('❌ Caminho tentado:', path.join(clientDistPath, 'index.html'));
      res.status(404).send('Frontend não encontrado. Execute: npm run build:full');
    }
  });
});

/**
 * Middleware de Tratamento Global de Erros
 * Captura todos os erros não tratados nas rotas
 */
app.use((err, req, res, next) => {
  // Log do erro no console do servidor
  console.error(err.stack);
  
  // Retorna resposta de erro para o cliente
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    // Em desenvolvimento, inclui stack trace para facilitar debug
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

/**
 * Handlers de Erros Não Capturados (em desenvolvimento)
 * Previne que erros não tratados derrubem o servidor durante desenvolvimento
 */
if (process.env.NODE_ENV !== 'production') {
  // Captura exceções síncronas não tratadas
  process.on('uncaughtException', (err) => {
    console.error('🔴 Exceção não capturada:', err);
  });
  
  // Captura Promises rejeitadas sem .catch()
  process.on('unhandledRejection', (reason) => {
    console.error('🔴 Promessa rejeitada sem tratamento:', reason);
  });
}

/**
 * Função para Iniciar Servidor com Fallback de Porta
 * Se a porta desejada estiver em uso, tenta a próxima automaticamente
 * 
 * @param {number} initialPort - Porta inicial a tentar
 * @param {number} maxAttempts - Número máximo de tentativas
 * @returns {Server} Instância do servidor Express
 */
function startServer(initialPort, maxAttempts = 10) {
  PORT = parsePort(initialPort, PORT);
  
  // Tenta iniciar servidor na porta especificada
  const srv = app.listen(PORT, '0.0.0.0', () => {
    // Callback executado quando servidor inicia com sucesso
    console.log(`🚀 Servidor ativo na porta ${srv.address().port}`);
    console.log(`📍 Acesse: http://localhost:${srv.address().port}`);
  });

  // Handler de erros do servidor
  srv.on('error', (error) => {
    // Se porta está em uso e ainda há tentativas disponíveis
    if (error.code === 'EADDRINUSE' && maxAttempts > 0) {
      const nextPort = PORT + 1; // Incrementa porta
      if (nextPort > 65535) {
        console.error('❌ Não há mais portas disponíveis (limite 65535 atingido).');
        return;
      }
      console.warn(`⚠️ Porta ${PORT} em uso. Tentando ${nextPort}...`);
      startServer(nextPort, maxAttempts - 1); // Tenta próxima porta
    } else {
      // Erro diferente ou sem mais tentativas disponíveis
      console.error('❌ Erro no servidor:', error);
    }
  });
  
  return srv; // Retorna instância do servidor
}

console.log(`🚦 Iniciando servidor na porta ${PORT}...`);
// Inicia servidor com a porta configurada
const server = startServer(PORT);
console.log('✅ Servidor Express inicializado!');

// Exporta app para testes e uso externo
export default app;