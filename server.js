import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Importar rotas
import authRoutes from './routes/auth.routes.js';
import empresaRoutes from './routes/empresa.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import prescricaoRoutes from './routes/prescricao.routes.js';
import pacienteRoutes from './routes/paciente.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import agendamentoRoutes from './routes/agendamento.routes.js';
import estoqueRoutes from './routes/estoque.routes.js';
import financeiroRoutes from './routes/financeiro.routes.js';
import { seedDatabase } from './utils/seed.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// JWT padrão em desenvolvimento para evitar 500 (faltando segredo)
if (!process.env.JWT_SECRET && (process.env.NODE_ENV || 'development') === 'development') {
  process.env.JWT_SECRET = 'dev-secret-change-me';
}

// Função para conectar ao MongoDB
async function connectDB() {
  try {
    // Permitir múltiplos nomes de variável de ambiente (Railway/Atlas)
    const mongoUriEnv =
      process.env.MONGODB_URI ||
      process.env.MONGO_URL ||
      process.env.MONGODB_URL ||
      process.env.DATABASE_URL;

    if (mongoUriEnv) {
      await mongoose.connect(mongoUriEnv);
      console.log('✅ MongoDB conectado com sucesso');
    } else if ((process.env.NODE_ENV || 'development') !== 'production') {
      // Em desenvolvimento, usar MongoDB Memory Server
      console.log('📦 Iniciando MongoDB Memory Server...');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB Memory Server conectado com sucesso');
      console.log('⚠️  Dados serão perdidos ao reiniciar o servidor');
    } else {
      // Em produção sem URI definida, iniciar app sem DB para liberar healthcheck
      console.warn('⚠️  MONGODB_URI/MONGO_URL não definida em produção. Iniciando sem conexão ao banco.');
      return;
    }

    // Executar seed após conexão
    await seedDatabase();
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

// Conectar ao MongoDB antes de iniciar o servidor
connectDB();

// Rota de health check (antes dos middlewares para não bloquear verificação)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middlewares de segurança e performance
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
// CORS configurado para múltiplas origens
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://prescrimed.netlify.app',
  'https://precrimed.netlify.app',
  'https://prescrimer.netlify.app',
  process.env.FRONTEND_URL,
  process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
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
// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/prescricoes', prescricaoRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/financeiro', financeiroRoutes);
// Tratamento de erro 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    console.log(`🌐 Railway URL: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  }
});
export default app;