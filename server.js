import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rotas
import apiRouter from './routes/index.js';
import { seedDatabase } from './utils/seed.js';

// ES Modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
// Railway usa PORT dinamicamente; fallback 3000 local
const PORT = process.env.PORT || 3000;
let dbReady = false;
// JWT padrão em desenvolvimento para evitar 500 (faltando segredo)
if (!process.env.JWT_SECRET && (process.env.NODE_ENV || 'development') === 'development') {
  process.env.JWT_SECRET = 'dev-secret-change-me';
}

// Função para conectar ao MongoDB
async function connectDB() {
  try {
    // Resolver URI do Mongo a partir de múltiplos nomes possíveis (inclui variantes em PT)
    const possibleKeys = [
      'MONGODB_URI',
      'MONGO_URL',
      'MONGODB_URL',
      'DATABASE_URL',
      'URL_MONGO',
      'URL_PUBLICA_MONGO',
      'MONGO_URI',
      'URL_DO_BANCO_DE_DADOS'
    ];
    let mongoUriEnv = null;
    let usedKey = null;
    for (const key of possibleKeys) {
      if (process.env[key]) { mongoUriEnv = process.env[key]; usedKey = key; break; }
    }

    if (mongoUriEnv) {
      await mongoose.connect(mongoUriEnv);
      console.log(`✅ MongoDB conectado com sucesso (via ${usedKey})`);
      dbReady = true;
    } else if ((process.env.NODE_ENV || 'development') !== 'production') {
      // Em desenvolvimento, usar MongoDB Memory Server
      console.log('📦 Iniciando MongoDB Memory Server...');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB Memory Server conectado com sucesso');
      console.log('⚠️  Dados serão perdidos ao reiniciar o servidor');
      dbReady = true;
    } else {
      // Em produção sem URI definida, iniciar app sem DB para liberar healthcheck
      console.warn('⚠️  MONGODB_URI/MONGO_URL não definida em produção. Iniciando sem conexão ao banco.');
      return;
    }

    // Executar seed em background após conexão (não bloqueia healthcheck)
    if (dbReady) {
      seedDatabase().catch(err => console.error('❌ Erro no seed:', err));
    }
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error);
    // Em produção, não derrubar o processo para permitir healthcheck e logs
    if ((process.env.NODE_ENV || 'development') === 'production') {
      console.warn('⚠️  Continuando sem conexão ao banco em produção. Verifique as variáveis de ambiente.');
    } else {
      process.exit(1);
    }
  }
}

// Conectar ao MongoDB em background (não bloqueia início do servidor)
connectDB().catch(err => console.error('❌ Erro fatal na conexão:', err));

// Rota de health check (antes dos middlewares para não bloquear verificação)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: dbReady ? 'connected' : 'unavailable', timestamp: new Date().toISOString() });
});

// Middlewares de segurança e performance
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
// CORS configurado para múltiplas origens
const baseOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://prescrimed.netlify.app',
  'https://precrimed.netlify.app',
  'https://prescrimer.netlify.app',
  // GitHub Pages (usuário/organização)
  'https://cristiano-superacao.github.io',
  process.env.FRONTEND_URL,
  process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null
].filter(Boolean);

// Origens adicionais via env (separadas por vírgula)
const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// Deduplicar e fixar lista final
const allowedOrigins = Array.from(new Set([...baseOrigins, ...extraOrigins]));

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`CORS bloqueado para origem: ${origin}`);
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
// Aplicar CORS apenas nas rotas de API para não interferir no /health
app.use('/api', cors(corsOptions));
app.options('/api/*', cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api', apiRouter);

// Servir arquivos estáticos do frontend (build do Vite)
const clientDistPath = path.join(__dirname, 'client', 'dist');
console.log(`📁 Servindo arquivos estáticos de: ${clientDistPath}`);
app.use(express.static(clientDistPath));

// SPA Fallback: todas as rotas não-API/não-health retornam index.html
app.use((req, res, next) => {
  // Se for rota de API, passar para tratamento de erro 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Rota de API não encontrada' });
  }
  
  // Para todas as outras rotas (SPA routing), servir index.html
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      console.error('❌ Erro ao servir index.html:', err);
      console.error('❌ Caminho tentado:', path.join(clientDistPath, 'index.html'));
      res.status(404).send('Frontend não encontrado. Execute: npm run build:full');
    }
  });
});
// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});
// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    console.log(`🌐 Railway URL: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  }
  console.log(`✅ Health endpoint disponível em: http://localhost:${PORT}/health`);
});

// Tratamento de erros do servidor
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso`);
    process.exit(1);
  } else {
    console.error('❌ Erro no servidor:', error);
    process.exit(1);
  }
});

export default app;