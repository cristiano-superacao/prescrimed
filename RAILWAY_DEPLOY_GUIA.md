# 🚀 Deploy no Railway — Prescrimed

## 📋 Visão Geral

Guia passo a passo para publicar a API no Railway e configurar o frontend (GitHub Pages ou Netlify) mantendo layout responsivo e profissional.

## 🎯 O que já está pronto

### Backend (Railway)
- ✅ `railway.json` com build/start e healthcheck em `/health`
- ✅ CORS aplicado apenas em `/api` com origens permitidas
- ✅ `server.js` com fallback JWT em dev e health check independente do DB
- ✅ Conexão Mongo por `MONGODB_URI` (Atlas ou Railway plugin)

### Frontend (Client)
- ✅ Vite com base dinâmica para GitHub Pages (`VITE_BASE`)
- ✅ Banner de status do backend apenas quando configurado (`VITE_BACKEND_ROOT`)
- ✅ HeroBackground com `client/public/pattern.svg` e imagem opcional via `VITE_BG_IMAGE_URL`

## 📦 Pré-requisitos

1. Conta no Railway — https://railway.app
2. Conta no GitHub (Pages) ou Netlify (opcional)
3. MongoDB (Atlas ou plugin do Railway)
4. Git instalado

## 🚀 Passo 1: Preparar MongoDB

### Opção 1: MongoDB Atlas (Recomendado)

1. Acesse https://mongodb.com/cloud/atlas
2. Crie uma conta gratuita
3. Crie um cluster (tier gratuito disponível)
4. Crie um database user:
   - Username: `prescrimed`
   - Password: (gere uma senha segura)
5. Configure Network Access:
   - Adicione `0.0.0.0/0` (permite de qualquer IP)
6. Copie a Connection String:
   ```
   mongodb+srv://prescrimed:<password>@cluster.mongodb.net/prescrimed?retryWrites=true&w=majority
   ```

### Opção 2: MongoDB Railway Plugin

1. No Railway, adicione o plugin MongoDB ao projeto
2. Use a referência interna do serviço (`${{MongoDB.URL_MONGO}}`) como `MONGODB_URI`

## 🚂 Passo 2: Deploy no Railway

### 2.1. Criar Projeto no Railway

1. Acesse https://railway.app
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Autorize o Railway a acessar seus repositórios
6. Selecione o repositório `prescrimed-main`

### 2.2. Configurar Variáveis de Ambiente (API)

No serviço da API, em **Variables**, adicione:

```bash
# MongoDB Atlas (exemplo)
MONGODB_URI=mongodb+srv://prescrimed:SUA_SENHA@cluster.mongodb.net/prescrimed?retryWrites=true&w=majority

# OU MongoDB Railway (plugin)
MONGODB_URI=${{MongoDB.URL_MONGO}}

# JWT Secret (gere um segredo forte)
JWT_SECRET=chave_segura_base64_32_chars

# Ambiente
NODE_ENV=production

# CORS (origem do frontend)
FRONTEND_URL=https://seu-frontend.exemplo
```

Observações:
- `/health` responde `status: ok` mesmo sem DB; o campo `db` indica `connected` ou `unavailable`.
- O CORS é aplicado apenas em `/api` e não interfere no healthcheck.

### 2.3. Gerar JWT Secret Seguro

Execute no terminal (Git Bash ou PowerShell):

```bash
# Git Bash (Linux/Mac/Windows)
openssl rand -base64 32

# OU PowerShell (Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copie o resultado e use como `JWT_SECRET`.

### 2.4. Deploy Automático

1. Railway detectará `railway.json` automaticamente
2. O build iniciará e o serviço será publicado
3. Ao finalizar, veja a URL pública (Domains)

### 2.5. Verificar Deploy

1. Acesse: `https://seu-app.up.railway.app/health`
2. Deve retornar:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-01-14T..."
   }
   ```

## 🌐 Passo 3: Configurar Frontend (GitHub Pages ou Netlify)

### 3.1. GitHub Pages

No repositório GitHub, em `Settings → Secrets and variables → Actions`:

```
VITE_API_URL=https://seu-backend.up.railway.app/api
VITE_BACKEND_ROOT=https://seu-backend.up.railway.app
```

O workflow em `.github/workflows/deploy-pages.yml` usa esses segredos para buildar e publicar o `client/dist` no Pages.

### 3.2. Netlify (opcional)

Em Environment Variables do site:

```
VITE_API_URL=https://seu-backend.up.railway.app/api
VITE_BACKEND_ROOT=https://seu-backend.up.railway.app
# VITE_BG_IMAGE_URL=https://sua-imagem/hero.jpg   # opcional
```

## ✅ Passo 4: Testar Sistema

### 4.1. Verificar API

```bash
# Health check
curl https://seu-backend.up.railway.app/health

# Teste de login (após seed)
curl -X POST https://seu-backend.up.railway.app/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"email":"admin.casa@prescrimed.com","senha":"PrescriMed!2024"}'
```

### 4.2. Testar Frontend

1. Acesse seu site Netlify
2. Faça login com:
   - Email: `admin@sistema.com`
   - Senha: `Admin@123`
3. Verifique se o dashboard carrega
4. Teste criar um paciente
5. Teste criar uma prescrição

## 🎨 Layout Responsivo

O sistema mantém layout profissional e responsivo em:

### Desktop (>1024px)
- ✅ Sidebar fixa à esquerda
- ✅ Header com busca completa
- ✅ Cards em grid
- ✅ Modais centralizados

### Tablet (768px-1024px)
- ✅ Sidebar colapsável
- ✅ Grid responsivo (2 colunas)
- ✅ Busca reduzida

### Mobile (<768px)
- ✅ Sidebar em overlay
- ✅ Header compacto
- ✅ Cards em coluna única
- ✅ Botões touch-friendly

## 🔧 Comandos Úteis Railway

### Via Railway CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Ver logs
railway logs

# Abrir dashboard
railway open

# Ver variáveis
railway variables

# Redeploy
railway up
```

