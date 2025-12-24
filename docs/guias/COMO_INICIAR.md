# 🚀 INICIAR O SISTEMA - GUIA RÁPIDO

## ⚠️ ATENÇÃO: O MongoDB precisa ser configurado primeiro!

Siga este guia passo a passo para configurar e iniciar o sistema.

---

## 📋 PASSO 1: Configurar MongoDB Atlas (OBRIGATÓRIO)

### 1️⃣ Fazer Login no MongoDB Atlas

1. Acesse: **https://cloud.mongodb.com/**
2. Faça login com:
   - **Email**: `cristiano.s.santos@ba.estudante.senai.br`
   - **Senha**: `18042016`

### 2️⃣ Criar Cluster (se não tiver)

1. Após fazer login, procure por **"Create"** ou **"Build a Database"**
2. Escolha **"Shared"** (GRÁTIS - M0 Sandbox)
3. Configurações:
   - **Provider**: AWS
   - **Region**: São Paulo (sa-east-1) OU US East (us-east-1)
   - **Cluster Name**: Deixe como **Cluster0**
4. Clique em **"Create Cluster"**
5. **Aguarde 3-5 minutos** enquanto o cluster é criado

### 3️⃣ Criar Database User

1. No menu lateral esquerdo, clique em **"Database Access"**
2. Clique em **"+ ADD NEW DATABASE USER"**
3. Preencha:
   - **Authentication Method**: Password (já selecionado)
   - **Username**: `prescrimed`
   - **Password**: Clique em **"Autogenerate Secure Password"** OU crie uma senha
     - **💡 Sugestão**: `Prescri@2024`
     - **⚠️ IMPORTANTE**: Copie e guarde esta senha! Você vai precisar
   - **Database User Privileges**: Selecione **"Built-in Role"** → **"Atlas admin"**
4. Clique em **"Add User"**

### 4️⃣ Liberar Acesso de Rede

1. No menu lateral esquerdo, clique em **"Network Access"**
2. Clique em **"+ ADD IP ADDRESS"**
3. Clique em **"ALLOW ACCESS FROM ANYWHERE"**
   - Isso adiciona automaticamente `0.0.0.0/0`
4. Clique em **"Confirm"**
5. **Aguarde 1-2 minutos** para ativar

### 5️⃣ Obter Connection String

1. No menu lateral, clique em **"Database"**
2. No seu cluster **Cluster0**, clique no botão **"Connect"**
3. Escolha **"Connect your application"**
4. Configuração:
   - **Driver**: Node.js
   - **Version**: 5.5 or later (já selecionado)
5. **Copie** a Connection String (será algo como):
   ```
   mongodb+srv://prescrimed:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6️⃣ Atualizar arquivo .env

1. Abra o arquivo **`.env`** na raiz do projeto PrescrIMed
2. Localize a linha:
   ```env
   MONGODB_URI=mongodb+srv://prescrimed:<SUA_SENHA>@cluster0.xxxxx.mongodb.net/prescrimed?retryWrites=true&w=majority
   ```
3. **Substitua toda essa linha** pela Connection String que você copiou
4. **IMPORTANTE**: Faça 2 modificações:
   - Substitua `<password>` pela senha que você criou no passo 3
   - Adicione `/prescrimed` ANTES do `?`

**Exemplo CORRETO:**
```env
MONGODB_URI=mongodb+srv://prescrimed:Prescri@2024@cluster0.abc123.mongodb.net/prescrimed?retryWrites=true&w=majority
```

❌ **ERRADO** (faltando /prescrimed):
```env
MONGODB_URI=mongodb+srv://prescrimed:Prescri@2024@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

5. **Salve o arquivo** `.env`

---

## 📦 PASSO 2: Instalar Dependências (Só uma vez)

Se ainda não instalou, execute:

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

---

## ▶️ PASSO 3: Iniciar o Sistema

### Opção 1: Automático (Recomendado)

```bash
.\start.bat
```

Este script inicia automaticamente backend e frontend em terminais separados.

### Opção 2: Manual (2 terminais)

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

---

## ✅ PASSO 4: Verificar se está funcionando

### Backend (Terminal 1)

Você deve ver:
```
✅ MongoDB conectado com sucesso!
🚀 Servidor rodando na porta 5000
📚 Ambiente: development
🔗 API: http://localhost:5000
```

❌ **Se aparecer erro**: `querySrv ENOTFOUND` ou `Authentication failed`
- Verifique se a Connection String está correta no `.env`
- Verifique se a senha está correta
- Verifique se adicionou `/prescrimed` antes do `?`
- Aguarde 1-2 minutos após configurar Network Access

