# 🚀 Guia Rápido de Instalação - Prescrimed System

## Passo 1: Configurar MongoDB Atlas (Banco de Dados na Nuvem)

1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Clique em "Build a Database"
5. Escolha o plano FREE (M0)
6. Escolha a região mais próxima (ex: São Paulo)
7. Clique em "Create"

### Configurar Acesso:

1. Em "Security" > "Database Access":
   - Clique em "Add New Database User"
   - Username: `prescrimed`
   - Password: Gere uma senha forte (salve-a!)
   - Clique em "Add User"

2. Em "Security" > "Network Access":
   - Clique em "Add IP Address"
   - Clique em "Allow Access from Anywhere" (0.0.0.0/0)
   - Clique em "Confirm"

3. Em "Database" > "Connect":
   - Clique em "Connect your application"
   - Copie a Connection String
   - Substitua `<password>` pela senha criada

## Passo 2: Instalar o Sistema

### 2.1 Instalar Node.js

Se ainda não tem o Node.js instalado:
1. Acesse: https://nodejs.org
2. Baixe a versão LTS (recomendada)
3. Instale seguindo as instruções

Verifique a instalação:
```powershell
node --version
npm --version
```

### 2.2 Configurar o Backend

1. Abra o PowerShell na pasta do projeto
2. Instale as dependências:

```powershell
cd prescrimed-system
npm install
```

3. Crie o arquivo `.env` na raiz com o seguinte conteúdo:

```env
PORT=5000
MONGODB_URI=sua_connection_string_do_mongodb_atlas
JWT_SECRET=prescrimed_secret_key_2024_super_seguro
NODE_ENV=development
```

**IMPORTANTE:** Substitua `sua_connection_string_do_mongodb_atlas` pela string copiada do MongoDB Atlas!

Exemplo:
```env
MONGODB_URI=mongodb+srv://prescrimed:SuaSenha@cluster0.xxxxx.mongodb.net/prescrimed?retryWrites=true&w=majority
```

### 2.3 Configurar o Frontend

1. Entre na pasta do frontend:

```powershell
cd frontend
npm install
```

2. Crie o arquivo `.env` dentro da pasta `frontend`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Passo 3: Iniciar o Sistema

### Opção 1: Iniciar Backend e Frontend Separadamente

**Terminal 1 - Backend:**
```powershell
cd prescrimed-system
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd prescrimed-system/frontend
npm run dev
```

### Opção 2: Iniciar Tudo de Uma Vez

```powershell
cd prescrimed-system
npm run dev:all
```

## Passo 4: Acessar o Sistema

1. Abra o navegador
2. Acesse: `http://localhost:5173`
3. Faça o cadastro da sua empresa
4. Pronto! Você é o administrador 🎉

## 🆘 Problemas Comuns

### Erro ao conectar no MongoDB

**Erro:** `MongoServerError: bad auth`
- Verifique se a senha no `.env` está correta
- Verifique se substituiu `<password>` pela senha real

**Erro:** `MongooseServerSelectionError`
- Verifique se liberou o IP no Network Access
- Aguarde alguns minutos para as configurações serem aplicadas

### Porta já em uso

**Erro:** `Port 5000 is already in use`
- Mude a porta no `.env`: `PORT=3001`
- Ou feche o processo que está usando a porta 5000

### Erro ao instalar dependências

```powershell
# Limpe o cache do npm
npm cache clean --force

# Tente novamente
npm install
```

## 📝 Primeiro Acesso

1. Clique em "Cadastrar Empresa"
2. Preencha:
   - Nome da Empresa
   - CNPJ (opcional)
   - Seu Nome
   - Seu E-mail
   - Senha (mínimo 6 caracteres)
3. Clique em "Criar Conta"
4. Você será automaticamente o administrador!

## 👥 Criar Usuários

Como administrador:
1. Acesse o menu "Usuários"
2. Clique em "Novo Usuário"
3. Preencha os dados
4. Selecione as permissões
5. Clique em "Criar Usuário"

## 🎯 Próximos Passos

1. Configure seu perfil em "Configurações"
2. Cadastre seus primeiros pacientes
3. Crie prescrições
4. Explore o dashboard

## 🚀 Deploy em Produção

### Backend (Render.com - Gratuito)

1. Crie conta no Render.com
2. New > Web Service
3. Conecte seu repositório GitHub
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Adicione as variáveis de ambiente

### Frontend (Vercel - Gratuito)

1. Crie conta no Vercel.com
2. Import Project
3. Conecte seu repositório
4. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
5. Adicione variável: `VITE_API_URL=https://seu-backend.onrender.com/api`

## 📞 Suporte

Precisa de ajuda? Entre em contato:
- Email: suporte@prescrimed.com.br
- WhatsApp: (11) 99999-9999

---

**Boa sorte! 🚀**