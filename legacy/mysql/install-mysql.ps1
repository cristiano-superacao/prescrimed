# Script de instalação do MySQL Server no Windows
Write-Host "🔧 Instalando MySQL Server..." -ForegroundColor Cyan

# Verificar se winget está disponível
$wingetExists = Get-Command winget -ErrorAction SilentlyContinue
if (!$wingetExists) {
    Write-Host "❌ winget não encontrado. Instalando manualmente..." -ForegroundColor Red
    
    # Baixar instalador MySQL
    $url = "https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-8.0.40.0.msi"
    $output = "$env:TEMP\mysql-installer.msi"
    
    Write-Host "📥 Baixando MySQL Installer..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
    
    Write-Host "🚀 Iniciando instalação do MySQL..." -ForegroundColor Green
    Write-Host "⚠️  IMPORTANTE: Durante a instalação:" -ForegroundColor Yellow
    Write-Host "   1. Escolha 'Server only' ou 'Developer Default'" -ForegroundColor White
    Write-Host "   2. Defina a senha root (deixe em branco ou use uma senha simples)" -ForegroundColor White
    Write-Host "   3. Mantenha as configurações padrão" -ForegroundColor White
    
    Start-Process msiexec.exe -ArgumentList "/i `"$output`"" -Wait
} else {
    Write-Host "📦 Instalando MySQL via winget..." -ForegroundColor Green
    winget install --id Oracle.MySQL -e --silent
}

Write-Host "✅ Instalação concluída!" -ForegroundColor Green
Write-Host "🔄 Aguardando serviço MySQL iniciar..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Verificar se o serviço está rodando
$service = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
if ($service) {
    if ($service.Status -ne "Running") {
        Start-Service $service.Name
        Write-Host "✅ Serviço MySQL iniciado!" -ForegroundColor Green
    } else {
        Write-Host "✅ Serviço MySQL já está rodando!" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Serviço MySQL não encontrado. Pode ser necessário reiniciar o computador." -ForegroundColor Yellow
}

Write-Host "`n📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Abra o MySQL Command Line Client" -ForegroundColor White
Write-Host "   2. Digite a senha que você configurou (ou pressione Enter se deixou em branco)" -ForegroundColor White
Write-Host "   3. Execute: CREATE DATABASE prescrimed;" -ForegroundColor White
Write-Host "`n   Ou execute o script: node scripts/create-tables.js" -ForegroundColor White
