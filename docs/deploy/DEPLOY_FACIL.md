# 🚀 Deploy Simplificado - Prescrimed

## ✨ Configuração Ideal (100% Gratuito)

### **Frontend**: Netlify
- ✅ Deploy automático via Git
- ✅ HTTPS gratuito
- ✅ 100 GB bandwidth/mês
- ✅ URL: https://precrimed.netlify.app

### **Backend**: Render (Free Tier)
- ✅ 750 horas/mês grátis
- ✅ Sleep automático após inatividade
- ✅ Deploy via Git
- ✅ HTTPS incluído

### **Banco de Dados**: MongoDB Atlas (M0)
- ✅ 512 MB grátis
- ✅ Sem cartão de crédito
- ✅ Backup automático

---

## 🎯 Como Fazer Deploy em 3 Passos

### **PASSO 1: Configurar MongoDB Atlas** (5 minutos)

1. **Acesse**: https://cloud.mongodb.com/v2
   - Email: `cristiano.s.santos@ba.estudante.senai.br`
   - Senha: `18042016`

2. **Criar Cluster Gratuito**:
   - Clique em "Build a Database"
   - Escolha **M0 Free**
   - Região: **São Paulo (Brazil)** ou mais próxima
   - Nome do cluster: `Prescrimed`
   - Clique em "Create"

3. **Criar Usuário do Banco**:
   - Username: `prescrimed`
   - Password: `prescrimed123` (anote isso!)
   - Clique em "Create User"

4. **Permitir Acesso de Qualquer IP**:
   - IP Address: `0.0.0.0/0`
   - Description: "Acesso Render"
   - Clique em "Add Entry"

5. **Obter String de Conexão**:
   - Clique em "Connect"
   - Escolha "Connect your application"
   - Copie a string que se parece com:
   ```
   mongodb+srv://prescrimed:<password>@prescrimed.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - **IMPORTANTE**: Substitua `<password>` por `prescrimed123`

---

### **PASSO 2: Deploy do Backend no Render** (5 minutos)

1. **Acesse**: https://dashboard.render.com/register
   - Cadastre-se com GitHub

2. **Criar Web Service**:
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub: `cristiano-superacao/prescrimed`
   - Clique em "Connect"

3. **Configurar o Service**:
   - **Name**: `prescrimed-backend`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `prescrimed-system` (deixe vazio se o código está na raiz)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

4. **Adicionar Variáveis de Ambiente**:
   
   Clique em "Add Environment Variable" e adicione cada uma:

   ```bash
   PORT=10000
   ```
   ```bash
   NODE_ENV=production
   ```
   ```bash
   JWT_SECRET=seu_segredo_super_secreto_aqui_123456789
   ```
   ```bash
   FRONTEND_URL=https://precrimed.netlify.app
   ```
   ```bash
   CORS_ORIGIN=https://precrimed.netlify.app
   ```
   ```bash
   MONGODB_URI=mongodb+srv://prescrimed:prescrimed123@prescrimed.xxxxx.mongodb.net/prescrimed?retryWrites=true&w=majority
   ```
   
   **⚠️ IMPORTANTE**: Substitua o `MONGODB_URI` pela string que você copiou no Passo 1!

5. **Fazer Deploy**:
   - Clique em "Create Web Service"
   - Aguarde o deploy (5-10 minutos)
   - Copie a URL gerada (exemplo: `https://prescrimed-backend.onrender.com`)

---

### **PASSO 3: Atualizar e Fazer Deploy do Frontend** (2 minutos)

#### **Opção A: Deploy Automático (Recomendado)** 🎯

1. **Execute o script de deploy**:
   ```bash
   deploy.bat
   ```

2. **Cole a URL do backend** quando solicitado:
   ```
   https://prescrimed-backend.onrender.com
   ```

3. **Pronto!** O script vai:
   - Atualizar automaticamente o `.env.production`
   - Instalar dependências
   - Gerar o build
   - Fazer deploy no Netlify

#### **Opção B: Deploy Manual**

1. **Edite** `client/.env.production`:
   ```env
   VITE_API_URL=https://prescrimed-backend.onrender.com/api
   ```
   (Cole a URL do seu backend do Render)

2. **Gere o build**:
   ```bash
   cd client
   npm run build
   ```

3. **Faça deploy no Netlify**:
   ```bash
   netlify deploy --prod --dir=dist --site 7952a4ed-c83e-48bc-aeef-475f1167aeaf
   ```

---

## ✅ Testar o Sistema

1. **Backend**:
   ```
   https://prescrimed-backend.onrender.com/health
   ```
   Deve retornar: `{"status":"ok","message":"API funcionando!"}`

2. **Frontend**:
   ```
   https://precrimed.netlify.app
   ```
   - Faça login ou crie uma conta
   - Navegue pelas páginas
   - Verifique o Console do navegador (F12) para erros

---

## 🎉 Pronto!

Seu sistema está 100% no ar:

- 🌐 **Frontend**: https://precrimed.netlify.app
- 🔧 **Backend**: https://prescrimed-backend.onrender.com
- 💾 **Banco**: MongoDB Atlas

---

## 📝 Notas Importantes

### **⏰ Sobre o Render Free**:
- O backend "dorme" após 15 minutos sem uso
- Primeira requisição após dormir pode levar 30-60 segundos
- Totalmente normal para planos gratuitos

### **🔄 Atualizações Futuras**:
- **Backend**: Basta fazer `git push` - Render faz deploy automático
- **Frontend**: Execute `deploy.bat` ou faça push para o Git se conectou com Netlify

### **🐛 Troubleshooting**:

**Erro CORS?**
- Verifique se `CORS_ORIGIN` no Render está correto
- Deve ser exatamente: `https://precrimed.netlify.app`

**Backend não conecta ao MongoDB?**
- Verifique se `MONGODB_URI` está correto
- Certifique-se de ter substituído `<password>` pela senha real
- Verifique se o IP `0.0.0.0/0` está permitido no Atlas

**Frontend não encontra API?**
- Verifique `.env.production` tem a URL correta do Render
- Certifique-se de ter feito rebuild após alterar o .env

---

## 📞 Próximos Passos

Após fazer o deploy:

1. ✅ Teste todas as funcionalidades principais
2. ✅ Crie uma conta de super admin
3. ✅ Configure dados iniciais
4. ✅ Compartilhe a URL com usuários

---

**Dúvidas?** Siga o passo a passo cuidadosamente e tudo funcionará perfeitamente! 🚀
