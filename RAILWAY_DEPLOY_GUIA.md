# 🚀 Deploy no Railway - Prescrimed System

## 📋 Visão Geral

Este guia fornece instruções passo a passo para fazer o deploy do backend do Sistema Prescrimed no Railway, mantendo o layout responsivo e profissional.

## 🎯 O que foi configurado

### Backend (Railway)
- ✅ Configuração Railway (`railway.json`)
- ✅ Nixpacks config (`nixpacks.toml`)
- ✅ Procfile para Railway
- ✅ Health check endpoint
- ✅ CORS configurado para Railway
- ✅ Variáveis de ambiente preparadas
- ✅ Binding em 0.0.0.0 para Railway

### Frontend (Netlify)
- ✅ Layout responsivo mantido
- ✅ Configuração de API dinâmica
- ✅ Suporte a Railway URL
- ✅ Fallback para proxy local

## 📦 Pré-requisitos

1. **Conta no Railway** - https://railway.app
2. **Conta no Netlify** - https://netlify.com (para frontend)
3. **MongoDB Atlas** (recomendado) - https://mongodb.com/cloud/atlas
4. **Git instalado**

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

1. No Railway, adicione o plugin MongoDB
2. Railway criará automaticamente a variável `MONGO_URL`

## 🚂 Passo 2: Deploy no Railway

### 2.1. Criar Projeto no Railway

1. Acesse https://railway.app
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Autorize o Railway a acessar seus repositórios
6. Selecione o repositório `prescrimed-main`

### 2.2. Configurar Variáveis de Ambiente

No Railway Dashboard, vá em **Variables** e adicione:

```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://prescrimed:SUA_SENHA@cluster.mongodb.net/prescrimed?retryWrites=true&w=majority

# OU MongoDB Railway (se usar plugin)
# MONGODB_URI=${{MONGO_URL}}

# JWT Secret (gere um seguro)
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_mude_isso

# Node Environment
NODE_ENV=production

# Frontend URL (opcional - para CORS)
FRONTEND_URL=https://seu-app.netlify.app
```

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

1. Railway detectará o `railway.json` automaticamente
2. O build começará automaticamente
3. Aguarde o deploy completar (2-5 minutos)
4. Você verá a URL pública: `https://seu-app.up.railway.app`

### 2.5. Verificar Deploy

1. Acesse: `https://seu-app.up.railway.app/health`
2. Deve retornar:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-01-14T..."
   }
   ```

## 🌐 Passo 3: Configurar Frontend (Netlify)

### 3.1. Atualizar Variável de Ambiente

No Netlify Dashboard:

1. Vá em **Site settings** > **Environment variables**
2. Adicione/Edite:
   ```
   VITE_API_URL = https://seu-app.up.railway.app/api
   ```
3. Clique em **Save**

### 3.2. Redeployar Frontend

1. No Netlify, vá em **Deploys**
2. Clique em **Trigger deploy** > **Clear cache and deploy site**
3. Aguarde o novo deploy completar

## ✅ Passo 4: Testar Sistema

### 4.1. Verificar API

```bash
# Health check
curl https://seu-app.up.railway.app/health

# Teste de login
curl -X POST https://seu-app.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sistema.com","senha":"Admin@123"}'
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

- [ ] Backend no Railway está online
- [ ] Health check responde corretamente
- [ ] MongoDB conectado (Atlas ou Railway)
- [ ] JWT_SECRET configurado e seguro
- [ ] Frontend no Netlify atualizado
- [ ] VITE_API_URL apontando para Railway
- [ ] Login funcionando
- [ ] Dashboard carregando dados
- [ ] Criar paciente funciona
- [ ] Criar prescrição funciona
- [ ] Layout responsivo em mobile
- [ ] CORS configurado corretamente
- [ ] Logs sem erros críticos

## 🎉 Pronto!

Seu sistema Prescrimed está agora rodando no Railway com layout profissional e responsivo!

**URLs de Acesso:**
- Frontend: `https://seu-app.netlify.app`
- Backend: `https://seu-app.up.railway.app`
- API: `https://seu-app.up.railway.app/api`
- Health: `https://seu-app.up.railway.app/health`

**Credenciais Padrão:**
- Email: `admin@sistema.com`
- Senha: `Admin@123`

⚠️ **Importante:** Altere as credenciais padrão após primeiro acesso!