### Ver Logs no Dashboard

1. Acesse Railway Dashboard
2. Selecione seu projeto
3. Clique em **Deployments**
4. Veja logs em tempo real

## 🐛 Troubleshooting

### Erro: "Cannot connect to MongoDB"

**Solução:**
1. Verifique se `MONGODB_URI` está configurada
2. Confirme que a senha não tem caracteres especiais não escapados
3. Teste a connection string localmente primeiro

### Erro: "CORS policy"

**Solução:**
1. Adicione `FRONTEND_URL` no Railway
2. Verifique se a URL do Netlify está correta
3. Não use barra (/) no final da URL

### Erro: "Health check failed"

**Solução:**
1. Verifique logs no Railway Dashboard
2. Confirme que PORT não está hard-coded
3. Verifique se `railway.json` tem `healthcheckPath`

### Frontend não conecta ao Backend

**Solução:**
1. Limpe cache do Netlify
2. Verifique `VITE_API_URL` no Netlify
3. Confirme que Railway está online
4. Teste manualmente: `curl https://seu-app.up.railway.app/health`

## 📊 Monitoramento

### Railway Dashboard

- **Metrics**: CPU, Memory, Network
- **Logs**: Real-time logs
- **Deployments**: Histórico de deploys
- **Settings**: Configurações e variáveis

### Endpoints de Monitoramento

```bash
# Health check
GET https://seu-app.up.railway.app/health

# Status do MongoDB (requer autenticação)
GET https://seu-app.up.railway.app/api/dashboard/stats
```

## 💰 Custos

### Railway Free Tier
- $5 de crédito gratuito por mês
- Suficiente para ~500 horas de uso
- Sem cartão de crédito necessário

### Plano Hobby ($5/mês)
- $5 + uso variável
- Para produção leve
- Recomendado após testes

### MongoDB Atlas Free Tier
- 512MB de armazenamento
- Sem custos
- Suficiente para começar

## 🔄 CI/CD Automático

### Deploy Automático

Railway faz deploy automático quando:
1. Você faz push para a branch principal
2. Detecta mudanças no repositório GitHub
3. Webhook é acionado

### Configurar Branch

1. Railway Dashboard > Settings
2. Configure a branch (padrão: `main`)
3. Cada push fará novo deploy

## 📱 Domínio Personalizado

### No Railway

1. Railway Dashboard > Settings
2. **Domains** > **Add Domain**
3. Digite seu domínio: `api.prescrimed.com`
4. Configure DNS:
   ```
   CNAME api seu-app.up.railway.app
   ```

### No Netlify

1. Netlify Dashboard > Domain settings
2. **Add custom domain**
3. Configure DNS conforme instruções

## 🔒 Segurança

### Checklist de Segurança

- ✅ JWT_SECRET forte e único
- ✅ MongoDB com autenticação
- ✅ CORS configurado corretamente
- ✅ HTTPS em produção (automático)
- ✅ Variáveis sensíveis em .env
- ✅ Rate limiting (considerar adicionar)
- ✅ Helmet.js ativado

### Recomendações

1. **Nunca commite** arquivos `.env`
2. **Rotacione** JWT_SECRET periodicamente
3. **Use** senha forte no MongoDB
4. **Ative** 2FA no Railway e GitHub
5. **Monitore** logs regularmente

## 📚 Recursos Adicionais

- [Railway Docs](https://docs.railway.app)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Netlify Docs](https://docs.netlify.com)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## 🆘 Suporte

### Problemas Comuns

1. **Build falha**: Verifique `package.json` e dependências
2. **Runtime error**: Veja logs no Railway Dashboard
3. **Conexão MongoDB**: Teste connection string localmente
4. **CORS error**: Adicione frontend URL no Railway

### Contato

- GitHub Issues: [Criar Issue]
- Documentação: `/docs`

---
## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] Backend no Railway online e `/health` respondendo
- [ ] `MONGODB_URI` configurado e `db: connected`
- [ ] `JWT_SECRET` forte e único
- [ ] Frontend (Pages/Netlify) com `VITE_API_URL` e `VITE_BACKEND_ROOT`
- [ ] Executado `npm run seed:cloud` (3 empresas + 5 pacientes)
- [ ] Login admins criado pelo seed funcionando
- [ ] Layout responsivo validado (desktop/tablet/mobile)
- [ ] CORS corretos e logs sem erros críticos

## 🎉 Pronto!

Sistema Prescrimed publicado com layout profissional e responsivo.

**URLs de Acesso (exemplos):**
- Frontend (Pages): `https://cristiano-superacao.github.io/prescrimed`
- Backend (Railway): `https://seu-backend.up.railway.app`
- API: `https://seu-backend.up.railway.app/api`
- Health: `https://seu-backend.up.railway.app/health`

**Credenciais (seed):**
- Casa: `admin.casa@prescrimed.com` / `PrescriMed!2024`
- Petshop: `admin.pet@prescrimed.com` / `PrescriMed!2024`
- Fisio: `admin.fisio@prescrimed.com` / `PrescriMed!2024`

⚠️ Importante: altere as senhas padrão após o primeiro acesso.
