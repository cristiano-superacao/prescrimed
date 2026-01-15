# 🚀 Guia de Deploy - Netlify + Railway

## ⚡ Deploy Rápido (5 minutos)

### Pré-requisitos
- ✅ Conta no GitHub
- ✅ Conta no Netlify (gratuita)
- ✅ Conta no Railway (gratuita)
- ✅ Repositório Git do projeto

---

## 📦 Parte 1: Deploy do Backend (Railway)

### 1️⃣ Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em **"New Project"**
3. Escolha **"Deploy from GitHub repo"**
4. Selecione o repositório `prescrimed`
5. Railway detectará automaticamente Node.js

### 2️⃣ Configurar Variáveis de Ambiente

No painel do Railway, vá em **Variables** e adicione:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=prescrimed-jwt-secret-change-this-in-production-xyz123
JWT_REFRESH_SECRET=prescrimed-refresh-secret-change-this-too-abc456
FRONTEND_URL=https://prescrimed.netlify.app
SESSION_TIMEOUT=24h
```

### 3️⃣ Adicionar MongoDB Atlas (Recomendado)

**Opção A: MongoDB Atlas (Recomendado - Dados Persistentes)**

1. Acesse [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta gratuita
3. Crie um cluster (M0 - Free Tier)
4. Em **Database Access**, crie um usuário:
   - Username: `prescrimed`
   - Password: (gere uma senha forte)
   - Role: `Atlas Admin`
5. Em **Network Access**, adicione: `0.0.0.0/0` (permite todas as IPs)
6. Clique em **Connect** → **Connect your application**
7. Copie a connection string:
   ```
   mongodb+srv://prescrimed:<password>@cluster0.xxxxx.mongodb.net/prescrimed?retryWrites=true&w=majority
   ```
8. No Railway, adicione a variável:
   ```env
   MONGODB_URI=mongodb+srv://prescrimed:SUA_SENHA@cluster0.xxxxx.mongodb.net/prescrimed?retryWrites=true&w=majority
   ```

**Opção B: MongoDB Memory Server (NÃO recomendado para produção)**

```env
# Deixe MONGODB_URI vazio ou não configure
# O sistema usará Memory Server automaticamente
# ⚠️ DADOS SERÃO PERDIDOS A CADA RESTART
```

### 4️⃣ Deploy Automático

1. Railway iniciará o deploy automaticamente
2. Aguarde a build completar (~2-3 minutos)
3. Copie a URL gerada (ex: `https://prescrimed-production.up.railway.app`)

### 5️⃣ Testar o Backend

Acesse no navegador:
```
https://SEU-PROJETO.up.railway.app/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"2025-12-12T..."}
```

---

## 🎨 Parte 2: Deploy do Frontend (Netlify)

### 1️⃣ Preparar o Projeto

1. Abra `client/netlify.toml`
2. Atualize a URL do backend:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://SEU-PROJETO.up.railway.app/api/:splat"
  status = 200
  force = true
```

3. Faça commit e push:
```bash
git add client/netlify.toml
git commit -m "Update backend URL"
git push
```

### 2️⃣ Deploy no Netlify

**Opção A: Via Interface Web**

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Conecte ao GitHub e selecione o repositório
4. Configure:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`
5. Clique em **"Deploy site"**

**Opção B: Via Netlify CLI**

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Fazer login
netlify login

# Deploy
cd client
netlify deploy --prod
```

### 3️⃣ Configurar Domínio Personalizado (Opcional)

1. No painel do Netlify, vá em **"Domain settings"**
2. Clique em **"Add custom domain"**
3. Digite seu domínio (ex: `prescrimed.com`)
4. Configure os DNS do seu domínio para apontar para o Netlify:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: SEU-SITE.netlify.app
   ```

### 4️⃣ Habilitar HTTPS (Automático)

O Netlify configura HTTPS automaticamente com Let's Encrypt.

Aguarde alguns minutos e acesse:
```
https://seu-site.netlify.app
```

---

## 🔄 Parte 3: Sincronizar Frontend e Backend

### 1️⃣ Atualizar CORS no Backend

Se você mudou a URL do frontend no Netlify, atualize no Railway:

```env
FRONTEND_URL=https://seu-novo-dominio.netlify.app
```

### 2️⃣ Atualizar Proxy no Frontend

Se você mudou a URL do backend, atualize em `client/netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://sua-nova-url.up.railway.app/api/:splat"
```

---

## ✅ Verificação Final

### Backend Railway ✅
- [ ] Deploy concluído sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] MongoDB conectado
- [ ] Health check respondendo
- [ ] CORS configurado

### Frontend Netlify ✅
- [ ] Build concluído sem erros
- [ ] Proxy configurado
- [ ] Site acessível
- [ ] HTTPS habilitado
- [ ] Redirecionamentos funcionando

### Integração ✅
- [ ] Login funcionando
- [ ] Dashboard carregando dados
- [ ] API respondendo (F12 → Network)
- [ ] Sem erros 404/CORS no console

---

## 🧪 Testar o Sistema

