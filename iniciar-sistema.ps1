# Script de Inicialização do Sistema Prescrimed
# Encoding: UTF-8

$ErrorActionPreference = "Continue"
$Host.UI.RawUI.WindowTitle = "Prescrimed - Inicializador"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "   🏥 PRESCRIMED - SISTEMA COMPLETO" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Função para testar URL
function Test-Url {
    param($Url)
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# 1. Verificar Node.js
Write-Host "[1/5] 🔍 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion instalado" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "   Instale em: https://nodejs.org" -ForegroundColor Yellow
    pause
    exit 1
}

# 2. Verificar NPM
Write-Host ""
Write-Host "[2/5] 📦 Verificando NPM..." -ForegroundColor Yellow
try {
    $npmVersion = npm -v
    Write-Host "✅ NPM $npmVersion instalado" -ForegroundColor Green
} catch {
    Write-Host "❌ NPM não encontrado!" -ForegroundColor Red
    pause
    exit 1
}

# 3. Parar processos anteriores
Write-Host ""
Write-Host "[3/5] 🛑 Parando processos anteriores..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✅ Processos anteriores encerrados" -ForegroundColor Green
} else {
    Write-Host "✅ Nenhum processo anterior encontrado" -ForegroundColor Green
}

# 4. Iniciar Backend
Write-Host ""
Write-Host "[4/5] 🚀 Iniciando Backend..." -ForegroundColor Yellow
$backendPath = Get-Location
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; Write-Host 'Iniciando Backend...' -ForegroundColor Cyan; npm run server"
Write-Host "⏳ Aguardando backend inicializar..." -ForegroundColor Yellow

# Aguardar backend ficar pronto (até 30 segundos)
$maxAttempts = 15
$attempt = 0
$backendReady = $false

while ($attempt -lt $maxAttempts -and -not $backendReady) {
    Start-Sleep -Seconds 2
    $attempt++
    Write-Host "   Tentativa $attempt de $maxAttempts..." -ForegroundColor Gray
    
    if (Test-Url "http://localhost:3000/health") {
        $backendReady = $true
        Write-Host "✅ Backend iniciado com sucesso!" -ForegroundColor Green
    }
}

if (-not $backendReady) {
    Write-Host "⚠️  Backend demorou para iniciar, mas continuando..." -ForegroundColor Yellow
}

# 5. Iniciar Frontend
Write-Host ""
Write-Host "[5/5] 🎨 Iniciando Frontend..." -ForegroundColor Yellow
$frontendPath = Join-Path $backendPath "client"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; Write-Host 'Iniciando Frontend...' -ForegroundColor Cyan; npm run dev"
Start-Sleep -Seconds 3
Write-Host "✅ Frontend iniciado!" -ForegroundColor Green

# Mensagem final
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "   ✅ SISTEMA INICIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs do Sistema:" -ForegroundColor Cyan
Write-Host "   Frontend: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5173" -ForegroundColor Yellow
Write-Host "   Backend:  " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000" -ForegroundColor Yellow
Write-Host "   Health:   " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000/health" -ForegroundColor Yellow
Write-Host ""
Write-Host "👤 Login Superadmin:" -ForegroundColor Cyan
Write-Host "   Email: " -NoNewline -ForegroundColor White
Write-Host "superadmin@prescrimed.com" -ForegroundColor Yellow
Write-Host "   Senha: " -NoNewline -ForegroundColor White
Write-Host "super123" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Dica: Mantenha as janelas do PowerShell abertas!" -ForegroundColor Magenta
Write-Host "   Para parar o sistema, execute: " -NoNewline -ForegroundColor White
Write-Host "PARAR_SISTEMA.bat" -ForegroundColor Yellow
Write-Host ""

# Aguardar para o usuário ver as mensagens
Write-Host "Pressione qualquer tecla para fechar esta janela..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
