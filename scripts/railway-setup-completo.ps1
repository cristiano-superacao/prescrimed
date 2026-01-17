#!/usr/bin/env pwsh
# Setup completo do Railway - Backend + PostgreSQL

Write-Host "`n🚀 SETUP RAILWAY - PRESCRIMED BACKEND`n" -ForegroundColor Cyan

# 1. Verificar Railway CLI
Write-Host "Verificando Railway CLI..." -ForegroundColor Yellow
$railway = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railway) {
    Write-Host "Instalando Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
    Write-Host "✅ Railway CLI instalado`n" -ForegroundColor Green
} else {
    Write-Host "✅ Railway CLI já instalado`n" -ForegroundColor Green
}

# 2. Login
Write-Host "PASSO 1: Login no Railway" -ForegroundColor Cyan
Write-Host "Abrirá o navegador para login..." -ForegroundColor Yellow
railway login
Write-Host "✅ Login concluído`n" -ForegroundColor Green

# 3. Criar/Conectar Projeto
Write-Host "PASSO 2: Inicializar Projeto" -ForegroundColor Cyan
Write-Host "Escolha: Criar novo projeto ou conectar existente" -ForegroundColor Yellow
railway init
Write-Host "✅ Projeto configurado`n" -ForegroundColor Green

# 4. Adicionar PostgreSQL
Write-Host "PASSO 3: Adicionar PostgreSQL" -ForegroundColor Cyan
railway add
Write-Host "✅ PostgreSQL adicionado`n" -ForegroundColor Green

# 5. Configurar Variáveis
Write-Host "PASSO 4: Configurar Variáveis de Ambiente" -ForegroundColor Cyan
$jwtSecret = (New-Guid).Guid
$jwtRefreshSecret = (New-Guid).Guid

railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set JWT_SECRET=$jwtSecret
railway variables set JWT_REFRESH_SECRET=$jwtRefreshSecret
railway variables set SESSION_TIMEOUT=8h
railway variables set FORCE_SYNC=false
railway variables set ALLOWED_ORIGINS=https://cristiano-superacao.github.io,https://cristiano-superacao.github.io/prescrimed

Write-Host "✅ Variáveis configuradas`n" -ForegroundColor Green

# 6. Deploy
Write-Host "PASSO 5: Deploy da Aplicação" -ForegroundColor Cyan
railway up --detach

Write-Host "`n✅ DEPLOY INICIADO!" -ForegroundColor Green
Write-Host "`n📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Aguarde 2-3 minutos para o build completar"
Write-Host "2. Execute: railway status"
Write-Host "3. Execute: railway domain"
Write-Host "4. Copie a URL e atualize o frontend (VITE_API_URL)`n"
