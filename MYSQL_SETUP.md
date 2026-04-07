# 🔧 Guia de Configuração do MySQL

> Documento legado. O projeto atual foi consolidado em PostgreSQL. Use este guia apenas como referência histórica.

## ⚠️ Status Atual

O MySQL foi instalado via winget, mas esta não é mais a trilha principal do projeto.

**Banco de dados atual do projeto:** PostgreSQL

---

## 🚀 Opção 1: Configurar MySQL Manualmente (Recomendado)

### 1. Desinstalar e Reinstalar MySQL Completo

```powershell
# Desinstalar versão atual
winget uninstall Oracle.MySQL

# Baixar instalador completo
Start-Process "https://dev.mysql.com/downloads/installer/"
```

### 2. Instalar com MySQL Installer

1. Download do instalador MSI (mysql-installer-community)
2. Executar o instalador
3. Escolher **"Developer Default"** ou **"Server only"**
4. Durante a configuração:
   - Tipo: Development Computer
   - Conectividade: Porta 3306
   - Autenticação: Use Strong Password Encryption
   - Senha root: (deixe em branco ou defina uma senha)
   - Windows Service: ✅ Ativar
   - Nome do serviço: MySQL80

5. Concluir instalação

---

## 🔧 Opção 2: Usar XAMPP (Mais Fácil)

XAMPP inclui MySQL com interface gráfica:

```powershell
winget install --id=ApacheFriends.Xampp -e
```

Depois de instalar:
1. Abrir XAMPP Control Panel
2. Clicar em "Start" no MySQL
3. Clicar em "Admin" para abrir phpMyAdmin
4. Criar banco de dados "prescrimed"

Atualizar .env:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=prescrimed
```

---

## 🐳 Opção 3: Docker (Profissional)

### Instalar Docker Desktop

```powershell
winget install Docker.DockerDesktop
```

### Criar container MySQL

```powershell
docker run --name mysql-prescrimed `
  -e MYSQL_ROOT_PASSWORD=root `
  -e MYSQL_DATABASE=prescrimed `
  -p 3306:3306 `
  -d mysql:8.0
```

Atualizar .env:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=prescrimed
```

---

## ✅ Verificar Instalação

Após configurar, verificar se está rodando:

```powershell
# Verificar serviço
Get-Service *mysql*

# Testar conexão
mysql -u root -p
```

---

## 🔄 Migrar de SQLite para MySQL

### 1. Com MySQL rodando, atualizar .env:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=sua_senha
MYSQL_DATABASE=prescrimed
```

### 2. Criar banco de dados:

```powershell
node setup-mysql.js
```

### 3. Reiniciar servidor:

```powershell
npm run dev
```

### 4. Recriar usuário admin:

```powershell
node create-local-admin.js
```

**As tabelas serão criadas automaticamente pelo Sequelize!**

---

## 📊 Por que Usar MySQL?

### SQLite (Atual)
✅ Sem instalação  
✅ Fácil de usar  
✅ Perfeito para desenvolvimento  
❌ Não recomendado para produção com múltiplos acessos  

### MySQL
✅ Melhor performance  
✅ Suporta múltiplos usuários simultâneos  
✅ Ideal para produção  
✅ Backups mais robustos  
❌ Requer instalação e configuração  

---

## 🎯 Recomendação

**Para desenvolvimento local:** Continue usando SQLite (atual)  
**Para produção:** Configure MySQL ou use PostgreSQL no Railway

O sistema está **100% funcional com SQLite**. A migração para MySQL é opcional e pode ser feita quando necessário.

---

## 🆘 Problemas Comuns

### "Erro ao conectar no banco de dados"
- Verifique se o serviço MySQL está rodando
- Confirme usuário e senha no .env
- Teste conexão: `mysql -u root -p`

### "Porta 3306 em uso"
- Outro serviço está usando a porta
- Verificar: `netstat -ano | findstr :3306`
- Matar processo ou mudar porta no .env

### "Access denied for user 'root'"
- Senha incorreta no .env
- Redefinir senha do MySQL

---

**Sistema funcionando com SQLite: ✅**  
**MySQL: Opcional para produção**
