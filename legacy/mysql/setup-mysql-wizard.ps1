Write-Host "==============================================================================="
Write-Host "   Assistente de Configuracao do MySQL"
Write-Host "==============================================================================="
Write-Host ""
Write-Host "PASSO 1: Download"
Write-Host "-----------------"
Write-Host ""
Write-Host "1. A pagina de download do MySQL foi aberta no navegador"
Write-Host "2. Clique em 'Download' no 'Windows (x86, 32-bit), MSI Installer'"
Write-Host "3. Clique em 'No thanks, just start my download'"
Write-Host "4. Aguarde o download concluir"
Write-Host ""
Write-Host "Pressione ENTER quando o download estiver completo..."
Read-Host

Write-Host ""
Write-Host "PASSO 2: Localizando o instalador..."
Write-Host ""

$downloadPath = "$env:USERPROFILE\Downloads\mysql-installer-community*.msi"
$installer = Get-ChildItem -Path $downloadPath -ErrorAction SilentlyContinue | Select-Object -First 1

if ($installer) {
    Write-Host "Instalador encontrado: $($installer.FullName)"
    Write-Host ""
    Write-Host "PASSO 3: Instalacao"
    Write-Host "-------------------"
    Write-Host ""
    Write-Host "O instalador sera aberto. Siga estas instrucoes:"
    Write-Host ""
    Write-Host "1. Setup Type: Escolha 'Server only'"
    Write-Host "2. Check Requirements: Clique 'Next'"
    Write-Host "3. Installation: Clique 'Execute' e aguarde"
    Write-Host "4. Product Configuration:"
    Write-Host "   - Type and Networking: Porta 3306, clique 'Next'"
    Write-Host "   - Authentication Method: Use Strong Password, clique 'Next'"
    Write-Host "   - Accounts and Roles:"
    Write-Host "     * Root Password: DEIXE EM BRANCO (pressione Next)"
    Write-Host "     * OU defina: root"
    Write-Host "   - Windows Service:"
    Write-Host "     * Marque 'Configure MySQL Server as a Windows Service'"
    Write-Host "     * Nome: MySQL80"
    Write-Host "     * Marque 'Start the MySQL Server at System Startup'"
    Write-Host "     * Clique 'Next'"
    Write-Host "5. Apply Configuration: Clique 'Execute' e aguarde"
    Write-Host "6. Clique 'Finish'"
    Write-Host ""
    Write-Host "Pressione ENTER para abrir o instalador..."
    Read-Host
    
    Start-Process $installer.FullName -Wait
    
    Write-Host ""
    Write-Host "==============================================================================="
    Write-Host "PASSO 4: Verificando instalacao..."
    Write-Host ""
    
    Start-Sleep -Seconds 5
    
    $service = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
    if ($service) {
        Write-Host "Servico MySQL encontrado: $($service.Name)"
        Write-Host "Status: $($service.Status)"
        
        if ($service.Status -ne "Running") {
            Write-Host "Iniciando servico..."
            try {
                Start-Service $service.Name
                Write-Host "Servico iniciado com sucesso!"
            } catch {
                Write-Host "Erro ao iniciar servico: $($_.Exception.Message)"
            }
        } else {
            Write-Host "Servico ja esta rodando!"
        }
        
        Write-Host ""
        Write-Host "==============================================================================="
        Write-Host "PASSO 5: Configurar banco de dados"
        Write-Host ""
        Write-Host "Agora vamos criar o banco de dados 'prescrimed'"
        Write-Host ""
        Write-Host "Pressione ENTER para continuar..."
        Read-Host
        
        Write-Host ""
        Write-Host "Criando banco de dados..."
        
        $env:MYSQL_HOST = "localhost"
        $env:MYSQL_PORT = "3306"
        $env:MYSQL_USER = "root"
        $env:MYSQL_PASSWORD = ""
        $env:MYSQL_DATABASE = "prescrimed"
        
        node setup-mysql.js
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "==============================================================================="
            Write-Host "SUCESSO! MySQL configurado e pronto para uso!"
            Write-Host "==============================================================================="
            Write-Host ""
            Write-Host "Agora vamos:"
            Write-Host "1. Atualizar o .env para usar MySQL"
            Write-Host "2. Criar usuario admin"
            Write-Host "3. Iniciar o servidor"
            Write-Host ""
            Write-Host "Pressione ENTER para continuar..."
            Read-Host
            
            # Atualizar .env
            Write-Host "Atualizando .env..."
            $envContent = Get-Content .env -Raw
            $envContent = $envContent -replace '# MYSQL_HOST=localhost', 'MYSQL_HOST=localhost'
            $envContent = $envContent -replace '# MYSQL_PORT=3306', 'MYSQL_PORT=3306'
            $envContent = $envContent -replace '# MYSQL_USER=root', 'MYSQL_USER=root'
            $envContent = $envContent -replace '# MYSQL_PASSWORD=', 'MYSQL_PASSWORD='
            $envContent = $envContent -replace '# MYSQL_DATABASE=prescrimed', 'MYSQL_DATABASE=prescrimed'
            Set-Content .env -Value $envContent
            Write-Host ".env atualizado!"
            
            # Criar admin
            Write-Host ""
            Write-Host "Criando usuario admin..."
            node create-local-admin.js
            
            Write-Host ""
            Write-Host "==============================================================================="
            Write-Host "TUDO PRONTO!"
            Write-Host "==============================================================================="
            Write-Host ""
            Write-Host "MySQL esta configurado e rodando!"
            Write-Host "Banco de dados 'prescrimed' criado!"
            Write-Host "Usuario admin criado!"
            Write-Host ""
            Write-Host "Para iniciar o sistema:"
            Write-Host "npm run dev"
            Write-Host ""
            Write-Host "Depois acesse: http://localhost:8000"
            Write-Host "Login: admin@prescrimed.com"
            Write-Host "Senha: admin123"
            Write-Host ""
            
        } else {
            Write-Host ""
            Write-Host "Erro ao criar banco de dados."
            Write-Host "Verifique se a senha root esta correta no .env"
        }
        
    } else {
        Write-Host "Servico MySQL nao encontrado."
        Write-Host "Pode ser necessario reiniciar o computador."
    }
    
} else {
    Write-Host "Instalador nao encontrado em: $downloadPath"
    Write-Host ""
    Write-Host "Verifique se o download foi concluido e tente novamente."
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
