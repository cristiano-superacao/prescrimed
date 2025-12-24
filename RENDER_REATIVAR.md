# 🚀 RENDER - REATIVAR BACKEND (SOLUÇÃO DEFINITIVA)

## ⚠️ SITUAÇÃO ATUAL

- ✅ Frontend Netlify funcionando: https://prescrimed.netlify.app
- ❌ Backend Render hibernado/inativo
- 🔧 Railway está fora do ar (erro na imagem)

## 🎯 SOLUÇÃO: REATIVAR RENDER (3 MINUTOS)

---

## ✅ OPÇÃO 1: WAKE UP AUTOMÁTICO (1 minuto)

O Render hiberna após 15 minutos de inatividade. Basta **fazer uma requisição** para acordá-lo:

### Abrir no navegador:

```
https://prescrimed-backend.onrender.com/api/health
```

**Aguarde 30-60 segundos** (primeira requisição acorda o serviço)

Deve aparecer:
```json
{"status":"ok","timestamp":"..."}
```

---

## ✅ OPÇÃO 2: REATIVAR NO DASHBOARD (2 minutos)

Se o wake up não funcionar, precisamos verificar no dashboard:

### 1. Login no Render

```
https://dashboard.render.com
Email: cristiano.s.santos@ba.estudante.senai.br
Senha: 18042016
```

### 2. Localizar o serviço

- Procure: **prescrimed-backend** ou **prescrimed**
- Status pode estar: Suspended / Failed / Live

### 3. Verificar o problema

#### Se estiver SUSPENDED:
- Clique no serviço
- Clique em **"Resume Service"**
- Aguarde ~2 minutos

#### Se estiver FAILED:
- Clique em **"Manual Deploy"** → **"Deploy latest commit"**
- Aguarde logs do deploy

#### Se NÃO EXISTIR:
- Precisamos criar novo serviço (veja Opção 3)

---

## ✅ OPÇÃO 3: CRIAR NOVO SERVIÇO RENDER (5 minutos)

Se o serviço não existe mais:

### 1. No Dashboard do Render

- Clique em **"New +"** → **"Web Service"**

### 2. Conectar GitHub

- "Connect a repository"
- Busque: **prescrimed** ou **cristiano-superacao/prescrimed**
- Clique em **"Connect"**

### 3. Configurar serviço

```
Name: prescrimed-backend
Region: Oregon (US West) ou Frankfurt (EU)
Branch: main
Root Directory: (deixar vazio)
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

### 4. Variáveis de ambiente

Clique em **"Advanced"** → **"Add Environment Variable"**

**COPIE E COLE CADA UMA:**

```
PORT=3000
USE_MEMORY_DB=true
JWT_SECRET=prescrimed-render-jwt-secret-2024-prod
NODE_ENV=production
```

### 5. Deploy

- Clique em **"Create Web Service"**
- Aguarde deploy (~3-5 minutos)
- Copie a URL gerada (ex: `prescrimed-backend.onrender.com`)

---

## 🔄 SE PRECISAR MUDAR A URL

Se criou novo serviço e a URL mudou, me avise assim:

```
Nova URL Render: https://prescrimed-backend-XXXXX.onrender.com
```

Eu atualizo o `netlify.toml` automaticamente!

---

## ✅ TESTAR

Após reativar/criar, teste:

```
https://SUA-URL.onrender.com/api/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"2024-12-04T..."}
```

---

## 📊 MONITORAR

No Render Dashboard você pode ver:
- Logs em tempo real
- CPU/Memory usage
- Últimas requisições
- Status do serviço

---

## 🆘 PROBLEMAS COMUNS

### "Service Suspended"
→ Plano free excedeu 750 horas/mês
→ Aguarde início do mês ou faça upgrade para $7/mês

### "Build Failed"
→ Verifique logs no Render
→ Confirme package.json está correto
→ Tente "Clear build cache & deploy"

### "Application Failed to Respond"
→ Verifique variável PORT=3000
→ Confirme USE_MEMORY_DB=true
→ Veja logs para erros

### Ainda hibernando muito
→ Use o plano pago ($7/mês) para evitar hibernação
→ Ou configure um serviço de "ping" (UptimeRobot, cron-job.org)

---

## 💡 DICA: EVITAR HIBERNAÇÃO (GRÁTIS)

Configure um ping automático a cada 10 minutos:

### UptimeRobot (gratuito):
1. https://uptimerobot.com (criar conta)
2. Add Monitor → HTTP(s)
3. URL: `https://prescrimed-backend.onrender.com/api/health`
4. Interval: 5 minutos
5. ✅ Serviço nunca hiberna!

---

## 🎯 RESUMO

1. Tente wake up: Acesse `/api/health` no navegador
2. Se não funcionar: Entre no Render Dashboard
3. Reative/Crie o serviço
4. Teste o endpoint
5. Me avise se a URL mudou

---

## 📞 PRÓXIMO PASSO

**COMECE PELA OPÇÃO 1** (mais rápido!)

Abra no navegador:
```
https://prescrimed-backend.onrender.com/api/health
```

Se aparecer "Não encontrado" ou erro 404, vá para **Opção 2** (Dashboard).

Me avise o resultado! 🚀

**Credenciais Render:**
- Email: cristiano.s.santos@ba.estudante.senai.br
- Senha: 18042016
- URL: https://dashboard.render.com
