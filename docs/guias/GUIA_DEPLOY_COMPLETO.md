# 🎯 Configuração Completa - MongoDB Atlas + Render Deploy

## ✨ PARTE 1: MongoDB Atlas (5 minutos)

### Passo 1: Criar Conta no MongoDB Atlas
1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. **Faça login com:** `cristiano.s.santos@ba.estudante.senai.br` / Senha: `18042016`
   - OU use "Sign in with Google" (mais rápido)

### Passo 2: Criar Cluster Gratuito
1. Após login, clique em **"Create"** ou **"Build a Database"**
2. Escolha: **M0 FREE** (0,00 USD/mês)
3. **Provider:** AWS
4. **Region:** São Paulo (sa-east-1) ou US East (us-east-1)
5. **Cluster Name:** `Cluster0` (pode deixar padrão)
6. Clique: **"Create Cluster"**

### Passo 3: Criar Usuário do Banco
1. Aparecerá popup **"Security Quickstart"**
2. Em **"Authentication Method":** deixe `Username and Password`
3. **Username:** `prescrimed`
4. **Password:** Clique em "Autogenerate Secure Password" 
   - ⚠️ **COPIE E SALVE ESSA SENHA!**
5. Clique: **"Create User"**

### Passo 4: Liberar Acesso de Rede
1. Na mesma tela, em **"Where would you like to connect from?"**
2. Escolha: **"My Local Environment"**
3. Clique em: **"Add My Current IP Address"**
4. **IMPORTANTE:** Adicione também `0.0.0.0/0` (clique em "Add IP Address" novamente)
   - IP: `0.0.0.0/0`
   - Description: `Allow All`
5. Clique: **"Finish and Close"**

### Passo 5: Obter Connection String
1. Clique em **"Connect"** no seu cluster
2. Escolha: **"Connect your application"**
3. **Driver:** Node.js
4. **Version:** 5.5 or later
5. Copie a Connection String que aparece (algo como):
   ```
   mongodb+srv://prescrimed:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **EDITE a string:**
   - Substitua `<password>` pela senha que você copiou
   - Adicione `/prescrimed` antes do `?`
   - Resultado final:
   ```
   mongodb+srv://prescrimed:SUA_SENHA_AQUI@cluster0.xxxxx.mongodb.net/prescrimed?retryWrites=true&w=majority
   ```

✅ **Pronto! Copie essa string e guarde para o próximo passo.**

---

## 🚀 PARTE 2: Deploy no Render (5 minutos)

### Passo 1: Acessar Render
1. Acesse: https://dashboard.render.com/
2. Clique em: **"Get Started"** ou **"Sign In"**
3. **Login com GitHub** (mais rápido e conecta direto com repo)

### Passo 2: Criar Web Service
1. No painel, clique: **"New +"** → **"Web Service"**
2. Conecte ao GitHub (se pedir autorização, permita)
3. Procure e selecione: **`prescrimed`**
4. Clique: **"Connect"**

### Passo 3: Configurar o Serviço
Preencha os campos:

**Name:** `prescrimed-backend`

**Region:** `Oregon (US West)` (grátis) ou `Ohio (US East)` 

**Branch:** `main`

**Root Directory:** (deixe em branco)

**Runtime:** `Node`

**Build Command:** `npm install`

**Start Command:** `node server.js`

**Instance Type:** `Free` (0 USD/mês)

### Passo 4: Adicionar Variáveis de Ambiente
Clique em **"Advanced"** e depois **"Add Environment Variable"**

Adicione cada uma dessas (clique "+ Add Environment Variable" para cada):

```
PORT
5000

NODE_ENV
production

JWT_SECRET
prescrimed_secret_key_2024_super_seguro_mongodb

FRONTEND_URL
https://precrimed.netlify.app

CORS_ORIGIN
https://precrimed.netlify.app

