# Script para configurar o serviço backend no Railway após criar pelo dashboard
# Execute depois de criar o serviço "backend" no Railway

Write-Host "🚀 Configurando Backend no Railway..." -ForegroundColor Cyan
Write-Host ""

# Link ao novo serviço
Write-Host "1️⃣ Linkando ao serviço backend..." -ForegroundColor Yellow
railway link

# Configurar variáveis essenciais
Write-Host ""
Write-Host "2️⃣ Configurando variáveis de ambiente..." -ForegroundColor Yellow

railway variables --set NODE_ENV=production
railway variables --set SESSION_TIMEOUT=8h
railway variables --set FORCE_SYNC=true
railway variables --set FRONTEND_URL=https://prescrimed.netlify.app
railway variables --set ALLOWED_ORIGINS=https://prescrimed.netlify.app,https://precrimed.netlify.app

Write-Host ""
Write-Host "⚠️  IMPORTANTE: Copie JWT_SECRET e JWT_REFRESH_SECRET do serviço 'client'" -ForegroundColor Red
Write-Host "No dashboard, vá em Variables do serviço 'client', copie os valores e execute:" -ForegroundColor Yellow
Write-Host ""
Write-Host 'railway variables --set JWT_SECRET="COLE_O_VALOR_AQUI"' -ForegroundColor Green
Write-Host 'railway variables --set JWT_REFRESH_SECRET="COLE_O_VALOR_AQUI"' -ForegroundColor Green
Write-Host ""
Write-Host "Pressione Enter quando tiver configurado os JWT secrets..."
Read-Host

# Deploy
Write-Host ""
Write-Host "3️⃣ Fazendo deploy..." -ForegroundColor Yellow
railway up --detach

Write-Host ""
Write-Host "⏳ Aguardando deploy (90 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 90

# Status
Write-Host ""
Write-Host "4️⃣ Verificando status..." -ForegroundColor Yellow
railway service status

Write-Host ""
Write-Host "5️⃣ Logs recentes..." -ForegroundColor Yellow
railway logs --tail 50

Write-Host ""
Write-Host "✅ Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Verifique o domínio do backend no Railway dashboard"
Write-Host "2. Teste: Invoke-RestMethod -Uri 'https://SEU_DOMINIO/health'"
Write-Host "3. Valide tabelas: Invoke-RestMethod -Uri 'https://SEU_DOMINIO/api/diagnostic/db-check'"
Write-Host "4. Se OK, desative FORCE_SYNC: railway variables --set FORCE_SYNC=false"
Write-Host ""