1. **Acesse o frontend:**
   ```
   https://seu-site.netlify.app
   ```

2. **Faça login com super admin:**
   ```
   Email: superadmin@prescrimed.com
   Senha: super123
   ```

3. **Teste as funcionalidades:**
   - ✅ Dashboard carrega estatísticas
   - ✅ Criar novo paciente
   - ✅ Criar nova prescrição
   - ✅ Verificar estoque
   - ✅ Ver agenda

---

## 🔧 Troubleshooting

### Erro: "Backend Offline" (Alerta Vermelho)

**Causa:** Frontend não consegue conectar ao backend

**Solução:**
1. Verifique se o backend está rodando no Railway
2. Teste o health check: `https://SEU-BACKEND.up.railway.app/health`
3. Verifique o proxy em `client/netlify.toml`
4. Verifique CORS no Railway (variável `FRONTEND_URL`)

### Erro: 404 em chamadas de API

**Causa:** Proxy não configurado ou URL incorreta

**Solução:**
1. Confira `client/netlify.toml` → redirects
2. URL do backend deve terminar com `/api/:splat`
3. Faça novo deploy do frontend

### Erro: CORS Policy

**Causa:** Backend não aceita requisições do frontend

**Solução:**
1. No Railway, adicione/atualize:
   ```env
   FRONTEND_URL=https://seu-frontend.netlify.app
   ```
2. Aguarde o redeploy automático

### Erro: MongoDB Connection Failed

**Causa:** Connection string incorreta ou rede bloqueada

**Solução:**
1. Verifique a variável `MONGODB_URI` no Railway
2. No MongoDB Atlas, adicione IP `0.0.0.0/0` em Network Access
3. Verifique usuário e senha na connection string
4. Teste a conexão manualmente

### Erro: JWT Secret Not Defined

**Causa:** Variável JWT_SECRET não configurada

**Solução:**
1. No Railway, adicione:
   ```env
   JWT_SECRET=uma-chave-secreta-muito-forte-xyz123
   JWT_REFRESH_SECRET=outra-chave-secreta-abc456
   ```

---

## 🔐 Segurança em Produção

### ⚠️ IMPORTANTE: Antes de ir para produção

1. **Mude os secrets:**
   ```bash
   # Gere secrets fortes
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   
   # Use no Railway
   JWT_SECRET=<secret_gerado_1>
   JWT_REFRESH_SECRET=<secret_gerado_2>
   ```

2. **Configure HTTPS:**
   - Netlify: Automático ✅
   - Railway: Automático ✅

3. **Limite CORS:**
   ```env
   # Apenas seu domínio
   FRONTEND_URL=https://prescrimed.com
   ```

4. **Ative logs:**
   ```env
   NODE_ENV=production
   ```

5. **Backups do MongoDB:**
   - MongoDB Atlas faz backups automáticos
   - Configure snapshots periódicos

---

## 📊 Monitoramento

### Railway
- Acesse **Metrics** para ver:
  - CPU usage
  - Memory usage
  - Requests/minute
  - Response time

### Netlify
- Acesse **Analytics** para ver:
  - Page views
  - Unique visitors
  - Bandwidth
  - Deploy history

---

## 🔄 Updates Futuros

### Para atualizar o sistema:

1. **Backend (Railway):**
   ```bash
   # Faça as alterações
   git add .
   git commit -m "Update backend"
   git push
   
   # Railway fará redeploy automático
   ```

2. **Frontend (Netlify):**
   ```bash
   # Faça as alterações
   git add .
   git commit -m "Update frontend"
   git push
   
   # Netlify fará rebuild automático
   ```

---

## 💰 Custos

### Railway (Free Tier)
- ✅ $5 de crédito gratuito/mês
- ✅ Suficiente para ~500 horas de runtime
- ⚠️ Após limite, upgrade para $5/mês

### Netlify (Free Tier)
- ✅ 100 GB de bandwidth/mês
- ✅ 300 build minutes/mês
- ✅ Domínio customizado gratuito
- ✅ HTTPS gratuito

### MongoDB Atlas (Free Tier)
- ✅ 512 MB de storage
- ✅ Shared cluster
- ✅ Backups automáticos
- ⚠️ Upgrade para mais storage: $9/mês

**Total Free Tier:** $0/mês (dentro dos limites)

---

## 🎉 Pronto!

Seu sistema Prescrimed está online e funcionando!

**URLs de exemplo:**
- Frontend: https://prescrimed.netlify.app
- Backend: https://prescrimed-production.up.railway.app

**Login:**
- Email: `superadmin@prescrimed.com`
- Senha: `super123`

---

## 📚 Documentação Adicional

- [Netlify Docs](https://docs.netlify.com)
- [Railway Docs](https://docs.railway.app)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [ANALISE_COMPLETA_SISTEMA.md](ANALISE_COMPLETA_SISTEMA.md)
- [GUIA_USO_RAPIDO.md](GUIA_USO_RAPIDO.md)

---

**Deploy realizado com sucesso!** 🚀✨
