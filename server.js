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

// Função para conectar ao MongoDB
async function connectDB() {
  try {
    // Tentar MongoDB local primeiro
    if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb://localhost:27017/prescrimed') {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB conectado com sucesso');
    } else {
      // Usar MongoDB Memory Server se MongoDB local não estiver disponível
      console.log('📦 Iniciando MongoDB Memory Server...');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB Memory Server conectado com sucesso');
      console.log('⚠️  Dados serão perdidos ao reiniciar o servidor');
    }
    
    // Executar seed após conexão
    await seedDatabase();
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error);
    process.exit(1);
  }
}

// Conectar ao MongoDB antes de iniciar o servidor
connectDB();

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
  process.env.FRONTEND_URL,
  process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null
].filter(Boolean);

app.use(cors({
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
}));
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
// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
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