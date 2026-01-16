# 🚀 Deploy em Produção - Prescrimed

## 📋 Arquitetura de Deploy

- **Frontend:** GitHub Pages (cristiano-superacao.github.io/prescrimed)
- **Backend:** Railway (prescrimed-backend-production.up.railway.app)
- **Banco de Dados:** MongoDB Atlas (gerenciado via Railway)

---

## 🔧 1. Configurar MongoDB Atlas

### Criar Cluster Gratuito
1. Acesse https://www.mongodb.com/cloud/atlas/register
2. Crie uma conta gratuita
3. Crie um novo cluster (M0 Free Tier)
4. **Importante:** Adicione seu IP na whitelist:
   - Security → Network Access → Add IP Address
   - **Para Railway:** Adicione `0.0.0.0/0` (permitir todas as origens)

### Obter String de Conexão
1. Databases → Connect → Connect your application
2. Copie a string: `mongodb+srv://usuario:<password>@cluster.mongodb.net/prescrimed?retryWrites=true&w=majority`
3. Substitua `<password>` pela sua senha real

---

## 🚂 2. Deploy no Railway (Backend)

### Passo 1: Criar Projeto
1. Acesse https://railway.app
2. Login com GitHub
3. New Project → Deploy from GitHub repo
4. Selecione `cristiano-superacao/prescrimed`

### Passo 2: Configurar Variáveis de Ambiente

No Railway Dashboard, vá em **Variables** e adicione:

```env
# Obrigatórias
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/prescrimed?retryWrites=true&w=majority

# JWT Secrets (gere valores seguros)
JWT_SECRET=seu-secret-super-seguro-aqui-min-32-chars
JWT_REFRESH_SECRET=seu-refresh-secret-super-seguro-aqui-min-32-chars
SESSION_TIMEOUT=8h

# Frontend (GitHub Pages)
FRONTEND_URL=https://cristiano-superacao.github.io
ALLOWED_ORIGINS=https://cristiano-superacao.github.io

# Railway fornece automaticamente
RAILWAY_PUBLIC_DOMAIN=prescrimed-backend-production.up.railway.app
```

### Passo 3: Gerar Secrets Seguros

No terminal local:
```powershell
# Gerar JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Gerar JWT_REFRESH_SECRET  
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Passo 4: Deploy Automático
- Railway detecta `railway.json` e faz deploy automaticamente
- Aguarde o build finalizar (~2-3 minutos)
- Verifique logs: `railway logs`
- Teste health: `https://seu-backend.up.railway.app/health`

---

## 📄 3. Deploy no GitHub Pages (Frontend)

### Passo 1: Habilitar GitHub Pages
1. GitHub → Repositório → Settings
2. Pages → Source → **GitHub Actions**

### Passo 2: Configurar Secrets do Repositório
1. Settings → Secrets and variables → Actions
2. Adicione os secrets:

```
VITE_API_URL
valor: https://prescrimed-backend-production.up.railway.app/api

VITE_BACKEND_ROOT
valor: https://prescrimed-backend-production.up.railway.app
```

### Passo 3: Trigger Deploy
```powershell
cd C:\Users\Superação\Desktop\Sistema\prescrimed-main

# Criar commit vazio para trigger
git commit --allow-empty -m "chore: trigger GitHub Pages deploy"
git push origin master
```

### Passo 4: Monitorar Deploy
1. Actions tab no GitHub
2. Aguarde "Deploy GitHub Pages (client)" finalizar
3. Acesse: https://cristiano-superacao.github.io/prescrimed

---

## ✅ 4. Validação Completa

### Backend (Railway)
```powershell
# Health check
Invoke-WebRequest -Uri https://prescrimed-backend-production.up.railway.app/health

# Deve retornar: {"status":"ok","db":"connected"}
```

### Frontend (GitHub Pages)
1. Abra: https://cristiano-superacao.github.io/prescrimed
2. Login com: `superadmin@prescrimed.com` / `super123`
3. Verifique console do navegador (F12) - não deve ter erros CORS

### Comunicação Frontend ↔ Backend
- Abra DevTools → Network
- Faça login
- Verifique requisições para `/api/auth/login`
- Status deve ser `200 OK`

---

## 🔒 5. Segurança e CORS

O backend já está configurado para aceitar:
- GitHub Pages: `https://cristiano-superacao.github.io`
- Localhost: `http://localhost:5173`
- Railway: domínio público automático

Se adicionar novos domínios, edite `server.js`:
```javascript
const baseOrigins = [
  'https://cristiano-superacao.github.io',
  'https://seu-dominio-customizado.com',
  // ...
];
```

---

## 📊 6. Monitoramento

### Railway Logs
```bash
# CLI Railway
railway logs --tail 100
```

### GitHub Actions Logs
- Actions tab → último workflow → visualizar logs

### MongoDB Atlas
- Metrics → Real-time Performance

---

## 🐛 7. Resolução de Problemas

### Backend não inicia no Railway

**Sintomas:** Deploy falhando, health check 404

**Soluções:**
```powershell
# 1. Verificar variáveis de ambiente
railway variables

# 2. Verificar logs
railway logs --tail 50

# 3. Redeployar
git commit --allow-empty -m "redeploy" && git push
```

### Frontend 404 no GitHub Pages

**Sintomas:** Página não carrega, 404

**Soluções:**
1. Verificar Settings → Pages está em "GitHub Actions"
2. Rerun workflow: Actions → último deploy → Re-run jobs
3. Verificar secrets: `VITE_API_URL` e `VITE_BACKEND_ROOT` configurados

### CORS Errors

**Sintomas:** Console mostra "blocked by CORS policy"

**Soluções:**
1. Verificar `FRONTEND_URL` no Railway
2. Adicionar origem no `server.js` → `baseOrigins`
3. Redeploy backend

### Database Connection Failed

**Sintomas:** Backend online, mas rotas retornam 503

**Soluções:**
1. Verificar `MONGODB_URI` no Railway
2. MongoDB Atlas → Network Access → liberar `0.0.0.0/0`
3. Testar conexão localmente:
```bash
mongosh "mongodb+srv://seu-usuario:senha@cluster.mongodb.net"
```

---

## 🔄 8. Workflow de Atualização

### Atualizar Frontend
```powershell
cd client
# Fazer alterações
git add .
git commit -m "feat: nova funcionalidade"
git push origin master
# GitHub Actions rebuilda automaticamente
```

### Atualizar Backend
```powershell
# Fazer alterações no server.js ou routes
git add .
git commit -m "fix: correção na API"
git push origin master
# Railway rebuilda automaticamente
```

---

## 💰 9. Custos

### Gratuitos (Free Tier)
- **GitHub Pages:** ilimitado
- **Railway:** $5/mês de crédito grátis (~500h/mês)
- **MongoDB Atlas:** M0 Free (512MB)

### Upgrades
- Railway Hobby: $5/mês (sem sleep, mais recursos)
- MongoDB M2: $9/mês (2GB storage)

---

## 📞 10. Suporte

- Railway: https://railway.app/help
- MongoDB Atlas: https://www.mongodb.com/docs/atlas
- GitHub Pages: https://docs.github.com/pages

---

## ✨ URLs Finais

- **Frontend:** https://cristiano-superacao.github.io/prescrimed
- **Backend:** https://prescrimed-backend-production.up.railway.app
- **API:** https://prescrimed-backend-production.up.railway.app/api
- **Health:** https://prescrimed-backend-production.up.railway.app/health

🎉 **Sistema em produção!**
