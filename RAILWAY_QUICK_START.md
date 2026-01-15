# 🚀 Quick Start - Railway Deploy

## Deploy em 5 Minutos

### 1️⃣ MongoDB Atlas (2 min)

```bash
# 1. Acesse: https://mongodb.com/cloud/atlas
# 2. Crie conta gratuita
# 3. Create Cluster (Free tier)
# 4. Database Access > Add User
#    Username: prescrimed
#    Password: (copie a senha gerada)
# 5. Network Access > Add IP
#    IP: 0.0.0.0/0
# 6. Copie Connection String:
mongodb+srv://prescrimed:<password>@cluster.mongodb.net/prescrimed
```

### 2️⃣ Gerar JWT Secret (30 seg)

```bash
# Git Bash / PowerShell
openssl rand -base64 32
# Copie o resultado
```

### 3️⃣ Deploy Railway (2 min)

```bash
# 1. Acesse: https://railway.app
# 2. Login com GitHub
# 3. New Project > Deploy from GitHub
# 4. Selecione: prescrimed-main
# 5. Aguarde build automático
```

### 4️⃣ Configurar Variáveis (1 min)

No Railway Dashboard > Variables:

```env
MONGODB_URI=mongodb+srv://prescrimed:SUA_SENHA@cluster.mongodb.net/prescrimed?retryWrites=true&w=majority
JWT_SECRET=resultado_do_openssl_rand
NODE_ENV=production
```

Clique **Save** e aguarde redeploy.

### 5️⃣ Atualizar Frontend Netlify (30 seg)

Netlify Dashboard > Environment variables:

```env
VITE_API_URL=https://seu-app.up.railway.app/api
```

Trigger deploy > Clear cache and deploy.

### ✅ Testar

```bash
# Health check
curl https://seu-app.up.railway.app/health

# Deve retornar: {"status":"ok","timestamp":"..."}
```

Acesse frontend e faça login:
- Email: `admin@sistema.com`
- Senha: `Admin@123`

## 🎯 URLs Importantes

| Serviço | URL |
|---------|-----|
| Frontend | `https://seu-app.netlify.app` |
| Backend API | `https://seu-app.up.railway.app/api` |
| Health Check | `https://seu-app.up.railway.app/health` |
| Railway Dashboard | `https://railway.app/dashboard` |
| MongoDB Atlas | `https://cloud.mongodb.com` |

## 🐛 Problemas?

### Backend não inicia
```bash
# Verifique logs no Railway Dashboard
# Confirme MONGODB_URI e JWT_SECRET
```

### Frontend não conecta
```bash
# Limpe cache do Netlify
# Verifique VITE_API_URL
# Teste: curl https://seu-app.up.railway.app/health
```

### CORS Error
```bash
# Adicione no Railway:
FRONTEND_URL=https://seu-app.netlify.app
# (sem / no final)
```

## 📚 Guia Completo

Para instruções detalhadas, veja: [RAILWAY_DEPLOY_GUIA.md](./RAILWAY_DEPLOY_GUIA.md)

---

**Deploy em produção em menos de 5 minutos! 🚀**