### Frontend (Terminal 2)

Você deve ver:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🌐 PASSO 5: Acessar o Sistema

1. Abra seu navegador em: **http://localhost:5173**
2. Você verá a página de login
3. Clique em **"Cadastrar Empresa"**
4. Preencha:
   - **Nome da Empresa**: Ex: `Clínica Teste`
   - **CNPJ**: Ex: `12.345.678/0001-90` (opcional)
   - **Nome**: Seu nome
   - **Email**: Ex: `admin@teste.com`
   - **Telefone**: Ex: `(11) 98765-4321`
   - **Senha**: Ex: `123456` (mínimo 6 caracteres)
5. Clique em **"Cadastrar"**
6. **Pronto!** Você será automaticamente o **ADMINISTRADOR** 🎉

---

## 🎯 O Que Fazer Agora?

### Como Administrador, você pode:

1. **Criar Usuários**
   - Vá em **"Usuários"** no menu
   - Clique em **"Novo Usuário"**
   - Defina permissões (dashboard, pacientes, prescrições, etc.)

2. **Cadastrar Pacientes**
   - Vá em **"Pacientes"**
   - Clique em **"Novo Paciente"**
   - Preencha os dados médicos

3. **Criar Prescrições**
   - Vá em **"Prescrições"**
   - Clique em **"Nova Prescrição"**
   - Selecione o paciente
   - Adicione medicamentos

4. **Ver Estatísticas**
   - O **Dashboard** mostra:
     - Total de pacientes
     - Total de prescrições
     - Usuários cadastrados
     - Dados recentes

---

## ❌ Problemas Comuns

### Erro: "querySrv ENOTFOUND"
**Causa**: Connection String incorreta ou problema de rede
**Solução**:
1. Verifique o `.env` - a URL do cluster está correta?
2. Verifique sua internet
3. No MongoDB Atlas, confirme que Network Access está configurado (0.0.0.0/0)

### Erro: "Authentication failed"
**Causa**: Senha incorreta no `.env`
**Solução**:
1. Verifique se a senha no `.env` é exatamente a mesma que você criou
2. Se a senha tiver caracteres especiais como `@`, `#`, `$`, etc., pode precisar codificá-los

### Erro: "npm: command not found" ou "npm não reconhecido"
**Causa**: Node.js não está instalado
**Solução**:
1. Baixe e instale o Node.js: https://nodejs.org/
2. Escolha a versão LTS (recomendada)
3. Reinicie o terminal após instalar

### Frontend não abre
**Causa**: Porta 5173 em uso ou dependências não instaladas
**Solução**:
```bash
cd client
npm install
npm run dev
```

### Backend não conecta ao MongoDB
**Causa**: MongoDB Atlas não configurado ou `.env` incorreto
**Solução**: Refaça os passos 1-6 do MongoDB Atlas acima

---

## 📞 Precisa de Ajuda?

1. **Documentação completa**: Veja o arquivo `CONFIGURAR_MONGODB.md`
2. **API**: Veja o arquivo `swagger.yaml` para detalhes da API
3. **Issues**: https://github.com/cristiano-superacao/prescrimed/issues
4. **Email**: cristiano.s.santos@ba.estudante.senai.br

---

## ✅ Checklist Final

Antes de considerar que está tudo funcionando, verifique:

- [ ] MongoDB Atlas configurado
- [ ] Database User criado
- [ ] Network Access liberado (0.0.0.0/0)
- [ ] Connection String copiada
- [ ] Arquivo `.env` atualizado corretamente
- [ ] `/prescrimed` adicionado na Connection String
- [ ] `npm install` executado no backend
- [ ] `npm install` executado no frontend
- [ ] Backend iniciado sem erros
- [ ] Frontend iniciado em http://localhost:5173
- [ ] Empresa cadastrada com sucesso
- [ ] Login funcionando

---

## 🎉 Tudo Certo?

Se você conseguiu:
1. ✅ Ver "MongoDB conectado com sucesso!" no backend
2. ✅ Acessar http://localhost:5173
3. ✅ Cadastrar uma empresa
4. ✅ Fazer login

**Parabéns! O sistema está 100% funcional!** 🚀

Agora você pode:
- Criar usuários
- Cadastrar pacientes
- Emitir prescrições
- Gerenciar sua clínica

---

**Desenvolvido com ❤️ para profissionais da saúde**
