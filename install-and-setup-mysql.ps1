# Script para baixar e instalar MySQL facilmente
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "         Instalação do MySQL Server para Prescrimed" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🌐 Abrindo página de download do MySQL..." -ForegroundColor Yellow
Start-Process "https://dev.mysql.com/downloads/installer/"

Write-Host ""
Write-Host "📋 INSTRUÇÕES:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Na página que abriu, clique em [Download] no 'Windows (x86, 32-bit), MSI Installer'" -ForegroundColor White
Write-Host "2. Clique em [No thanks, just start my download]" -ForegroundColor White
Write-Host "3. Execute o arquivo baixado" -ForegroundColor White
Write-Host "4. Escolha 'Server only' ou 'Developer Default'" -ForegroundColor White
Write-Host "5. Configure a senha root (pode deixar em branco)" -ForegroundColor White
Write-Host "6. Mantenha todas as configurações padrão" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Aguarde a instalação concluir..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Pressione qualquer tecla quando a instalação terminar..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "🔧 Configurando banco de dados..." -ForegroundColor Cyan
Write-Host ""

# Executar script de configuração
node setup-mysql.js

Write-Host ""
Write-Host "✅ Configuração completa!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Para iniciar o sistema, execute: npm run dev" -ForegroundColor Cyan
Write-Host ""
