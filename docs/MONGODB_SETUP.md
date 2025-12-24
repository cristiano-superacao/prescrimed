# Configuração do MongoDB

Você tem duas opções para usar o MongoDB com o sistema PrescrIMed:

## Opção 1: MongoDB Atlas (Recomendado - Nuvem Gratuito)

### Vantagens:
- ✅ Gratuito para sempre (512 MB)
- ✅ Não precisa instalar nada
- ✅ Backup automático
- ✅ Acessível de qualquer lugar
- ✅ Configuração rápida (5 minutos)

### Passos:

1. **Criar conta no MongoDB Atlas:**
   - Acesse: https://www.mongodb.com/cloud/atlas/register
   - Clique em "Sign Up" e crie sua conta (pode usar Google/GitHub)

2. **Criar um Cluster Gratuito:**
   - Após login, clique em "Build a Database"
   - Escolha o plano **FREE** (M0 Sandbox)
   - Selecione a região mais próxima (ex: São Paulo ou US East)
   - Clique em "Create Cluster"

3. **Configurar Acesso:**
   - Na tela de "Security Quickstart":
     - **Username**: Crie um usuário (ex: `prescrimed`)
     - **Password**: Crie uma senha forte e **ANOTE**
     - Clique em "Create User"
   
   - Em "Network Access":
     - Clique em "Add IP Address"
     - Clique em "Allow Access from Anywhere" (0.0.0.0/0)
     - Clique em "Confirm"

4. **Obter Connection String:**
   - Volte para "Database"
   - Clique em "Connect" no seu cluster
   - Escolha "Connect your application"
   - Copie a connection string (algo como):
     ```
     mongodb+srv://prescrimed:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - **IMPORTANTE**: Substitua `<password>` pela senha que você criou

5. **Configurar no Sistema:**
   - Abra o arquivo `.env` na raiz do projeto
   - Substitua a linha `MONGODB_URI=` pela sua connection string:
     ```
     MONGODB_URI=mongodb+srv://prescrimed:SUA_SENHA_AQUI@cluster0.xxxxx.mongodb.net/prescrimed?retryWrites=true&w=majority
     ```
   - **Não esqueça** de adicionar `/prescrimed` antes do `?` na URL

---

## Opção 2: MongoDB Local (Instalar no Windows)

### Vantagens:
- ✅ Funciona offline
- ✅ Mais controle sobre os dados

### Desvantagens:
- ❌ Precisa instalar e configurar
- ❌ Consome recursos do computador
- ❌ Apenas acessível localmente

### Passos:

1. **Baixar MongoDB Community Server:**
   - Acesse: https://www.mongodb.com/try/download/community
   - Selecione:
     - Version: Latest
     - Platform: Windows
     - Package: MSI
   - Clique em "Download"

2. **Instalar MongoDB:**
   - Execute o arquivo baixado (.msi)
   - Escolha "Complete" installation
   - **IMPORTANTE**: Na tela "Service Configuration":
     - ✅ Marque "Install MongoDB as a Service"
     - ✅ Service Name: MongoDB
     - ✅ Run service as Network Service user
   - Clique em "Next" até finalizar

3. **Verificar Instalação:**
   - Abra PowerShell e execute:
     ```powershell
     mongod --version
     ```
   - Se aparecer a versão, está instalado!

4. **Configurar no Sistema:**
   - O arquivo `.env` já está configurado para MongoDB local:
     ```
     MONGODB_URI=mongodb://localhost:27017/prescrimed
     ```
   - Não precisa alterar nada!

---

## Testar Conexão

Depois de configurar (Atlas ou Local), execute:

```powershell
npm run dev
```

Se aparecer "✅ MongoDB conectado com sucesso!", está tudo certo!

---

## Problemas Comuns

### MongoDB Atlas:
- **Erro de conexão**: Verifique se liberou o IP (0.0.0.0/0) em Network Access
- **Erro de autenticação**: Verifique se a senha está correta na connection string
- **String malformada**: Certifique-se de ter `/prescrimed` antes do `?`

### MongoDB Local:
- **mongod não reconhecido**: O MongoDB não foi instalado ou não está no PATH
- **Erro de conexão**: Verifique se o serviço MongoDB está rodando:
  ```powershell
  Get-Service MongoDB
  ```
- **Iniciar serviço manualmente**:
  ```powershell
  Start-Service MongoDB
  ```

---

## Recomendação

Para testes locais e desenvolvimento, **MongoDB Atlas** é a melhor opção:
- Rápido de configurar (5 minutos)
- Gratuito para sempre
- Sem instalações
- Funciona em qualquer computador

Só use MongoDB Local se:
- Precisar trabalhar offline frequentemente
- Quiser total controle sobre os dados
- Tiver conhecimento técnico avançado
