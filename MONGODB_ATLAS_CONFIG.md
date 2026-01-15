# 🔧 Configuração Automática MongoDB Atlas

## 📋 Suas Credenciais
- **Email**: cristiano.s.santos@ba.estudante.senai.br
- **Senha**: 18042016

## 🚀 Passo 1: Acessar MongoDB Atlas

Execute este comando para abrir o Atlas automaticamente:

```powershell
Start-Process "https://cloud.mongodb.com/v2#/org/YOUR_ORG_ID/projects"
```

Ou acesse manualmente: https://cloud.mongodb.com

## 🔑 Passo 2: Login Automático

1. Faça login com:
   - Email: `cristiano.s.santos@ba.estudante.senai.br`
   - Senha: `18042016`

## 📦 Passo 3: Obter String de Conexão

### Método Rápido (Copiar URI):

1. No Atlas, clique em **"Database"** (menu lateral)
2. Clique no botão **"Connect"** do seu cluster
3. Escolha **"Connect your application"**
4. Copie a string de conexão que aparece (formato padrão):

```
mongodb+srv://USERNAME:<password>@cluster0.xxxxx.mongodb.net/prescrimed?retryWrites=true&w=majority
```

### ⚠️ Importante: Substituir Valores

A string copiada terá placeholders. Você precisa substituir:

1. `USERNAME` → seu usuário do banco (não é o email!)
2. `<password>` → senha do usuário do banco (não é a senha do Atlas!)

**ATENÇÃO**: O usuário do banco é diferente do login do Atlas!

## 🔐 Passo 4: Criar Usuário do Banco (se não existir)

Se você ainda não criou um usuário do banco:

1. No Atlas, vá em **"Database Access"** (menu lateral)
2. Clique em **"Add New Database User"**
3. Preencha:
   - **Username**: `prescrimed` (ou outro nome)
   - **Password**: `PrescriMed2024` (ou outra senha forte)
   - **Built-in Role**: `Atlas admin` ou `Read and write to any database`
4. Clique em **"Add User"**

## 🌐 Passo 5: Liberar IP

1. No Atlas, vá em **"Network Access"** (menu lateral)
2. Clique em **"Add IP Address"**
3. Escolha:
   - **"Allow Access from Anywhere"** → Clique em **"Confirm"**
   - Isso adiciona `0.0.0.0/0` (permite qualquer IP)

## ✅ Passo 6: Configurar no Sistema

Depois de obter a string de conexão correta:

```powershell
# Exemplo com usuário 'prescrimed' e senha 'PrescriMed2024'
$env:MONGODB_URI="mongodb+srv://prescrimed:PrescriMed2024@cluster0.xxxxx.mongodb.net/prescrimed?retryWrites=true&w=majority"

# Verificar se está correta
npm run verify:empresas

# Se funcionar, inicializar e popular
npm run init:db
npm run seed:cloud
```

## 🆘 Troubleshooting

### Erro: "querySrv ENOTFOUND"
- **Causa**: URL do cluster incorreta ou DNS não resolvendo
- **Solução**: 
  1. Verifique se copiou a URL completa do Atlas
  2. Certifique-se que o cluster está ativo (status "Active")
  3. Teste a conexão no Atlas clicando em "Connect" > "Connect with MongoDB Compass"

### Erro: "Authentication failed"
- **Causa**: Usuário ou senha incorretos
- **Solução**: 
  1. Verifique o usuário em "Database Access"
  2. Resete a senha do usuário se necessário
  3. Certifique-se de usar a senha do **usuário do banco**, não a senha do Atlas

### Erro: "IP not whitelisted"
- **Causa**: Seu IP não está liberado
- **Solução**: Adicione `0.0.0.0/0` em "Network Access"

## 🎯 Exemplo Completo

```powershell
# 1. Configurar variável (substitua os valores!)
$env:MONGODB_URI="mongodb+srv://prescrimed:PrescriMed2024@cluster0.abc123.mongodb.net/prescrimed?retryWrites=true&w=majority"

# 2. Testar conexão
npm run verify:empresas

# 3. Inicializar banco
npm run init:db

# 4. Popular dados
npm run seed:cloud

# 5. Verificar novamente
npm run verify:empresas
```

## 📱 Layout Responsivo Mantido

Todo o sistema continua com:
- ✅ Design mobile-first
- ✅ Grid responsivo
- ✅ Formulários adaptativos
- ✅ Touch targets ≥ 44px
- ✅ Sidebar com overlay em mobile

---

**Próximo passo**: Acesse o Atlas, copie a URI correta e execute os comandos acima.
