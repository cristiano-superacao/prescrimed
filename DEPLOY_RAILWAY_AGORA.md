# Deploy no Railway (Backend servindo o Frontend)

Este guia realiza o deploy completo no Railway usando Nixpacks. O backend Express serve a API e o build do frontend (Vite) pelo mesmo domínio.

## Pré-requisitos
- Node.js 18+
- Railway CLI instalado: https://docs.railway.app/guides/cli
- Conta logada no Railway: `railway login`

## 1) Preparar localmente (opcional, para validar)
```bash
npm ci
cd client && npm ci && npm run build && cd ..
npm start   # http://localhost:3000 (ou porta seguinte)
```

## 2) Iniciar projeto no Railway
```bash
railway login
# dentro da pasta do projeto
railway init --environment production
```

Se você já tem um projeto, use:
```bash
railway link   # escolha o projeto já existente
```

## 3) Banco de Dados (PostgreSQL)
Adicione o plugin de PostgreSQL ao projeto (via Dashboard ou CLI):
```bash
railway add --plugin postgresql
```
Isso criará a variável `DATABASE_URL` automaticamente.

## 4) Variáveis de Ambiente
Defina as variáveis mínimas no serviço Backend:
```bash
railway variables set JWT_SECRET="<gerado_com_openssl>"
railway variables set JWT_REFRESH_SECRET="<gerado_com_openssl>"
# opcional
railway variables set FRONTEND_URL="https://<seu-dominio-ou-netlify>"
```

Dica: No primeiro deploy, você pode criar as tabelas com sync automático:
```bash
railway variables set FORCE_SYNC=true
```
Depois do primeiro deploy, remova esta variável para evitar alterações indesejadas:
```bash
railway variables unset FORCE_SYNC
```

## 5) Deploy
Você pode usar diretamente o `railway up` (Nixpacks detectará Node e usará `nixpacks.toml`):
```bash
railway up
```
- Build: instala deps do backend e do `client/` e executa `client build`.
- Start: roda `npm start` (server.js) e serve `client/dist` automaticamente.

## 6) Verificação
Após o deploy, acesse:
- Healthcheck: `https://<seu-subdominio>.up.railway.app/health`
- App (SPA): `https://<seu-subdominio>.up.railway.app/`
- API base: `https://<seu-subdominio>.up.railway.app/api`

O CORS já contempla `RAILWAY_PUBLIC_DOMAIN` automaticamente. O frontend (build do Vite) usa caminho relativo `/api` em produção caso `VITE_API_URL` não esteja setada, portanto funciona no mesmo domínio sem configuração extra.

## Notas
- Em caso de porta em uso, o servidor aplica fallback automático (3000 → 3001 → ...).
- O `.railwayignore` garante que apenas artefatos necessários sejam enviados (inclui `client/dist`).
- Logs em tempo real: `railway logs`
- Redeploy: `railway up`
