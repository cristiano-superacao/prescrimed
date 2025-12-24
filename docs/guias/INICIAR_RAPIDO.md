# 🚀 INICIAR RÁPIDO - 15 Minutos do Zero ao Deploy

## ✅ Guia Express - Sistema Online em 3 Partes

Este guia vai colocar seu sistema **100% funcional e online** em apenas 15 minutos!

- ⏱️ MongoDB Atlas: 5 minutos
- ⏱️ Render Backend: 5 minutos  
- ⏱️ Deploy Frontend: 2 minutos
- ⏱️ Testes: 3 minutos

---

## ⚡ PARTE 1: MongoDB Atlas (5 min)

### 1️⃣ Acesse e faça login
```
🔗 https://cloud.mongodb.com/v2
📧 Email: cristiano.s.santos@ba.estudante.senai.br
🔑 Senha: 18042016
```

### 2️⃣ Criar Cluster (M0 FREE)
1. Clique **"Build a Database"**
2. Escolha **"M0 FREE"** ✅
3. Provider: **AWS**
4. Region: **São Paulo** (ou US East)
5. Clique **"Create"**

### 3️⃣ Criar Usuário
```
Username: prescrimed
Password: prescrimed123
```
📝 **Clique em "Create User"**

### 4️⃣ Liberar IP
```
IP: 0.0.0.0/0
Description: Allow All
```
📝 **Clique em "Add Entry"**

### 5️⃣ Copiar Connection String
1. Clique **"Connect"** → **"Connect your application"**
2. Copie a string e **EDITE**:

```
ANTES:
mongodb+srv://prescrimed:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

DEPOIS (substitua <password> por prescrimed123 e adicione /prescrimed):
mongodb+srv://prescrimed:prescrimed123@cluster0.xxxxx.mongodb.net/prescrimed?retryWrites=true&w=majority
```

✅ **Guarde essa string completa!**

---

## ⚡ PARTE 2: Render Backend Deploy (5 min)

### 1️⃣ Acesse e faça login
```
🔗 https://dashboard.render.com/
💡 Use "Sign in with GitHub" (mais rápido)
```

### 2️⃣ Criar Web Service
1. Clique **"New +"** → **"Web Service"**
2. Conecte o repositório: **`cristiano-superacao/prescrimed`**
3. Clique **"Connect"**

### 3️⃣ Configurar (copie exatamente)

| Campo | Valor |
|-------|-------|
| **Name** | `prescrimed-backend` |
| **Region** | `Oregon (US West)` |
| **Branch** | `main` |
| **Root Directory** | *(deixe vazio)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | `Free` |

### 4️⃣ Adicionar Variáveis de Ambiente

Clique **"Advanced"** → **"Add Environment Variable"** e adicione cada uma:

```bash
PORT
10000

NODE_ENV
production

JWT_SECRET
prescrimed_secret_key_2024_super_seguro_mongodb

FRONTEND_URL
https://precrimed.netlify.app

CORS_ORIGIN
https://precrimed.netlify.app

MONGODB_URI
[COLE AQUI A STRING COMPLETA DO MONGODB QUE VOCÊ COPIOU NA PARTE 1]
```

⚠️ **IMPORTANTE**: No `MONGODB_URI`, cole a string completa com a senha `prescrimed123` e o `/prescrimed`!

### 5️⃣ Fazer Deploy
1. Clique **"Create Web Service"**
2. Aguarde 3-5 minutos ⏳
3. Quando ficar "Live" em verde, copie a URL (ex: `https://prescrimed-backend.onrender.com`)

### 6️⃣ Testar Backend
Abra no navegador:
```
https://prescrimed-backend.onrender.com/health
```
Deve retornar: `{"status":"ok","message":"API funcionando!"}`

---

## ⚡ PARTE 3: Deploy Frontend (2 min)

### 🎯 Opção A: Automático (Recomendado)

Execute no terminal do Windows:
```powershell
cd "c:\Users\Superação\Desktop\Sistemas\prescrimed-system"
.\deploy.bat
```

Quando solicitar, cole a URL do backend Render (sem `/api` no final):
```
https://prescrimed-backend.onrender.com
```

**O script fará automaticamente:**
- ✅ Atualizar `.env.production`
- ✅ Instalar dependências
- ✅ Gerar build de produção
- ✅ Deploy no Netlify

---

### 💻 Opção B: Manual

```powershell
cd "c:\Users\Superação\Desktop\Sistemas\prescrimed-system\client"

# 1. Edite client/.env.production e coloque:
# VITE_API_URL=https://prescrimed-backend.onrender.com/api

# 2. Gerar build
npm run build

# 3. Deploy no Netlify
netlify deploy --prod --dir=dist --site 7952a4ed-c83e-48bc-aeef-475f1167aeaf
```

---

## ✅ PARTE 4: Testar o Sistema (3 min)

### 1️⃣ Testar Backend
Abra no navegador:
```
https://prescrimed-backend.onrender.com/health
```
✅ Deve retornar: `{"status":"ok","message":"API funcionando!"}`

