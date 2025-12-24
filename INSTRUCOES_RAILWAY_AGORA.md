# 🚀 RAILWAY - FAZER AGORA (ABERTO NO NAVEGADOR)

## ✅ PASSO 1: LOGIN (30 segundos)

O Railway já está aberto no navegador interno do VS Code!

### Opção A: Login com GitHub (RECOMENDADO)
1. Clique em **"Login with GitHub"**
2. Autorize o Railway App
3. ✅ Pronto!

### Opção B: Login com Email
1. Clique em **"Start a New Project"**
2. Use: **cristiano.s.santos@ba.estudante.senai.br**
3. Senha: **18042016**

---

## ✅ PASSO 2: CRIAR PROJETO (1 minuto)

Após o login:

1. Clique em **"New Project"** ou **"Start a New Project"**
2. Escolha: **"Deploy from GitHub repo"**
3. Se pedir autorização do GitHub:
   - Clique em **"Install & Authorize"**
   - Selecione sua conta
4. Busque e selecione: **prescrimed**
5. Clique em **"Deploy"**

---

## ✅ PASSO 3: VARIÁVEIS (Copiar e Colar)

Assim que o projeto abrir:

1. Clique na aba **"Variables"** (à esquerda)
2. Clique em **"RAW Editor"** (canto superior direito)
3. **COPIE E COLE** exatamente isto:

```
PORT=3000
USE_MEMORY_DB=true
JWT_SECRET=prescrimed-jwt-secret-2024-railway-prod-secure
NODE_ENV=production
```

4. Clique em **"Save"** ou pressione **Ctrl+S**

---

## ✅ PASSO 4: AGUARDAR DEPLOY (2-3 minutos)

Railway vai:
- ✅ Detectar Node.js automaticamente
- ✅ Instalar dependências (npm install)
- ✅ Iniciar servidor (npm start)

**Você pode ver os logs em tempo real!**

Clique em **"Deployments"** para acompanhar.

---

## ✅ PASSO 5: GERAR DOMÍNIO

Quando o deploy ficar **VERDE (Success)**:

1. Clique em **"Settings"** (à esquerda)
2. Role até **"Domains"**
3. Clique em **"Generate Domain"**
4. **COPIE A URL** gerada (ex: `prescrimed-production.up.railway.app`)

---

## 📋 DEPOIS ME PASSE A URL

Quando copiar a URL, **cole aqui no chat** assim:

```
URL Railway: https://prescrimed-production-xxxxx.up.railway.app
```

Eu vou atualizar automaticamente o `netlify.toml` e fazer o deploy final!

---

## 🔍 VERIFICAR SE DEU CERTO

Após gerar o domínio, teste no navegador:

```
https://SUA-URL.railway.app/api/health
```

Deve aparecer:
```json
{"status":"ok","timestamp":"..."}
```

---

## ⏱️ TEMPO TOTAL: ~5 MINUTOS

1. Login: 30s ✅
2. Criar projeto: 1 min ✅
3. Variáveis: 30s ✅
4. Deploy: 2-3 min ⏳
5. Gerar domínio: 30s ✅

---

## 🆘 PROBLEMAS?

### "Repository not found"
→ Autorize o Railway no GitHub primeiro

### "Build failed"
→ Verifique se as variáveis foram salvas corretamente

### "Service unhealthy"
→ Veja os logs em "Deployments" → "Logs"

---

## 📞 PRONTO!

Quando tiver a URL, cole aqui que eu finalizo tudo! 🎯

**Credenciais:**
- Email: cristiano.s.santos@ba.estudante.senai.br
- Senha: 18042016
