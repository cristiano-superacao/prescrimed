# 🎯 RENDER - DEPLOY AUTOMÁTICO CONFIGURADO

## ✅ O QUE FIZ:

1. ✅ Corrigi o arquivo `render.yaml` com as configurações certas:
   - PORT=3000 (ao invés de 10000)
   - USE_MEMORY_DB=true (banco em memória)
   - healthCheckPath=/api/health (caminho correto)
   - startCommand=npm start (comando correto)
   - Frontend URL corrigido (prescrimed)

2. ✅ Fiz commit e push para GitHub

3. ✅ Render vai detectar automaticamente e fazer deploy!

---

## 🚀 AGORA FAÇA ISSO (2 MINUTOS):

### 1. **Acesse o Render Dashboard**

```
https://dashboard.render.com/login
Email: cristiano.s.santos@ba.estudante.senai.br
Senha: 18042016
```

### 2. **Duas opções:**

#### **A) Se já existe o serviço "prescrimed-backend":**

1. Clique no serviço
2. Vá em "Manual Deploy" → "Deploy latest commit"
3. Aguarde 2-3 minutos
4. ✅ Pronto!

#### **B) Se NÃO existe o serviço (criar novo):**

1. Clique em **"New +"** (canto superior direito)
2. Escolha **"Blueprint"**
3. Conecte seu GitHub
4. Selecione o repositório: **prescrimed**
5. Render vai detectar o `render.yaml` automaticamente
6. Clique em **"Apply"**
7. Aguarde 3-5 minutos para o deploy
8. ✅ Pronto!

---

## 📊 ACOMPANHAR DEPLOY

No Render Dashboard você verá:

```
prescrimed-backend
├── Status: Building... → Live
├── Logs: npm install → npm start → Server running
└── URL: https://prescrimed-backend.onrender.com
```

**Aguarde até aparecer "Live" (verde)**

---

## 🧪 TESTAR QUANDO ESTIVER LIVE

Abra no navegador:

```
https://prescrimed-backend.onrender.com/api/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

---

## ✅ DEPLOY PRONTO!

Quando estiver "Live", me confirme e eu testo o sistema completo:
- ✅ Frontend Netlify
- ✅ Backend Render
- ✅ Integração funcionando

---

## 📞 ME AVISE

Responda uma dessas opções:

1. **"Deploy iniciado"** - quando clicar em Apply/Deploy
2. **"Está Live"** - quando aparecer status verde
3. **"Deu erro"** - se aparecer algum problema (me mande o erro)

---

## 🎯 RESUMO RÁPIDO

```
1. dashboard.render.com → Login
2. Novo Blueprint (ou Manual Deploy se já existe)
3. Conectar GitHub → prescrimed
4. Apply
5. Aguardar "Live"
6. Testar /api/health
7. Me confirmar!
```

**Tempo total: 3-5 minutos** ⏱️

Comece agora! 🚀
