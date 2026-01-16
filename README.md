# Sistema Prescrimed - Modo Standalone

## 🎯 Visão Geral

Sistema simplificado **sem banco de dados**, ideal para demonstrações e desenvolvimento de frontend.

## 🚀 Como Usar

### 1. Instalação

```bash
npm install
cd client && npm install && cd ..
```

### 2. Build do Frontend

```bash
npm run build:full
```

### 3. Iniciar o Servidor

```bash
npm start
```

O sistema estará disponível em: `http://localhost:3000`

## 📡 Endpoints Disponíveis

- **Health Check**: `GET /health` - Status do servidor
- **API Test**: `GET /api/test` - Teste básico da API
- **API Info**: `GET /api/info` - Informações sobre a API

## 🔧 Desenvolvimento

### Modo Desenvolvimento (Hot Reload)

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

Frontend dev: `http://localhost:5173`

### Resetar Configurações Locais

```bash
npm run reset:local
```

## 📦 Scripts Disponíveis

- `npm start` - Inicia o servidor (produção)
- `npm run dev` - Inicia o servidor (desenvolvimento)
- `npm run client` - Inicia o frontend (dev)
- `npm run build` - Build do frontend
- `npm run build:full` - Build completo (instala deps + build)
- `npm run dev:full` - Backend + Frontend simultâneos
- `npm run reset:local` - Reseta .env e build

## 🎨 Layout Responsivo

O frontend mantém o **design Premium com TailwindCSS**:

- ✅ Responsivo (mobile, tablet, desktop)
- ✅ Interface moderna e profissional
- ✅ Componentes React otimizados
- ✅ Dark mode (se implementado)

## 🌐 Deploy

### Netlify / Vercel (Frontend + Backend)

1. Build: `npm run build:full`
2. Deploy pasta `client/dist` (frontend)
3. Deploy raiz do projeto (backend)

### Render (Backend)

1. Conectar repositório
2. Build Command: `npm run build:full`
3. Start Command: `npm start`

### GitHub Pages (Apenas Frontend)

Veja [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)

## 📝 Notas

- Sistema **não persiste dados** (sem banco de dados)
- Ideal para **protótipos** e **demonstrações**
- Layout e UI **totalmente funcionais**
- Para adicionar persistência, considere:
  - SQLite local
  - JSON file storage
  - LocalStorage (frontend)
  - Integração com APIs externas

## 🔐 Variáveis de Ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Variáveis principais:

- `NODE_ENV` - Ambiente (development/production)
- `PORT` - Porta do servidor (padrão: 3000)
- `JWT_SECRET` - Secret para JWT
- `FRONTEND_URL` - URL do frontend

## 📞 Suporte

Para adicionar funcionalidades ou integrar banco de dados, consulte a documentação do projeto original.