### 2️⃣ Testar Frontend
Acesse:
```
https://precrimed.netlify.app
```

### 3️⃣ Criar Conta e Testar
1. Clique em **"Registrar"**
2. Preencha os dados da empresa
3. Crie seu usuário administrador
4. Faça login
5. Navegue pelo sistema:
   - ✅ Dashboard
   - ✅ Pacientes
   - ✅ Prescrições
   - ✅ Usuários
   - ✅ Empresas

---

## 🎉 PRONTO! Sistema 100% Online

Seu sistema está no ar e funcionando:

- 🌐 **Frontend**: https://precrimed.netlify.app
- 🔧 **Backend**: https://prescrimed-backend.onrender.com
- 💾 **Banco de Dados**: MongoDB Atlas (M0 Free)

### 📊 Recursos Disponíveis:

**MongoDB Atlas (M0 Free):**
- ✅ 512 MB armazenamento
- ✅ Backup automático
- ✅ 100% gratuito para sempre

**Render (Free Tier):**
- ✅ 750 horas/mês grátis
- ✅ Deploy automático via Git
- ⚠️ Hiberna após 15 min de inatividade (primeira requisição: 30-60s)

**Netlify:**
- ✅ 100 GB bandwidth/mês
- ✅ HTTPS automático
- ✅ Deploy instantâneo

---

## 📝 Notas Importantes

### ⏰ Sobre o Plano Gratuito

**Hibernação do Backend:**
- O backend Render "dorme" após 15 minutos sem uso
- Primeira requisição após acordar: 30-60 segundos
- Totalmente normal para planos gratuitos
- Para evitar: Use serviço de ping como UptimeRobot

### 🔄 Atualizações Futuras

**Backend:**
```bash
# Basta fazer push para o GitHub
git add .
git commit -m "Atualização"
git push origin main
# Render faz deploy automático!
```

**Frontend:**
```powershell
# Execute o script de deploy
.\deploy.bat
# Cole a URL do backend quando solicitado
```

---

## 🆘 Problemas Comuns

### ❌ Erro CORS
**Causa**: CORS_ORIGIN incorreto no Render

**Solução**:
- Verifique se está: `https://precrimed.netlify.app`
- Sem barra `/` no final
- Exatamente igual

### ❌ Backend não conecta ao MongoDB
**Causa**: Connection string incorreta

**Solução**:
1. Verifique se substituiu `<password>` pela senha real (`prescrimed123`)
2. Verifique se tem `/prescrimed` antes do `?`
3. Verifique se liberou IP `0.0.0.0/0` no Atlas

### ❌ Frontend não encontra API
**Causa**: `.env.production` incorreto

**Solução**:
1. Verifique se tem a URL correta do Render
2. Execute `deploy.bat` novamente
3. Limpe cache do navegador (Ctrl+Shift+Del)

### ❌ Backend muito lento
**Causa**: Backend estava hibernando

**Solução**:
- Aguarde 30-60 segundos na primeira requisição
- Configure UptimeRobot para ping a cada 5 minutos
- Ou faça upgrade para plano pago ($7/mês)

---

## 💡 Desenvolvimento Local (Opcional)

Se quiser rodar localmente para desenvolver:

### 1️⃣ Configure MongoDB Local ou use Atlas
```env
# .env (desenvolvimento local)
MONGODB_URI=mongodb://localhost:27017/prescrimed
# OU use a mesma string do Atlas
```

### 2️⃣ Inicie o sistema
```

### 2️⃣ Inicie o sistema
```powershell
# Opção 1: Script automático
.\start.bat

# Opção 2: Manual (2 terminais)
npm run dev          # Terminal 1 (backend)
cd client && npm run dev  # Terminal 2 (frontend)
```

### 3️⃣ Acesse
```
http://localhost:5173
```

---

## 📞 Próximos Passos

Agora que seu sistema está online:

1. ✅ **Configure dados iniciais**
   - Cadastre pacientes
   - Crie usuários da equipe
   - Configure permissões

2. ✅ **Personalize**
   - Logo da empresa
   - Cores do tema
   - Dados da empresa

3. ✅ **Compartilhe**
   - Envie o link para sua equipe
   - Configure contas de acesso
   - Defina permissões

4. ✅ **Monitore** (Opcional)
   - Configure UptimeRobot: https://uptimerobot.com
   - Receba alertas de inatividade
   - Mantenha backend acordado

---

## 📚 Documentação Completa

Para mais detalhes, consulte:

- 📖 **DEPLOY_FACIL.md** - Guia completo ilustrado
- 📖 **GUIA_DEPLOY_COMPLETO.md** - Passo a passo detalhado
- 📖 **MONGODB_SETUP.md** - Configuração avançada MongoDB
- 📖 **README.md** - Documentação geral do projeto

---

## 🎊 Parabéns!

Você configurou com sucesso um sistema **multi-tenant completo** na nuvem, 100% gratuito e profissional!

**Tempo total**: 15 minutos  
**Custo**: R$ 0,00  
**Resultado**: Sistema de gestão médica online 🚀

**Precisa de ajuda?** Consulte os guias detalhados ou entre em contato!

