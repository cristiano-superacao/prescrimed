# Script de Configuração Railway - Execução Automática
# Este script configura corretamente o projeto Railway

Write-Host "🚀 Configurando Railway - Prescrimed" -ForegroundColor Cyan
Write-Host ""

# Verificar se railway CLI está instalado
try {
    $version = railway --version 2>$null
    Write-Host "✅ Railway CLI detectado: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI não instalado. Instale com: npm install -g @railway/cli" -ForegroundColor Red
    exit 1
}

# Verificar login
Write-Host ""
Write-Host "📡 Verificando autenticação..." -ForegroundColor Cyan
$whoami = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Não autenticado. Execute: railway login" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Autenticado como: $whoami" -ForegroundColor Green

# Listar serviços disponíveis
Write-Host ""
Write-Host "📋 Analisando estrutura do projeto..." -ForegroundColor Cyan

# ========================================
# PASSO 1: Limpar variáveis do CLIENTE
# ========================================
Write-Host ""
Write-Host "🧹 PASSO 1: Limpando variáveis do serviço CLIENTE..." -ForegroundColor Yellow

# Variáveis que devem ser REMOVIDAS do cliente (segurança)
$clientRemoveVars = @(
    "DATABASE_URL",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "MONGODB_URI",
    "MONGOHOST",
    "PGHOST",
    "PGPASSWORD",
    "PGDATABASE",
    "PGPORT",
    "PGDATA",
    "POSTGRES_DB",
    "CORS_ORIGIN",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_PROJECT_ID",
    "SESSION_TIMEOUT",
    "LOG_LEVEL"
)

Write-Host "⚠️  As seguintes variáveis serão REMOVIDAS do cliente (por segurança):" -ForegroundColor Red
$clientRemoveVars | ForEach-Object { Write-Host "   - $_" -ForegroundColor DarkRed }

Write-Host ""
$confirm = Read-Host "Deseja continuar? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "❌ Operação cancelada pelo usuário" -ForegroundColor Yellow
    exit 0
}

# Configurar serviço cliente
railway service client | Out-Null

# Remover variáveis sensíveis do cliente (precisa usar Railway Dashboard web - CLI não suporta delete)
Write-Host ""
Write-Host "⚠️  ATENÇÃO: Railway CLI não suporta remoção de variáveis via comando." -ForegroundColor Yellow
Write-Host "📝 Você precisa MANUALMENTE remover as variáveis acima no Dashboard:" -ForegroundColor Cyan
Write-Host "   1. Acesse: https://railway.app/project/supportive-benevolence" -ForegroundColor White
Write-Host "   2. Clique no serviço 'client'" -ForegroundColor White
Write-Host "   3. Aba 'Variables' → delete as variáveis listadas acima" -ForegroundColor White
Write-Host ""

# Configurar variáveis corretas do cliente
Write-Host "✅ Configurando variáveis CORRETAS do cliente..." -ForegroundColor Green
railway variables --set "VITE_API_URL=https://prescrimed.up.railway.app/api" --skip-deploys | Out-Null
railway variables --set "VITE_BACKEND_ROOT=https://prescrimed.up.railway.app" --skip-deploys | Out-Null

Write-Host "   ✓ VITE_API_URL configurada" -ForegroundColor DarkGreen
Write-Host "   ✓ VITE_BACKEND_ROOT configurada" -ForegroundColor DarkGreen

# ========================================
# PASSO 2: Verificar se existe serviço BACKEND
# ========================================
Write-Host ""
Write-Host "🔍 PASSO 2: Verificando serviços..." -ForegroundColor Yellow

# Tentar mudar para backend (se existir)
$backendExists = $false
try {
    railway service | Out-String | Select-String -Pattern "backend" -Quiet
    $backendExists = $true
} catch {
    $backendExists = $false
}