MONGODB_URI
[COLE AQUI A CONNECTION STRING DO MONGODB ATLAS QUE VOCÊ COPIOU]
```

⚠️ **MUITO IMPORTANTE:** No `MONGODB_URI`, cole a connection string completa que você preparou na Parte 1, Passo 5!

### Passo 5: Deploy!
1. Revise tudo
2. Clique: **"Create Web Service"**
3. Aguarde 2-5 minutos para o build completar
4. Você verá logs em tempo real
5. Quando aparecer "Live" em verde, está pronto! 🎉

### Passo 6: Testar o Backend
1. Copie a URL do seu serviço (ex: `https://prescrimed-backend.onrender.com`)
2. Adicione `/health` no final
3. Abra no navegador: `https://prescrimed-backend.onrender.com/health`
4. Deve retornar: `{"status":"ok","timestamp":"..."}`

✅ **Backend funcionando!**

---

## 🔗 PARTE 3: Conectar Frontend ao Backend (2 minutos)

### Atualizar Variável de Ambiente do Frontend

Edite o arquivo `.env.production` no frontend com a URL do seu backend:

```env
VITE_API_URL=https://SEU-BACKEND-AQUI.onrender.com/api
```

### Fazer Novo Deploy no Netlify

Execute no terminal:

```bash
cd c:\Users\Superação\Desktop\Sistemas\prescrimed-system\client
npm run build
netlify deploy --prod --dir=dist --site 7952a4ed-c83e-48bc-aeef-475f1167aeaf --message "Conectar frontend ao backend no Render"
```

---

## 🎊 PRONTO! Sistema 100% Online

Acesse: **https://precrimed.netlify.app**

### Teste o Login:
- Email: (qualquer email que você cadastrar no registro)
- Ou crie uma nova conta pelo registro

---

## 📝 Informações Importantes

### ⚠️ Limitações do Plano Gratuito

**MongoDB Atlas Free (M0):**
- ✅ 512 MB de armazenamento
- ✅ Compartilhado entre projetos
- ✅ Sem limites de conexões (razoável)
- ⚠️ Pode ter lentidão em horários de pico

**Render Free:**
- ✅ 750 horas/mês grátis
- ✅ 512 MB RAM
- ⚠️ **Hiberna após 15 minutos** de inatividade
- ⚠️ Primeira requisição após hibernar: 30-60 segundos
- ✅ Sem limites de deploy

### 🚀 Para Evitar Hibernação (Opcional)

Você pode usar um serviço de "ping" grátis para manter o backend acordado:
- **UptimeRobot:** https://uptimerobot.com/ (50 monitores grátis)
- Configure para fazer ping a cada 5 minutos em: `https://seu-backend.onrender.com/health`

---

## 🆘 Troubleshooting

### Problema: Backend não inicia no Render
- Verifique os logs: **Logs** → **Deploy Logs**
- Certifique-se que `MONGODB_URI` está correto
- Verifique se liberou IP `0.0.0.0/0` no MongoDB Atlas

### Problema: Erro de CORS no frontend
- Confirme que `FRONTEND_URL` está configurado no Render
- URL deve ser exatamente: `https://precrimed.netlify.app` (sem barra no final)

### Problema: Erro de conexão com MongoDB
- Teste a connection string localmente primeiro
- Verifique se substituiu `<password>` pela senha real
- Confirme que adicionou `/prescrimed` antes do `?`

### Problema: Backend muito lento
- Normal no plano Free após hibernar
- Considere fazer upgrade para plano Starter ($7/mês) para evitar hibernação

---

## 💡 Próximos Passos (Opcional)

1. **Configurar domínio próprio** no Netlify
2. **Adicionar CI/CD** para deploy automático
3. **Configurar backup** do MongoDB
4. **Adicionar monitoramento** com UptimeRobot
5. **SSL/HTTPS** já está incluído (Render + Netlify)

---

**Precisa de ajuda? Me avise em qual etapa está!** 🚀
