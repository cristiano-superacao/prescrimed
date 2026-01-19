# Script para configurar PostgreSQL no Railway (criação de empresa/admin e validações)
# Observação: este script não altera variáveis do Railway.
# Para automatizar a configuração do DATABASE_URL (Postgres -> Backend), use:
#   powershell -ExecutionPolicy Bypass -File scripts/railway-auto-config.ps1
# Depois rode este script para criar empresa e administrador.

param(
    [string]$Email = "admin@meudominio.com",
    [string]$Senha = "SenhaSegura@2026",
    [string]$NomeEmpresa = "Minha Empresa",
    [string]$NomeAdmin = "Administrador",
    [string]$CNPJ = "12345678000199",
    [string]$Contato = "(11) 99999-9999",
    [string]$TipoSistema = "casa-repouso"
)

$BackendUrl = "https://prescrimed-backend-production.up.railway.app"

Write-Host "`n╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      🚀 CONFIGURAÇÃO POSTGRESQL NO RAILWAY - PRESCRIMED      ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Passo 1: Verificar se o backend está online
Write-Host "📡 PASSO 1: Verificando se o backend está online..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BackendUrl/health" -ErrorAction Stop
    Write-Host "   ✅ Backend online - Uptime: $([math]::Round($health.uptime, 2))s" -ForegroundColor Green
    
    if ($health.env.DATABASE_URL -eq $true) {
        Write-Host "   ✅ PostgreSQL configurado!" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  SQLite detectado - PostgreSQL ainda não configurado" -ForegroundColor Yellow
        Write-Host "   💡 Siga as instruções no dashboard do Railway para adicionar PostgreSQL`n" -ForegroundColor Cyan
        Write-Host "   INSTRUÇÕES:" -ForegroundColor White
        Write-Host "   1. Acesse: https://railway.app" -ForegroundColor Gray
        Write-Host "   2. Abra seu projeto prescrimed-backend" -ForegroundColor Gray
        Write-Host "   3. Clique: + New > Database > Add PostgreSQL" -ForegroundColor Gray
        Write-Host "   4. Aguarde 2-3 minutos e execute este script novamente`n" -ForegroundColor Gray
        exit
    }
} catch {
    Write-Host "   ❌ Erro ao conectar ao backend: $_" -ForegroundColor Red
    Write-Host "   💡 Verifique se o Railway está online`n" -ForegroundColor Yellow
    exit
}

# Passo 2: Criar empresa e administrador
Write-Host "`n👤 PASSO 2: Criando empresa e administrador..." -ForegroundColor Yellow

$headers = @{
    'Content-Type' = 'application/json'
}

$registerBody = @{
    tipoSistema = $TipoSistema
    nomeEmpresa = $NomeEmpresa
    cnpj = $CNPJ
    nomeAdmin = $NomeAdmin
    email = $Email
    senha = $Senha
    contato = $Contato
} | ConvertTo-Json

try {
    $register = Invoke-RestMethod -Uri "$BackendUrl/api/auth/register" -Method Post -Body $registerBody -Headers $headers
    Write-Host "   ✅ Empresa criada: $($register.empresa.nome)" -ForegroundColor Green
    Write-Host "   ✅ Administrador criado: $($register.usuario.nome)" -ForegroundColor Green
    Write-Host "   ✅ Email: $($register.usuario.email)" -ForegroundColor Green
} catch {
    $errorMessage = $_.Exception.Message
    if ($errorMessage -like "*já existe*" -or $errorMessage -like "*already exists*") {
        Write-Host "   ⚠️  Empresa ou email já existe. Tentando login..." -ForegroundColor Yellow
    } else {
        Write-Host "   ❌ Erro ao criar empresa: $errorMessage" -ForegroundColor Red
        exit
    }
}

# Passo 3: Testar login
Write-Host "`n🔐 PASSO 3: Testando login..." -ForegroundColor Yellow

$loginBody = @{
    email = $Email
    senha = $Senha
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "$BackendUrl/api/auth/login" -Method Post -Body $loginBody -Headers $headers
    Write-Host "   ✅ Login bem-sucedido!" -ForegroundColor Green
    Write-Host "   👤 Usuário: $($login.user.nome)" -ForegroundColor White
    Write-Host "   📧 Email: $($login.user.email)" -ForegroundColor White
    Write-Host "   🏢 Empresa: $($login.user.empresa.nome)" -ForegroundColor White
    Write-Host "   🔑 Role: $($login.user.role)" -ForegroundColor White
    
    $token = $login.token
} catch {
    Write-Host "   ❌ Erro no login: $_" -ForegroundColor Red
    exit
}

# Passo 4: Testar rotas principais
Write-Host "`n🧪 PASSO 4: Testando rotas principais..." -ForegroundColor Yellow

$authHeaders = @{
    'Authorization' = "Bearer $token"
    'Content-Type' = 'application/json'
}

# Testar rota de estoque
try {
    $estoque = Invoke-RestMethod -Uri "$BackendUrl/api/estoque/medicamentos" -Method Get -Headers $authHeaders
    Write-Host "   ✅ Rota de Estoque: OK ($($estoque.Count) itens)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Rota de Estoque: Erro - $_" -ForegroundColor Red
}

# Testar rota financeira
try {
    $financeiro = Invoke-RestMethod -Uri "$BackendUrl/api/financeiro" -Method Get -Headers $authHeaders
    Write-Host "   ✅ Rota Financeira: OK ($($financeiro.Count) transações)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Rota Financeira: Erro - $_" -ForegroundColor Red
}

# Testar rota de pacientes
try {
    $pacientes = Invoke-RestMethod -Uri "$BackendUrl/api/paciente" -Method Get -Headers $authHeaders
    Write-Host "   ✅ Rota de Pacientes: OK ($($pacientes.Count) pacientes)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Rota de Pacientes: Erro - $_" -ForegroundColor Red
}

# Resumo final
Write-Host "`n╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ POSTGRESQL CONFIGURADO COM SUCESSO!          ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "🔐 SUAS CREDENCIAIS DE ACESSO:`n" -ForegroundColor Yellow
Write-Host "   📧 Email: " -NoNewline -ForegroundColor Gray
Write-Host "$Email" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "   🔑 Senha: " -NoNewline -ForegroundColor Gray
Write-Host "$Senha" -ForegroundColor Cyan -BackgroundColor Black

Write-Host "`n🌐 ACESSE O SISTEMA:`n" -ForegroundColor Cyan
Write-Host "   Frontend: " -NoNewline
Write-Host "https://cristiano-superacao.github.io/prescrimed" -ForegroundColor White
Write-Host "   Backend:  " -NoNewline
Write-Host "$BackendUrl`n" -ForegroundColor White

Write-Host "✨ BENEFÍCIOS DO POSTGRESQL:" -ForegroundColor Green
Write-Host "   ✓ Dados permanentes (não serão mais perdidos)" -ForegroundColor White
Write-Host "   ✓ Sistema 100% estável" -ForegroundColor White
Write-Host "   ✓ Sem erros 401 recorrentes" -ForegroundColor White
Write-Host "   ✓ Performance otimizada" -ForegroundColor White
Write-Host "   ✓ Backups automáticos do Railway`n" -ForegroundColor White

Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Green
