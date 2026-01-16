import express from 'express';
console.log('🎬 Iniciando servidor Prescrimed...');
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rotas e banco de dados
import apiRouter from './routes/index.js';
import { sequelize } from './models/index.js';

// ES Modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const PORT = parseInt(process.env.PORT || '3000', 10);
let dbReady = false;

// Defaults seguros para ambiente de desenvolvimento (evita 500 por JWT/variáveis ausentes)
if (process.env.NODE_ENV !== 'production') {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me';
  process.env.SESSION_TIMEOUT = process.env.SESSION_TIMEOUT || '8h';
}

// Conectar ao PostgreSQL em background
async function connectDB() {
  try {
    console.log('📡 Conectando ao PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ PostgreSQL conectado com sucesso');
    
    // Sincronizar modelos (criar tabelas se não existirem)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ Tabelas sincronizadas (modo desenvolvimento)');
    } else {
      await sequelize.sync();
      console.log('✅ Modelos sincronizados');
    }
    
    dbReady = true;
  } catch (error) {
    console.error('❌ Erro ao conectar no banco de dados:', error.message);
    dbReady = false;
  }
}

connectDB();

const app = express();

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Ativo na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
});

// Rota de health check (antes de qualquer middleware pesado)
app.get('/health', cors(), (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    uptime: process.uptime(),
    database: dbReady ? 'connected' : 'connecting',
    timestamp: new Date().toISOString()
  });
});

// Middlewares de segurança e performance
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(compression());
app.use(morgan('dev'));
// CORS configurado para múltiplas origens
const baseOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://prescrimed.netlify.app',
  'https://precrimed.netlify.app',
  'https://prescrimer.netlify.app',
  // GitHub Pages
  'https://cristiano-superacao.github.io',
  'https://cristiano-superacao.github.io/prescrimed',
  // Railway backend
  'https://prescrimed-backend-production.up.railway.app',
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