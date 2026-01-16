# 🚀 Prescrimed - Deploy Guide

Sistema completo de prescrições médicas multi-tenant com PostgreSQL.

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Conta Railway/Render (produção)

## 🏗️ Estrutura

```
prescrimed/
├── server.js          # Backend (API + Static)
├── models/            # Sequelize Models
├── routes/            # API Routes
├── client/            # Frontend (React + Vite)
└── WEB/              # Landing Page estática
```

## ⚙️ Configuração Local

### 1. Backend

```bash
# Instalar dependências
npm install

# Criar .env
cp .env.example .env
# Editar .env com suas credenciais PostgreSQL locais

# Iniciar servidor
npm run server
```

### 2. Frontend

```bash
cd client
npm install

# Criar .env.development
cp .env.example .env.development
# Verificar VITE_API_URL=http://localhost:3000/api

# Iniciar dev server
npm run dev
```

### 3. Ambos juntos

```bash
npm run dev:full
```

## 🌐 Deploy Railway (Recomendado)

### Backend

1. Criar novo projeto no Railway
2. Adicionar PostgreSQL database
3. Conectar repositório GitHub
4. Configurar variáveis:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<gerar-segredo-forte>
JWT_REFRESH_SECRET=<gerar-segredo-forte>
SESSION_TIMEOUT=8h
FORCE_SYNC=true  # Apenas primeira vez para criar tabelas
FRONTEND_URL=https://seu-frontend.netlify.app
ALLOWED_ORIGINS=https://seu-frontend.netlify.app
```

5. DATABASE_URL é fornecida automaticamente
6. Deploy automático via git push

### Frontend

**Opção A: Netlify**
1. Conectar repositório
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Base directory: `client`
5. Variáveis de ambiente:

```env
VITE_API_URL=https://seu-backend.up.railway.app/api
```

**Opção B: Railway**
1. Criar novo serviço separado
2. Build command: `cd client && npm install && npm run build`
3. Start command: `cd client && npm run start:railway`
4. PORT: 3000 (ou variável)

## 🗄️ Banco de Dados

### Tabelas criadas automaticamente

O Sequelize cria as seguintes tabelas:

- **empresas**: Multi-tenant (nome, cnpj, ativo)
- **usuarios**: Usuários do sistema (nome, email, senha, role, empresaId)
- **pacientes**: Pacientes vinculados a empresas
- **prescricoes**: Prescrições médicas vinculadas a pacientes

### Roles disponíveis

- `superadmin`: Acesso total ao sistema
- `admin`: Gerencia empresa específica
- `nutricionista`: Cria prescrições
- `atendente`: Visualiza prescrições

### Primeiro acesso

Criar superadmin via script ou manualmente no banco:

```sql
INSERT INTO usuarios (id, nome, email, senha, role, ativo, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Admin',
  'admin@prescrimed.com',
  '<hash-bcrypt>',
  'superadmin',
  true,
  NOW(),
  NOW()
);
```

## 🔒 Segurança

- JWT com expiração configurável
- CORS restrito por origem
- Helmet para headers de segurança
- Senhas com bcrypt
- Validação de entrada em todas as rotas

## 📊 Monitoramento

- Health check: `/health`
- Logs estruturados (Morgan)
- Métrics endpoint: `/api/diagnostic/db-check`

## 🛠️ Comandos Úteis

```bash
# Build frontend
npm run build

# Build completo (backend + frontend)
npm run build:full

# Executar em produção
npm start

# Desenvolvimento com hot reload
npm run dev:full
```

## 🌍 Acessos

- Frontend dev: http://localhost:5173
- Backend API: http://localhost:3000/api
- Landing WEB: http://localhost:3000/web
- Health check: http://localhost:3000/health

## 📝 Variáveis de Ambiente

### Backend (.env)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| NODE_ENV | Ambiente | production/development |
| PORT | Porta do servidor | 3000 |
| DATABASE_URL | PostgreSQL URL | postgresql://user:pass@host/db |
| JWT_SECRET | Segredo JWT | string aleatória 32+ chars |
| JWT_REFRESH_SECRET | Refresh token | string aleatória 32+ chars |
| SESSION_TIMEOUT | Tempo de sessão | 8h |
| FRONTEND_URL | URL do frontend | https://app.exemplo.com |
| ALLOWED_ORIGINS | CORS origins | url1,url2,url3 |
| FORCE_SYNC | Sync tabelas | true (só primeira vez) |

### Frontend (client/.env.production)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| VITE_API_URL | URL da API | https://api.exemplo.com/api |

## 🐛 Troubleshooting

### Erro: Porta já em uso

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# PowerShell
$conn = Get-NetTCPConnection -LocalPort 3000; Stop-Process -Id $conn.OwningProcess -Force
```

### Erro: Tabelas não criadas

1. Verificar DATABASE_URL
2. Definir FORCE_SYNC=true temporariamente
3. Reiniciar aplicação
4. Remover FORCE_SYNC=true após criação

### Erro CORS

1. Verificar FRONTEND_URL no backend
2. Adicionar origem em ALLOWED_ORIGINS
3. Validar protocolo (http vs https)

## 📦 Dependências Principais

### Backend
- express: Servidor HTTP
- sequelize: ORM PostgreSQL
- bcryptjs: Hash de senhas
- jsonwebtoken: Autenticação
- cors, helmet, compression: Segurança/Performance

### Frontend
- react, react-router-dom: UI
- axios: HTTP client
- zustand: State management
- tailwindcss: Styling
- vite: Build tool

## 📄 Licença

MIT - Sistema Prescrimed

---

**Desenvolvido com ❤️ para profissionais de saúde**
