# 🚀 RAILWAY - COMANDOS RÁPIDOS

## 📋 Pré-requisitos

**Credenciais:**
- Email: cristiano.s.santos@ba.estudante.senai.br
- Senha: 18042016

---

## ⚡ SETUP INICIAL (5 MINUTOS)

### 1. Criar Conta e Projeto

```bash
# 1. Acesse no navegador
https://railway.app

# 2. Clique em "Start a New Project"

# 3. Login com GitHub ou Email
# Email: cristiano.s.santos@ba.estudante.senai.br
# Senha: 18042016

# 4. "Deploy from GitHub repo"

# 5. Selecionar: cristiano-superacao/prescrimed
```

---

### 2. Configurar Variáveis (Copiar e Colar)

No Railway Dashboard → Variables → Raw Editor, cole:

```bash
PORT=3000
USE_MEMORY_DB=true
JWT_SECRET=prescrimed-jwt-secret-2024-railway-prod
NODE_ENV=production
```

Ou se tiver MongoDB Atlas:

```bash
PORT=3000
MONGODB_URI=mongodb+srv://seu-usuario:sua-senha@cluster.mongodb.net/prescrimed
JWT_SECRET=prescrimed-jwt-secret-2024-railway-prod
NODE_ENV=production
```

---

### 3. Deploy Automático

✅ **Railway faz tudo sozinho!**

Aguarde ~2-3 minutos e veja logs em tempo real.

---

### 4. Obter URL

```bash
# No Railway:
# Settings → Domains → Generate Domain

# URL será algo como:
https://prescrimed-production.up.railway.app
```

**COPIE ESSA URL!**

---

### 5. Atualizar Netlify

```bash
# Abra o arquivo
code c:\Users\Superação\prescrimed\netlify.toml

# Encontre a linha:
to = "https://prescrimed-backend.onrender.com/api/:splat"

# Substitua por (use SUA URL do Railway):
to = "https://prescrimed-production.up.railway.app/api/:splat"

# Salve e execute:
cd c:\Users\Superação\prescrimed
git add netlify.toml
git commit -m "chore: migra backend para Railway"
git push origin main
```

---

### 6. Testar

```powershell
# Testar backend Railway
Invoke-WebRequest -Uri "https://prescrimed-production.up.railway.app/api/health"

# Deve retornar:
# StatusCode: 200
# Content: {"status":"ok",...}
```

---

## 🔧 VARIÁVEIS RECOMENDADAS

### Mínimo (Development)

```bash
PORT=3000
USE_MEMORY_DB=true
JWT_SECRET=prescrimed-jwt-secret-2024
NODE_ENV=production
```

### Produção (Com MongoDB Atlas)

```bash
PORT=3000
MONGODB_URI=mongodb+srv://prescrimed:SUA_SENHA@cluster.mongodb.net/prescrimed
JWT_SECRET=gere-um-secret-muito-seguro-aqui
NODE_ENV=production
CORS_ORIGIN=https://prescrimed.netlify.app
```

---

## 🗄️ MONGODB OPTIONS

### Opção 1: Memory DB (Temporário) ⚡

```bash
USE_MEMORY_DB=true
```

**Vantagens:**
- ✅ Zero configuração
- ✅ Funciona imediatamente
- ✅ Grátis

**Desvantagens:**
- ⚠️ Dados perdidos ao reiniciar
- ⚠️ Não persiste

---

### Opção 2: MongoDB Atlas (Recomendado) 🌟

```bash
# 1. Criar conta gratuita
https://www.mongodb.com/cloud/atlas/register

# 2. Criar cluster M0 (free)
# Região: São Paulo

# 3. Criar usuário DB
# Username: prescrimed
# Password: [gerar senha]

# 4. Network Access
# IP: 0.0.0.0/0 (allow all)

# 5. Connection String
MONGODB_URI=mongodb+srv://prescrimed:SENHA@cluster.mongodb.net/prescrimed
```

---

### Opção 3: MongoDB Railway (Integrado) 🚂

```bash
# No Railway Dashboard:
# New → Add Database → MongoDB

# Variável criada automaticamente:
# MONGO_URL ou MONGODB_URI
```

---

## 📊 COMANDOS DE MONITORAMENTO

### Ver Logs em Tempo Real

```bash
# No Railway Dashboard:
# Clique no serviço → Aba "Logs"
```

### Ver Métricas

```bash
# Railway Dashboard:
# Aba "Metrics"
# - CPU
# - RAM
# - Network
# - Requests
```

### Testar Health Check

```powershell
# Windows PowerShell
Invoke-WebRequest -Uri "https://SUA-URL.railway.app/api/health" -Method GET

# Resposta esperada:
# StatusCode: 200
# Content: {"status":"ok","timestamp":"..."}
```

---

## 🔄 REDEPLOY MANUAL

Se precisar fazer redeploy:

```bash
# Railway Dashboard:
# Deployments → Latest → ⋮ → Redeploy
```

Ou faça um push vazio:

```bash
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

---

## 🐛 TROUBLESHOOTING RÁPIDO

### Build Falhou

```bash
# Ver logs no Railway → Deployments → Build logs
# Verificar package.json está correto
# Confirmar Node 18+ sendo usado
```

### App Não Inicia

```bash
# Verificar variáveis de ambiente
# Confirmar PORT está correto
# Ver logs de runtime
```

### MongoDB Error

```bash
# Se Memory DB: Verificar USE_MEMORY_DB=true
# Se Atlas: Verificar connection string
# Confirmar IP whitelist (0.0.0.0/0)
```

### 502 Bad Gateway

```bash
# Aguardar deploy completar
# Verificar app está rodando (ver logs)
# Fazer redeploy se necessário
```

---

## ✅ CHECKLIST RÁPIDO

```
[ ] Conta Railway criada
[ ] Repo GitHub conectado
[ ] Variáveis configuradas
[ ] Deploy concluído (verde)
[ ] URL gerada e copiada
[ ] Health check OK (200)
[ ] netlify.toml atualizado
[ ] Git push feito
[ ] Netlify deploy OK
[ ] Login funciona
```

---

## 💰 MONITORAR CRÉDITOS

```bash
# Railway Dashboard:
# Settings → Usage → Ver consumo atual

# Free tier: $5/mês
# Uso típico: $3-4/mês
```

---

## 🎯 LINKS RÁPIDOS

| Item | URL |
|------|-----|
| **Railway Dashboard** | https://railway.app/dashboard |
| **Railway Docs** | https://docs.railway.app |
| **MongoDB Atlas** | https://www.mongodb.com/cloud/atlas |
| **Netlify Dashboard** | https://app.netlify.com |
| **Frontend (Prod)** | https://prescrimed.netlify.app |

---

## 🚀 RESUMO DE 1 MINUTO

```bash
1. railway.app → Login
2. Deploy from GitHub → prescrimed
3. Variables → Colar variáveis acima
4. Aguardar deploy (~2 min)
5. Copiar URL gerada
6. Atualizar netlify.toml
7. Git push
8. Testar!
```

---

**Tempo total: ~5-10 minutos**

**Credenciais:** cristiano.s.santos@ba.estudante.senai.br / 18042016

**Comece agora:** https://railway.app
