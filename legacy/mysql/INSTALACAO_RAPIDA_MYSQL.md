# Guia Rapido - Instalacao MySQL

## Siga estes passos no instalador que esta aberto:

### 1. Escolha o Tipo de Setup
- Selecione: **Developer Default** (recomendado)
- Ou: **Server only** (apenas o servidor)

### 2. Check Requirements
- Clique em **Execute** para instalar pre-requisitos
- Aguarde a instalacao
- Clique em **Next**

### 3. Installation
- Clique em **Execute** para iniciar a instalacao
- Aguarde todos os produtos serem instalados
- Clique em **Next**

### 4. Product Configuration
- MySQL Server sera configurado
- Clique em **Next**

### 5. Type and Networking
- Config Type: **Development Computer**
- Port: **3306** (padrao)
- Clique em **Next**

### 6. Authentication Method
- Selecione: **Use Strong Password Encryption**
- Clique em **Next**

### 7. Accounts and Roles
- Root Password: **deixe em branco** ou defina uma senha simples
- (Se definir senha, anote para usar depois)
- Clique em **Next**

### 8. Windows Service
- Configure MySQL Server as Windows Service: **MARCAR**
- Service Name: **MySQL80**
- Start the MySQL Server at System Startup: **MARCAR**
- Clique em **Next**

### 9. Apply Configuration
- Clique em **Execute**
- Aguarde a configuracao ser aplicada
- Clique em **Finish**

### 10. Product Configuration (continua)
- Clique em **Next** nas proximas telas
- Clique em **Finish** na ultima tela

## Apos a instalacao concluir:

Execute no PowerShell:

```powershell
Get-Service MySQL80 | Start-Service
node setup-mysql.js
npm run dev
```

O sistema ira conectar automaticamente ao MySQL!
