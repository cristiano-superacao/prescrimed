# PrescrIMed - Script de Inicialização PowerShell
# Uso: .\iniciar.ps1

# Define encoding UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "PrescrIMed - Inicialização"

# Cores
$cor_sucesso = "Green"
$cor_info = "Cyan"
$cor_aviso = "Yellow"
$cor_titulo = "Magenta"

Clear-Host

Write-Host "╔═══════════════════════════════════════════════════════════════════╗" -ForegroundColor $cor_titulo
Write-Host "║                                                                   ║" -ForegroundColor $cor_titulo
Write-Host "║              🚀 PRESCRIMED - INÍCIO RÁPIDO 🚀                    ║" -ForegroundColor $cor_titulo
Write-Host "║                   Sistema de Prescrições Médicas                  ║" -ForegroundColor $cor_titulo
Write-Host "║                                                                   ║" -ForegroundColor $cor_titulo
Write-Host "╚═══════════════════════════════════════════════════════════════════╝" -ForegroundColor $cor_titulo
Write-Host ""
Write-Host "   ⚡ Iniciando sistema (Backend + Frontend)..." -ForegroundColor $cor_info
Write-Host "   ⏳ Aguarde alguns segundos..." -ForegroundColor $cor_info
Write-Host ""

# Obtém o diretório do script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Mata processos Node.js existentes
Write-Host "   🧹 Limpando processos anteriores..." -ForegroundColor $cor_info
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Verifica se as dependências estão instaladas
Write-Host ""
Write-Host "   📦 Verificando dependências..." -ForegroundColor $cor_info

if (-not (Test-Path "node_modules")) {
    Write-Host "   ⚠️  Instalando dependências do backend..." -ForegroundColor $cor_aviso
    npm install --silent
}

if (-not (Test-Path "client\node_modules")) {
    Write-Host "   ⚠️  Instalando dependências do frontend..." -ForegroundColor $cor_aviso
    Set-Location client
    npm install --silent
    Set-Location ..
}

Write-Host "   ✅ Dependências verificadas!" -ForegroundColor $cor_sucesso
Write-Host ""

# Inicia Backend
Write-Host "   ✅ [1/2] Iniciando Backend (porta 8000)..." -ForegroundColor $cor_sucesso
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir'; `$Host.UI.RawUI.WindowTitle = '🔧 PrescrIMed Backend'; npm run dev"
Start-Sleep -Seconds 5

# Inicia Frontend
Write-Host "   ✅ [2/2] Iniciando Frontend (porta 5173)..." -ForegroundColor $cor_sucesso
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\client'; `$Host.UI.RawUI.WindowTitle = '🌐 PrescrIMed Frontend'; npm run dev"
Start-Sleep -Seconds 5

Clear-Host

Write-Host "╔═══════════════════════════════════════════════════════════════════╗" -ForegroundColor $cor_sucesso
Write-Host "║                                                                   ║" -ForegroundColor $cor_sucesso
Write-Host "║              ✅ SISTEMA PRESCRIMED INICIADO! ✅                   ║" -ForegroundColor $cor_sucesso
Write-Host "║                                                                   ║" -ForegroundColor $cor_sucesso
Write-Host "╚═══════════════════════════════════════════════════════════════════╝" -ForegroundColor $cor_sucesso
Write-Host ""
Write-Host "   🎉 Tudo pronto para usar!" -ForegroundColor $cor_sucesso
Write-Host ""
Write-Host "   📊 Backend:  " -NoNewline -ForegroundColor $cor_info
Write-Host "http://localhost:8000" -ForegroundColor White
Write-Host "   🌐 Frontend: " -NoNewline -ForegroundColor $cor_info
Write-Host "http://localhost:5173" -ForegroundColor White
Write-Host "   🗄️  Banco:    " -NoNewline -ForegroundColor $cor_info
Write-Host "SQLite local (arquivo database.sqlite)" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor $cor_titulo
Write-Host "   🚪 PRIMEIRO ACESSO" -ForegroundColor $cor_titulo
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor $cor_titulo
Write-Host ""
Write-Host "   1. Acesse: http://localhost:5173" -ForegroundColor White
Write-Host "   2. Clique em 'Registrar' (canto superior direito)" -ForegroundColor White
Write-Host "   3. Preencha os dados da sua empresa/clínica" -ForegroundColor White
Write-Host "   4. Você será o primeiro usuário ADMINISTRADOR" -ForegroundColor White
Write-Host "   5. Comece a cadastrar pacientes e prescrições! 🎊" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor $cor_titulo
Write-Host "   📚 RECURSOS" -ForegroundColor $cor_titulo
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor $cor_titulo
Write-Host ""
Write-Host "   📖 README.md              - Documentação completa" -ForegroundColor White
Write-Host "   🔧 Railway/Deploy         - Configure DATABASE_URL no provedor" -ForegroundColor White
Write-Host "   ⚙️  configurar.bat         - Opções avançadas" -ForegroundColor White
Write-Host "   🛠️  COMO_INICIAR.md        - Guia de inicialização" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor $cor_titulo
Write-Host ""

# Abre o navegador
Start-Sleep -Seconds 3
Write-Host "   ⏳ Abrindo navegador..." -ForegroundColor $cor_info
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "   ✅ Sistema aberto no navegador!" -ForegroundColor $cor_sucesso
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor $cor_aviso
Write-Host "   ⚠️  IMPORTANTE" -ForegroundColor $cor_aviso
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor $cor_aviso
Write-Host ""
Write-Host "   • Por padrão, os dados ficam em SQLite (arquivo local)" -ForegroundColor White
Write-Host "   • Para produção/multiusuário, use PostgreSQL (DATABASE_URL)" -ForegroundColor White
Write-Host ""
Write-Host "   • Para PARAR o sistema: Feche as 3 janelas do PowerShell" -ForegroundColor White
Write-Host "   • Para REINICIAR: Execute este arquivo novamente" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor $cor_titulo
Write-Host ""
Write-Host "   Pressione qualquer tecla para fechar esta janela..." -ForegroundColor $cor_info
Write-Host "   (As outras 3 janelas devem permanecer abertas!)" -ForegroundColor $cor_aviso
Write-Host ""

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
