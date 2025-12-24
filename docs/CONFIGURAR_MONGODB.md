# 🔧 Configuração Automática do MongoDB Atlas

## 📋 Credenciais da Conta
- **Login**: cristiano.s.santos@ba.estudante.senai.br
- **Senha**: 18042016

---

## ⚡ Configuração Rápida (5 minutos)

### 1️⃣ Acessar MongoDB Atlas

1. Acesse: https://cloud.mongodb.com/
2. Faça login com:
   - Email: `cristiano.s.santos@ba.estudante.senai.br`
   - Senha: `18042016`

### 2️⃣ Criar Cluster (se ainda não tiver)

1. Clique em **"Build a Database"** ou **"Create"**
2. Escolha **"Shared"** (FREE - M0)
3. Configurações:
   - **Cloud Provider**: AWS
   - **Region**: São Paulo (sa-east-1) ou US East (us-east-1)
   - **Cluster Tier**: M0 Sandbox (FREE)
   - **Cluster Name**: Cluster0 (padrão)
4. Clique em **"Create Cluster"** (pode levar 1-3 minutos)

### 3️⃣ Criar Database User

1. No menu lateral, clique em **"Database Access"**
2. Clique em **"Add New Database User"**
3. Preencha:
   - **Authentication Method**: Password
   - **Username**: `prescrimed`
   - **Password**: Crie uma senha forte (exemplo: `Prescri@2024!`)
   - **⚠️ IMPORTANTE**: Anote a senha! Você vai precisar dela
   - **Database User Privileges**: Selecione **"Atlas admin"** ou **"Read and write to any database"**
4. Clique em **"Add User"**

### 4️⃣ Configurar Acesso de Rede

1. No menu lateral, clique em **"Network Access"**
2. Clique em **"Add IP Address"**
3. Selecione **"Allow Access from Anywhere"**
   - Isso adiciona `0.0.0.0/0` automaticamente
4. Clique em **"Confirm"**

### 5️⃣ Obter Connection String

1. Volte em **"Database"** no menu lateral
2. No seu cluster (Cluster0), clique em **"Connect"**
3. Escolha **"Connect your application"**
4. Configurações:
   - **Driver**: Node.js
   - **Version**: 5.5 or later
5. Copie a Connection String (parecida com):
   ```
   mongodb+srv://prescrimed:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6️⃣ Atualizar arquivo .env

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua a linha `MONGODB_URI` pela Connection String copiada
3. **IMPORTANTE**: Faça as seguintes modificações:
   - Substitua `<password>` pela senha que você criou no passo 3
   - Adicione `/prescrimed` antes do `?`
   
**Exemplo:**

❌ **ERRADO:**
```env
MONGODB_URI=mongodb+srv://prescrimed:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

✅ **CORRETO:**
```env
MONGODB_URI=mongodb+srv://prescrimed:Prescri@2024!@cluster0.hkpqy.mongodb.net/prescrimed?retryWrites=true&w=majority
```

### 7️⃣ Testar Conexão

1. Salve o arquivo `.env`
2. No terminal, execute:
   ```bash
   npm run dev
   ```
3. Se tudo estiver correto, você verá:
   ```
   ✅ MongoDB conectado com sucesso!
   🚀 Servidor rodando na porta 5000
   ```

---

## 🔍 Verificar Configuração

### No MongoDB Atlas:

1. Acesse **"Database"** → Cluster0
2. Clique em **"Browse Collections"**
3. Você deverá ver o banco **"prescrimed"**
4. Após criar a primeira empresa, verá as collections:
   - `empresas`
   - `usuarios`
   - `pacientes`
   - `prescricoes`

### No Sistema:

1. Acesse http://localhost:5173
2. Clique em **"Cadastrar Empresa"**
3. Preencha os dados:
   - Nome da Empresa: `Clínica Teste`
   - CNPJ: `12.345.678/0001-90`
   - Nome do Admin: `Seu Nome`
   - Email: `admin@teste.com`
   - Senha: `123456`
4. Se o cadastro funcionar, MongoDB está configurado! 🎉

---

## ❌ Problemas Comuns

### Erro: "querySrv ENOTFOUND"
**Solução**: 
- Verifique se a Connection String está correta
- Confirme que a URL do cluster está correta (cluster0.xxxxx)
- Verifique sua conexão com a internet

### Erro: "Authentication failed"
**Solução**:
- Verifique se a senha no .env está correta
- Confirme que o usuário `prescrimed` foi criado
- Verifique se não há caracteres especiais não escapados na senha

### Erro: "Connection timeout"
**Solução**:
- Verifique se configurou Network Access (0.0.0.0/0)
- Aguarde 1-2 minutos após adicionar o IP
- Verifique seu firewall/antivírus

### Banco de dados não aparece
**Solução**:
- É normal! O banco só aparece após a primeira inserção
- Cadastre uma empresa para criar o banco automaticamente

---

## 📝 Connection String Exemplo

Sua Connection String final deve ficar assim:

```env
MONGODB_URI=mongodb+srv://prescrimed:SUA_SENHA@cluster0.xxxxx.mongodb.net/prescrimed?retryWrites=true&w=majority
```

**Componentes:**
- `mongodb+srv://` - Protocolo
- `prescrimed` - Username do database user
- `SUA_SENHA` - Senha do database user
- `cluster0.xxxxx.mongodb.net` - URL do cluster
- `/prescrimed` - Nome do banco de dados
- `?retryWrites=true&w=majority` - Opções de conexão

---

## ✅ Checklist de Configuração

- [ ] Fiz login no MongoDB Atlas
- [ ] Criei um cluster (ou já tinha um)
- [ ] Criei o database user `prescrimed` com senha
- [ ] Configurei Network Access para 0.0.0.0/0
- [ ] Copiei a Connection String
- [ ] Substituí `<password>` pela senha real
- [ ] Adicionei `/prescrimed` na Connection String
- [ ] Colei no arquivo .env
- [ ] Testei com `npm run dev`
- [ ] Cadastrei uma empresa de teste

---

## 📞 Precisa de Ajuda?

Se ainda tiver problemas:

1. Verifique se seguiu todos os passos acima
2. Consulte a documentação oficial: https://www.mongodb.com/docs/atlas/
3. Abra uma issue no GitHub: https://github.com/cristiano-superacao/prescrimed/issues

---

## 🎉 Pronto!

Após seguir estes passos, seu sistema estará 100% funcional com MongoDB Atlas na nuvem! 🚀

**Próximos passos:**
1. Cadastre sua empresa
2. Crie usuários
3. Adicione pacientes
4. Comece a usar o sistema!
