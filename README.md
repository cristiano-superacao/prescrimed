# Prescrimed – Guia Atualizado

Este documento consolida a configuração, execução e deploy automático no Railway, mantendo o layout responsivo e profissional do frontend.

## Visão Geral
- Backend: Node.js/Express (servidor em `server.js`), Sequelize (PostgreSQL)
- Frontend: React + Vite (build servido pelo backend a partir de `client/dist`)
- Deploy: Railway (Nixpacks) com auto‑deploy via GitHub; GitHub Pages opcional para frontend estático.

## Pré‑requisitos
- Node 18+ e npm 9+
- Conta no Railway e GitHub

## Variáveis de Ambiente (Backend)
Defina no serviço do Railway:
- `NODE_ENV=production`
- `DATABASE_URL` (provisionado pelo serviço PostgreSQL do Railway)
- `JWT_SECRET` (32+ chars)
- `JWT_REFRESH_SECRET` (32+ chars)
- `SESSION_TIMEOUT=8h`
- `FORCE_SYNC=true` (apenas primeiro deploy; mude para `false` depois)
- `FRONTEND_URL=https://cristiano-superacao.github.io/prescrimed`
- `ALLOWED_ORIGINS=https://cristiano-superacao.github.io,https://cristiano-superacao.github.io/prescrimed,https://prescrimed-backend.up.railway.app,https://prescrimed-backend-production.up.railway.app`

Opcional (frontend build em Pages):
- `VITE_BACKEND_ROOT=https://prescrimed-backend.up.railway.app`
- `VITE_API_URL=https://prescrimed-backend.up.railway.app/api`

## Executar Localmente
```bash
npm install
npm run build:full   # instala client e gera dist
npm start            # inicia backend (serve client/dist)
# abrir http://localhost:3000
```

## Deploy Automático no Railway
1. Railway → New Project → Deploy from GitHub → selecione este repositório.
2. Adicione um serviço PostgreSQL.
3. No serviço backend (Settings → Variables), defina as variáveis acima.
4. Configuração de build/start (Railway usa Nixpacks):
   - Root Directory: `/`
   - Build Command: `npm install --production=false && npm run build:full`
   - Start Command: `npm start`
   - Healthcheck Path: `/health`
5. Ative Auto‑deploy on push.
6. Primeiro deploy com `FORCE_SYNC=true` (cria/atualiza tabelas). Depois mude para `FORCE_SYNC=false`.

## Health & Diagnóstico
- `GET /health` → status do servidor
- `GET /api/health` → status (compatível com clientes que esperam sob `/api`)
- `GET /api/diagnostic/db-check` → verificação de tabelas/colunas

## Estrutura Relevante
- `server.js` → servidor Express, CORS, rotas, health, SPA fallback
- `routes/*` → endpoints REST (auth, financeiro, estoque, etc.)
- `models/*` → Sequelize models
- `client/` → app React; build via Vite
- `nixpacks.toml` → fases de build/start para Railway
- `railway.toml` → healthcheck e builder
- `.github/workflows/deploy.yml` → Pages (opcional)
- `scripts/check-health.js` → utilitário para checar saúde do backend

## Comandos Úteis
```bash
# verificar endpoints essenciais do backend
npm run check:health                # usa domínio padrão
node scripts/check-health.js https://SEU_DOMINIO_RAILWAY

# rebuild apenas do client
cd client && npm ci && npm run build
```

## Troubleshooting
- 404 em assets no GitHub Pages: garanta `base: '/prescrimed/'` no `client/vite.config.js`.
- Banner "Backend Offline": confirme `VITE_BACKEND_ROOT`/`VITE_API_URL` ou aguarde publicação.
- Tabelas ausentes: use `FORCE_SYNC=true` no primeiro deploy e depois mude para `false`.

---
Mantendo o layout responsivo e profissional: todas as alterações focam infraestrutura; a UI e componentes permanecem inalterados.
