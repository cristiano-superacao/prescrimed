# Script para baixar e instalar MySQL Server com serviço Windows
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "     Instalação Completa do MySQL Server 8.0" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host ""

# Definir URLs e caminhos
$installerUrl = "https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-8.0.40.0.msi"
$installerPath = "$env:TEMP\mysql-installer.msi"

Write-Host "📥 Baixando MySQL Installer..." -ForegroundColor Yellow
Write-Host "URL: $installerUrl" -ForegroundColor Gray
Write-Host ""

try {
    # Download com progress bar
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($installerUrl, $installerPath)
    
    Write-Host "✅ Download concluído!" -ForegroundColor Green
    Write-Host "Arquivo salvo em: $installerPath" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "🚀 Iniciando instalação..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "  INSTRUÇÕES DE INSTALAÇÃO" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "1️⃣  Escolha: [Server only] ou [Developer Default]" -ForegroundColor White
    Write-Host ""
    Write-Host "2️⃣  Configuração do Servidor:" -ForegroundColor White
    Write-Host "   - Development Computer" -ForegroundColor Gray
    Write-Host "   - Porta: 3306" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3️⃣  Autenticação:" -ForegroundColor White
    Write-Host "   - Use Strong Password Encryption (Recommended)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4️⃣  Senha Root:" -ForegroundColor White
    Write-Host "   - DEIXE EM BRANCO ou defina: root" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "5️⃣  Windows Service:" -ForegroundColor White
    Write-Host "   - ✅ Configure MySQL Server as a Windows Service" -ForegroundColor Green
    Write-Host "   - Nome do serviço: MySQL80" -ForegroundColor Gray
    Write-Host "   - ✅ Start the MySQL Server at System Startup" -ForegroundColor Green
    Write-Host ""
    Write-Host "6️⃣  Clique em [Execute] e aguarde a instalação" -ForegroundColor White
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host ""
    
    # Executar instalador
    Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`"" -Wait
    
    Write-Host ""
    Write-Host "✅ Instalação concluída!" -ForegroundColor Green
    Write-Host ""
    
    # Verificar serviço
    Write-Host "🔍 Verificando serviço MySQL..." -ForegroundColor Cyan
    Start-Sleep -Seconds 5
    
    $service = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
    if ($service) {
        Write-Host "✅ Serviço encontrado: $($service.Name)" -ForegroundColor Green
        Write-Host "   Status: $($service.Status)" -ForegroundColor Gray
        
        if ($service.Status -ne "Running") {
            Write-Host "🔄 Iniciando serviço..." -ForegroundColor Yellow
            Start-Service $service.Name
            Write-Host "✅ Serviço iniciado!" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠️  Serviço não encontrado. Pode ser necessário reiniciar o computador." -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "  PRÓXIMOS PASSOS" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "1️⃣  Atualizar senha no .env se definiu uma senha" -ForegroundColor White
    Write-Host ""
    Write-Host "2️⃣  Executar: node setup-mysql.js" -ForegroundColor White
    Write-Host ""
    Write-Host "3️⃣  Executar: npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "4️⃣  Acessar: http://localhost:8000" -ForegroundColor White
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host ""
    
} catch {
    Write-Host "Erro durante o processo:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Tente baixar manualmente:" -ForegroundColor Yellow
    Write-Host "https://dev.mysql.com/downloads/installer/" -ForegroundColor Cyan
}

Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
