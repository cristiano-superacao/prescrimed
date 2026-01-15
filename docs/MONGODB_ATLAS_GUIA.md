# 🚀 Guia Completo: MongoDB Atlas - PrescrIMed

> **Login:** cristiano.s.santos@ba.estudante.senai.br  
> **Senha:** 18042016

---

## 📋 Índice

1. [Acesso Rápido](#-acesso-rápido)
2. [Criar Cluster](#-passo-1-criar-cluster-grátis)
3. [Configurar Usuário](#-passo-2-criar-usuário-do-banco)
4. [Liberar Rede](#-passo-3-liberar-acesso-de-rede)
5. [Obter Connection String](#-passo-4-obter-connection-string)
6. [Configurar Sistema](#-passo-5-configurar-o-sistema)
7. [Testar Sistema](#-passo-6-testar-o-sistema)

---

## 🔗 Acesso Rápido

**[👉 CLIQUE AQUI PARA ABRIR MONGODB ATLAS](https://cloud.mongodb.com/v2)**

---

## 📦 PASSO 1: Criar Cluster (Grátis)

### 1.1 Após fazer login, clique em:
```
"Build a Database" ou "Create"
```

### 1.2 Escolha o plano FREE:
```
✅ M0 FREE
- 512 MB de armazenamento
- Shared RAM
- GRÁTIS para sempre
```

### 1.3 Configurações do Cluster:
```yaml
Provider: AWS (recomendado)
Região: São Paulo (sa-east-1) ou Virginia (us-east-1)
Nome: Cluster0 (deixe o padrão)
```

### 1.4 Clique em:
```
"Create Cluster" → Aguarde 3-5 minutos
```

---

## 👤 PASSO 2: Criar Usuário do Banco

### 2.1 No menu lateral, clique em:
```
"Database Access" (sob SECURITY)
```

### 2.2 Clique em:
```
"+ ADD NEW DATABASE USER"
```

### 2.3 Preencha:
```yaml
Authentication Method: Password
Username: prescrimed
Password: Prescrimed2024!
  
Database User Privileges:
  ✅ Built-in Role: Atlas admin
```

### 2.4 Clique em:
```
"Add User"
```

> **⚠️ IMPORTANTE:** Anote a senha: `Prescrimed2024!`

---

## 🌐 PASSO 3: Liberar Acesso de Rede

### 3.1 No menu lateral, clique em:
```
"Network Access" (sob SECURITY)
```

### 3.2 Clique em:
```
"+ ADD IP ADDRESS"
```

### 3.3 Escolha:
```
✅ "Allow Access from Anywhere"
```

Isso adiciona: `0.0.0.0/0` (permite qualquer IP)

### 3.4 Clique em:
```
"Confirm"
```

---

## 🔌 PASSO 4: Obter Connection String

### 4.1 Volte para "Database" no menu lateral

### 4.2 Clique no botão:
```
"Connect" (ao lado do Cluster0)
```

### 4.3 Escolha:
```
"Connect your application"
```

### 4.4 Configurações:
```yaml
Driver: Node.js
Version: 5.5 or later (ou a mais recente)
```

### 4.5 Copie a Connection String:
```
mongodb+srv://prescrimed:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 4.6 Modifique a string:

**ANTES:**
```
mongodb+srv://prescrimed:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**DEPOIS:**
```
mongodb+srv://prescrimed:Prescrimed2024!@cluster0.xxxxx.mongodb.net/prescrimed?retryWrites=true&w=majority
```

**Mudanças:**
1. ✅ Substituir `<password>` por `Prescrimed2024!`
2. ✅ Adicionar `/prescrimed` antes do `?`

---

## ⚙️ PASSO 5: Configurar o Sistema

### 5.1 Abra o arquivo `.env`:
```
prescrimed-system/.env
```

### 5.2 Localize a linha:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/prescrimed
```

### 5.3 Substitua por sua Connection String:
```env
MONGODB_URI=mongodb+srv://prescrimed:Prescrimed2024!@cluster0.xxxxx.mongodb.net/prescrimed?retryWrites=true&w=majority
```

> **⚠️ Substitua `xxxxx` pelo código do seu cluster!**

### 5.4 Salve o arquivo (Ctrl+S)

### 5.5 Reinicie os servidores:

**Pare os servidores:**
- Pressione `Ctrl+C` nos terminais ou feche-os

**Inicie novamente:**
```powershell
# Terminal 1 - Backend
cd "c:\Users\Superação\Desktop\Sistemas\prescrimed-system"
npm run dev

# Terminal 2 - Frontend
cd "c:\Users\Superação\Desktop\Sistemas\prescrimed-system\client"
npm run dev
```

---

## ✅ PASSO 6: Testar o Sistema

### 6.1 Acesse:
```
http://localhost:5173
```

### 6.2 Registre uma nova empresa:
```yaml
Nome da Empresa: Clínica Teste
CNPJ: 12.345.678/0001-99
Nome: Dr. João Silva
E-mail: joao@clinica.com
Senha: 123456
```

### 6.3 Verifique no MongoDB Atlas:

1. Acesse: **Database → Browse Collections**
2. Você verá:
   ```
   prescrimed
   ├── empresas (1 documento)
   └── usuarios (1 documento)
   ```

### 6.4 Teste as funcionalidades:
```
✅ Dashboard
✅ Cadastrar Paciente
✅ Criar Prescrição
✅ Gerenciar Usuários (admin)
✅ Configurações
```

---

## 🎯 Connection String - Formato Final

```env
MONGODB_URI=mongodb+srv://prescrimed:Prescrimed2024!@cluster0.XXXXX.mongodb.net/prescrimed?retryWrites=true&w=majority
```

### Partes da String:
```yaml
Protocolo: mongodb+srv://
Usuário: prescrimed
Senha: Prescrimed2024!
Host: cluster0.XXXXX.mongodb.net
Database: /prescrimed
Opções: ?retryWrites=true&w=majority
```

---

## 🆘 Troubleshooting

### Erro: "MongoServerError: bad auth"
```
❌ Senha incorreta
✅ Verifique se a senha está correta: Prescrimed2024!
✅ Sem espaços extras na Connection String
```

### Erro: "MongoNetworkError"
```
❌ IP não autorizado
✅ Vá em Network Access → Add 0.0.0.0/0
```

### Erro: "Database not found"
```
❌ Faltou adicionar /prescrimed na string
✅ Deve ser: @cluster0.xxxxx.mongodb.net/prescrimed?
```

### Backend não conecta:
```bash
# Verifique o .env
cat .env | Select-String "MONGODB_URI"

# Deve retornar a Connection String do Atlas
```

---

## 📊 Monitoramento

### Verificar conexões ativas:
1. MongoDB Atlas → Database
2. Clique em "Metrics"
3. Veja:
   - Connections
   - Operations
   - Network

---

## 🔒 Segurança - Produção

### Para ambiente de produção:

1. **IP Whitelist específico:**
   ```
   Network Access → Remover 0.0.0.0/0
   Network Access → Adicionar IP do servidor
   ```

2. **Senha forte:**
   ```
   Database Access → Editar usuário
   Gerar senha aleatória forte
   ```

3. **Variável de ambiente:**
   ```bash
   # Não comitar .env no Git
   echo ".env" >> .gitignore
   ```

---

## 📚 Recursos Adicionais

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Connection String Reference](https://docs.mongodb.com/manual/reference/connection-string/)
- [Node.js Driver](https://docs.mongodb.com/drivers/node/)

---

## ✨ Sistema Pronto!

Após seguir todos os passos:

```
✅ MongoDB Atlas configurado
✅ Cluster rodando (grátis)
✅ Usuário criado
✅ Rede liberada
✅ Sistema conectado
✅ Pronto para usar!
```

---

**🎉 Seu sistema PrescrIMed está rodando em nuvem!**

> Para suporte: Consulte o arquivo `README.md`
