# 🚂 Guia Rápido - Deploy Railway

## ⚡ Início Rápido (5 minutos)

### 1. MongoDB Atlas (necessário primeiro)
```
1. https://www.mongodb.com/cloud/atlas/register
2. Create Free Cluster (M0)
3. Database Access → Add User (anote usuário/senha)
4. Network Access → Add IP: 0.0.0.0/0 (Railway)
5. Databases → Connect → String de conexão
   mongodb+srv://usuario:SENHA@cluster.mongodb.net/prescrimed
```

### 2. Railway Deploy
```
1. https://railway.app → Login com GitHub
2. New Project → Deploy from GitHub repo
3. Selecionar: cristiano-superacao/prescrimed
4. Settings → Generate Domain (anote a URL)
```

### 3. Variáveis de Ambiente (Railway)
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://usuario:SENHA@cluster.mongodb.net/prescrimed?retryWrites=true&w=majority

# Gerar com: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
JWT_SECRET=SEU_SECRET_AQUI_32_CHARS_MINIMO
JWT_REFRESH_SECRET=SEU_REFRESH_SECRET_AQUI_32_CHARS_MINIMO
SESSION_TIMEOUT=8h

FRONTEND_URL=https://cristiano-superacao.github.io
ALLOWED_ORIGINS=https://cristiano-superacao.github.io
```

### 4. Verificar Deploy
```powershell
# Health check
Invoke-WebRequest -Uri https://SEU-BACKEND.up.railway.app/health

# Deve retornar: {"status":"ok","db":"connected"}
```

---

## 🔧 Comandos Úteis (Railway CLI)

### Instalar CLI
```powershell
npm install -g @railway/cli
railway login
railway link
```

### Logs em Tempo Real
```bash
railway logs --tail 100
```

### Ver Variáveis
```bash
railway variables
```

### Redeploy Manual
```bash
railway up
```

---

## 🐛 Troubleshooting

### Deploy Falhando?
```bash
# Ver logs completos
railway logs --tail 200

# Verificar build
railway run npm run build:full

# Forçar redeploy
git commit --allow-empty -m "redeploy"
git push origin master
```

### DB não conecta?
1. MongoDB Atlas → Network Access → verificar 0.0.0.0/0
2. Testar string localmente:
```bash
mongosh "mongodb+srv://usuario:senha@cluster.mongodb.net"
```
3. Verificar MONGODB_URI no Railway (sem espaços/quebras)

### CORS Errors?
- Adicionar frontend URL em `ALLOWED_ORIGINS`
- Verificar `server.js` → `baseOrigins`
- Redeploy backend

---

## 📊 Monitoramento

- **Logs:** Railway Dashboard → Deployments → View Logs
- **Métricas:** Dashboard → Metrics (CPU, RAM, Network)
- **Health:** https://seu-backend.up.railway.app/health

---

## 💰 Custos

- Free: $5/mês de crédito (~500h)
- Hobby: $5/mês (sem sleep, uptime 100%)

---

## ✅ Checklist Final

- [ ] MongoDB Atlas configurado com 0.0.0.0/0
- [ ] String MONGODB_URI testada localmente
- [ ] Variáveis de ambiente no Railway (JWT_SECRET, etc.)
- [ ] Domain gerado no Railway
- [ ] Deploy bem-sucedido (verde)
- [ ] /health retorna status ok + db connected
- [ ] Frontend consegue fazer login

🎉 **Backend em produção no Railway!**
