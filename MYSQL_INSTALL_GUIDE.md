# 📋 Guia de Instalação do MySQL Server no Windows

## Opção 1: Instalação Manual (Recomendado)

1. **Baixar MySQL Installer:**
   - Acesse: https://dev.mysql.com/downloads/installer/
   - Clique em "Download" no MySQL Installer (Windows x86, 32-bit)
   - Escolha "No thanks, just start my download"

2. **Instalar MySQL:**
   - Execute o arquivo baixado (mysql-installer-community-X.X.XX.X.msi)
   - Escolha "Server only" ou "Developer Default"
   - Configure a senha root (pode deixar em branco para desenvolvimento local)
   - Mantenha todas as configurações padrão
   - Aguarde a instalação concluir

3. **Verificar instalação:**
   ```powershell
   mysql --version
   ```

## Opção 2: Via Chocolatey (Requer Chocolatey instalado)

```powershell
choco install mysql -y
```

## Opção 3: Via winget (Windows 10/11)

```powershell
winget install Oracle.MySQL
```

## Após a instalação:

1. **Abrir MySQL Command Line Client** (procure no menu Iniciar)

2. **Digite a senha configurada** (ou Enter se deixou em branco)

3. **Criar o banco de dados:**
   ```sql
   CREATE DATABASE prescrimed;
   EXIT;
   ```

4. **Configurar o .env** (já feito automaticamente pelo script)

5. **Criar tabelas:**
   ```powershell
   node scripts/create-tables.js
   ```

6. **Reiniciar o servidor:**
   ```powershell
   npm run dev
   ```

## ✅ Sistema configurado para MySQL

Quando o MySQL estiver instalado, o sistema irá:
- Conectar automaticamente ao MySQL
- Criar todas as tabelas necessárias
- Funcionar com layout responsivo e profissional

## 🔧 Solução de Problemas

Se houver erro de conexão:
1. Verifique se o serviço MySQL está rodando
2. Confirme usuário (root) e senha no .env
3. Verifique se a porta 3306 está disponível
