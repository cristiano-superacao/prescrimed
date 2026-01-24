Write-Host "==============================================================================="
Write-Host "          Instalacao do MySQL Server 8.0"
Write-Host "==============================================================================="
Write-Host ""

$url = "https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-8.0.40.0.msi"
$output = "$env:TEMP\mysql-installer.msi"

Write-Host "Baixando MySQL Installer..."
Write-Host "URL: $url"
Write-Host ""

try {
    Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
    
    Write-Host "Download concluido!"
    Write-Host "Arquivo salvo em: $output"
    Write-Host ""
    
    Write-Host "Iniciando instalacao..."
    Write-Host ""
    Write-Host "INSTRUCOES:"
    Write-Host "1. Escolha: Server only"
    Write-Host "2. Porta: 3306"
    Write-Host "3. Senha root: deixe em branco ou defina 'root'"
    Write-Host "4. Ative o Windows Service"
    Write-Host "5. Nome do servico: MySQL80"
    Write-Host ""
    
    Start-Process msiexec.exe -ArgumentList "/i `"$output`"" -Wait
    
    Write-Host ""
    Write-Host "Instalacao concluida!"
    Write-Host ""
    
    Write-Host "Verificando servico MySQL..."
    Start-Sleep -Seconds 5
    
    $service = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
    if ($service) {
        Write-Host "Servico encontrado: $($service.Name)"
        Write-Host "Status: $($service.Status)"
        
        if ($service.Status -ne "Running") {
            Write-Host "Iniciando servico..."
            Start-Service $service.Name
            Write-Host "Servico iniciado!"
        }
    } else {
        Write-Host "Servico nao encontrado. Reinicie o computador."
    }
    
    Write-Host ""
    Write-Host "PROXIMOS PASSOS:"
    Write-Host "1. Atualizar senha no .env se necessario"
    Write-Host "2. Executar: node setup-mysql.js"
    Write-Host "3. Executar: npm run dev"
    Write-Host ""
    
} catch {
    Write-Host "Erro: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "Baixe manualmente em:"
    Write-Host "https://dev.mysql.com/downloads/installer/"
}

Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
