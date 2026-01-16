# 🚂 Railway Deploy - Correções Aplicadas

## ❌ Problemas Identificados

1. **Erro:** "Não foi possível encontrar o diretório raiz: /client"
2. **Erro:** "A compilação do Nixpacks falhou - Lendo o arquivo Procfile"
3. **Erro:** "Não são permitidos valores de mapeamento neste contexto"

## ✅ Soluções Aplicadas

### 1. Arquivos de Configuração Criados

#### `railway.json` (Raiz do projeto)
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install --production=false && cd client && npm install && npm run build && cd .."
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### `nixpacks.toml` (Build configuration)
```toml
[phases.setup]
nixPkgs = ["nodejs_18"]

[phases.install]
cmds = [
  "npm ci --production=false",
  "cd client && npm ci",
  "cd client && npm run build"
]

[start]
cmd = "npm start"
```

#### `.railwayignore` (Otimização)
```
node_modules/
.git/
docs/
scripts/
WEB/
*.md
!README.md
client/src/
client/public/
client/node_modules/
```

### 2. Scripts Atualizados

**package.json:**
```json
{
  "start": "node server.js",
  "railway:build": "npm install --production=false && cd client && npm install && npm run build",
  "railway:start": "node server.js"
}
```

## 🚀 Deploy no Railway - Passo a Passo

### Opção A: Deploy Único (Backend + Frontend)

1. **Criar Novo Projeto**
   - Acesse: https://railway.app
   - New Project → Deploy from GitHub
   - Selecione: `cristiano-superacao/prescrimed`

2. **Adicionar PostgreSQL**
   - Add Service → Database → PostgreSQL
   - Aguardar provisionamento

3. **Configurar Variáveis de Ambiente**
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=<gerar-32-caracteres-aleatorios>
   JWT_REFRESH_SECRET=<gerar-32-caracteres-aleatorios>
   SESSION_TIMEOUT=8h
   FRONTEND_URL=https://prescrimed-production.up.railway.app
   ALLOWED_ORIGINS=https://prescrimed-production.up.railway.app
   FORCE_SYNC=true
   ```

4. **Configurar Build/Deploy**
   - Settings → Build
   - Builder: Nixpacks (padrão)
   - Build Command: `npm run railway:build` (ou deixe em branco)
   - Start Command: `npm start` (ou deixe em branco)

5. **Deploy**
   - Salvar configurações
   - Deploy automático será iniciado

6. **Pós-Deploy**
   - Verificar logs: Deployments → View Logs
   - Testar: `https://seu-projeto.up.railway.app/health`
   - Acessar: `https://seu-projeto.up.railway.app`
   - **IMPORTANTE:** Após primeira criação das tabelas, remover `FORCE_SYNC=true`

### Opção B: Deploy Separado (Recomendado para produção)

#### Backend Service

1. **Criar Backend Service**
   - New Project → Deploy from GitHub
   - Selecione: `cristiano-superacao/prescrimed`
   - Name: `prescrimed-backend`

2. **Adicionar PostgreSQL**
   - Add Service → Database → PostgreSQL

3. **Variáveis de Ambiente Backend**
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=<gerar-secreto>
   JWT_REFRESH_SECRET=<gerar-secreto>
   SESSION_TIMEOUT=8h
   FRONTEND_URL=https://prescrimed-frontend.up.railway.app
   ALLOWED_ORIGINS=https://prescrimed-frontend.up.railway.app,https://prescrimed.netlify.app
   FORCE_SYNC=true
   ```

#### Frontend Service (Netlify ou Railway)

**Netlify:**
1. Conectar repositório
2. Build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
3. Environment variables:
   ```
   VITE_API_URL=https://prescrimed-backend.up.railway.app/api
   ```

**Railway Frontend Separado:**
1. New Service → GitHub Repo
2. Root Directory: `client`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run preview -- --host 0.0.0.0 --port $PORT`
5. Environment:
   ```
   VITE_API_URL=https://prescrimed-backend.up.railway.app/api
   ```

## 🔧 Troubleshooting

### Erro: "railway.json not found"
- Certifique-se que o arquivo está na raiz do projeto
- Push novamente: `git add railway.json && git commit -m "add railway config" && git push`

### Erro: "Module not found"
- Build command deve instalar dependências: `npm install --production=false`
- Verificar que `client/package.json` existe

### Erro: "Cannot find module './client/dist'"
- Build do frontend falhou
- Verificar logs de build
- Testar localmente: `npm run build:full`

### Erro: "Port already in use"
- Railway define PORT automaticamente via variável de ambiente
- Código usa: `process.env.PORT || 3000`

### Erro CORS
- Adicionar domínio Railway em `ALLOWED_ORIGINS`
- Formato: `https://prescrimed-production.up.railway.app`

## 📊 Verificações Pós-Deploy

```bash
# Health check
curl https://seu-projeto.up.railway.app/health

# API test
curl https://seu-projeto.up.railway.app/api/test

# Database check
curl https://seu-projeto.up.railway.app/api/diagnostic/db-check
```

## 🌐 URLs Finais

- **Backend API:** https://prescrimed-backend.up.railway.app/api
- **Frontend:** https://prescrimed-backend.up.railway.app (se monolítico)
- **Health:** https://prescrimed-backend.up.railway.app/health
- **Landing WEB:** https://prescrimed-backend.up.railway.app/web
- **PostgreSQL:** Conectado automaticamente via DATABASE_URL

## 💡 Dicas

1. **Logs em tempo real:**
   - Railway Dashboard → Deployments → View Logs

2. **Redeploy:**
   - Push para GitHub = deploy automático
   - Ou: Dashboard → Redeploy

3. **Custom Domain:**
   - Settings → Networking → Custom Domain
   - Adicionar CNAME no DNS

4. **Rollback:**
   - Deployments → Histórico → Redeploy versão anterior

5. **Variáveis sensíveis:**
   - Nunca commitar .env
   - Sempre usar Railway Variables

## ✅ Checklist Final

- [ ] railway.json na raiz
- [ ] nixpacks.toml na raiz
- [ ] .railwayignore na raiz
- [ ] PostgreSQL adicionado
- [ ] Variáveis de ambiente configuradas
- [ ] JWT_SECRET gerado (32+ chars)
- [ ] FRONTEND_URL correto
- [ ] FORCE_SYNC=true (primeira vez)
- [ ] Build completo com sucesso
- [ ] /health retorna 200
- [ ] /api/test retorna JSON
- [ ] Frontend carrega
- [ ] Login funciona
- [ ] FORCE_SYNC removido após criação das tabelas

---

**Deploy corrigido e pronto! 🚀**