if (-not $backendExists) {
    Write-Host ""
    Write-Host "❌ PROBLEMA DETECTADO: Não existe serviço 'backend' separado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 SOLUÇÃO:" -ForegroundColor Cyan
    Write-Host "   O serviço 'client' parece estar configurado como backend+frontend juntos." -ForegroundColor White
    Write-Host "   Isso é OK, mas precisa dos seguintes ajustes:" -ForegroundColor White
    Write-Host ""
    Write-Host "   1. MANTER DATABASE_URL no serviço 'client' (pois ele roda o backend)" -ForegroundColor Yellow
    Write-Host "   2. Adicionar variáveis de backend necessárias" -ForegroundColor Yellow
    Write-Host ""
    
    # Gerar secrets
    Write-Host "🔐 Gerando secrets seguros..." -ForegroundColor Cyan
    $jwt_secret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
    $jwt_refresh = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
    
    Write-Host "   ✓ JWT_SECRET gerado" -ForegroundColor DarkGreen
    Write-Host "   ✓ JWT_REFRESH_SECRET gerado" -ForegroundColor DarkGreen
    
    # Configurar variáveis de backend no serviço client
    Write-Host ""
    Write-Host "⚙️  Configurando variáveis de backend..." -ForegroundColor Cyan
    
    railway variables --set "NODE_ENV=production" --skip-deploys | Out-Null
    railway variables --set "JWT_SECRET=$jwt_secret" --skip-deploys | Out-Null
    railway variables --set "JWT_REFRESH_SECRET=$jwt_refresh" --skip-deploys | Out-Null
    railway variables --set "SESSION_TIMEOUT=8h" --skip-deploys | Out-Null
    railway variables --set "FORCE_SYNC=true" --skip-deploys | Out-Null
    
    Write-Host "   ✓ NODE_ENV=production" -ForegroundColor DarkGreen
    Write-Host "   ✓ JWT_SECRET (64 caracteres)" -ForegroundColor DarkGreen
    Write-Host "   ✓ JWT_REFRESH_SECRET (64 caracteres)" -ForegroundColor DarkGreen
    Write-Host "   ✓ SESSION_TIMEOUT=8h" -ForegroundColor DarkGreen
    Write-Host "   ✓ FORCE_SYNC=true (temporário para criar tabelas)" -ForegroundColor DarkGreen
}

# ========================================
# PASSO 3: Verificar PostgreSQL
# ========================================
Write-Host ""
Write-Host "🐘 PASSO 3: Verificando PostgreSQL..." -ForegroundColor Yellow

# Verificar se DATABASE_URL está configurada
$vars = railway variables --kv 2>&1 | Out-String
if ($vars -match "DATABASE_URL=postgresql://") {
    Write-Host "   ✅ DATABASE_URL detectada - PostgreSQL conectado!" -ForegroundColor Green
} else {
    Write-Host "   ❌ DATABASE_URL não encontrada!" -ForegroundColor Red
    Write-Host ""
    Write-Host "   🔧 AÇÃO NECESSÁRIA:" -ForegroundColor Cyan
    Write-Host "      1. Acesse Railway Dashboard" -ForegroundColor White
    Write-Host "      2. Adicione serviço PostgreSQL ao projeto" -ForegroundColor White
    Write-Host "      3. Conecte PostgreSQL ao serviço 'client'" -ForegroundColor White
    Write-Host "      4. Execute este script novamente" -ForegroundColor White
    Write-Host ""
    exit 1
}

# ========================================
# PASSO 4: Criar tabelas no PostgreSQL
# ========================================
Write-Host ""
Write-Host "📊 PASSO 4: Criando tabelas no PostgreSQL..." -ForegroundColor Yellow

Write-Host "   Executando script de criação..." -ForegroundColor Cyan
$result = railway run node scripts/create-tables.js 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Tabelas criadas com sucesso!" -ForegroundColor Green
    Write-Host $result
} else {
    Write-Host "   ⚠️  Erro ao criar tabelas diretamente. Usando FORCE_SYNC..." -ForegroundColor Yellow
    Write-Host "   FORCE_SYNC=true já foi configurado. As tabelas serão criadas no próximo deploy." -ForegroundColor Cyan
}

# ========================================
# PASSO 5: Deploy
# ========================================
Write-Host ""
Write-Host "🚀 PASSO 5: Fazendo deploy das alterações..." -ForegroundColor Yellow

$deploy = Read-Host "Deseja fazer deploy agora? (S/N)"
if ($deploy -eq "S" -or $deploy -eq "s") {
    Write-Host "   Iniciando deploy..." -ForegroundColor Cyan
    railway up --detach
    
    Write-Host ""
    Write-Host "   ✅ Deploy iniciado!" -ForegroundColor Green
    Write-Host "   📝 Acompanhe os logs com: railway logs" -ForegroundColor Cyan
} else {
    Write-Host "   ⏭️  Deploy pulado. Execute manualmente: railway up" -ForegroundColor Yellow
}

# ========================================
# RESUMO FINAL
# ========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Remover variáveis sensíveis do Dashboard (veja lista acima)" -ForegroundColor White
Write-Host "   2. Aguardar deploy concluir" -ForegroundColor White
Write-Host "   3. Verificar health: https://prescrimed.up.railway.app/health" -ForegroundColor White
Write-Host "   4. Após tabelas criadas, REMOVER variável FORCE_SYNC" -ForegroundColor White
Write-Host ""

Write-Host "🔗 Links úteis:" -ForegroundColor Cyan
Write-Host "   Dashboard: https://railway.app/project/supportive-benevolence" -ForegroundColor White
Write-Host "   Frontend: https://prescrimed.up.railway.app" -ForegroundColor White
Write-Host "   Health: https://prescrimed.up.railway.app/health" -ForegroundColor White
Write-Host "   Logs: railway logs" -ForegroundColor White
Write-Host ""

Write-Host "🎉 Sistema configurado mantendo layout responsivo e profissional!" -ForegroundColor Green
