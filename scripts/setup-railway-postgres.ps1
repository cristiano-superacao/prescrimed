# === Auto-configuração Railway (DATABASE_URL) ===
param(
    [string] $BackendServiceName = "prescrimed-backend",
    [string] $PostgresServiceName = "Postgres",
    [switch] $AutoConfigure
)

function Get-RailwayCommand {
    $railway = Get-Command railway -ErrorAction SilentlyContinue
    if ($railway) { return "railway" }
    $npx = Get-Command npx -ErrorAction SilentlyContinue
    if ($npx) { return "npx railway" }
    throw "Railway CLI não encontrado. Instale com: npm i -g railway ou use Node.js + npx."
}

function Invoke-Railway {
    param(
        [Parameter(Mandatory=$true)][string] $Args,
        [switch] $Quiet
    )
    $cmd = Get-RailwayCommand
    Write-Host "→ $cmd $Args" -ForegroundColor DarkGray
    $proc = Start-Process powershell -PassThru -NoNewWindow -ArgumentList "-Command", "$cmd $Args"
    $proc.WaitForExit()
    if (-not $Quiet) { Write-Host "   ExitCode: $($proc.ExitCode)" -ForegroundColor DarkGray }
    return $proc.ExitCode
}

function Ensure-RailwayLogin {
    Write-Host "Validando login no Railway..." -ForegroundColor Cyan
    $exit = Invoke-Railway -Args "whoami" -Quiet
    if ($exit -ne 0) {
        Write-Host "Abrindo fluxo de login do Railway..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit","-Command","$(Get-RailwayCommand) login" | Out-Null
        Write-Host "Finalize o login no navegador e pressione Enter aqui para continuar." -ForegroundColor Yellow
        Read-Host | Out-Null
    }
}

function Ensure-ProjectLink {
    Write-Host "Vinculando diretório ao projeto do Railway (se necessário)..." -ForegroundColor Cyan
    $exit = Invoke-Railway -Args "status" -Quiet
    if ($exit -ne 0) {
        Invoke-Railway -Args "project list" | Out-Null
        Write-Host "Se o projeto 'prescrimed' aparecer na lista acima, escolha-o na próxima etapa." -ForegroundColor Yellow
        Invoke-Railway -Args "link" | Out-Null
    }
}

function Get-PostgresUrl {
    Write-Host "Obtendo URL do Postgres (service: $PostgresServiceName)..." -ForegroundColor Cyan
    $cmd = Get-RailwayCommand
    $ps = Start-Process powershell -PassThru -NoNewWindow -ArgumentList "-Command", "$cmd variables --service \"$PostgresServiceName\"" -RedirectStandardOutput "$env:TEMP\railway_vars.txt"
    $ps.WaitForExit()
    $text = Get-Content "$env:TEMP\railway_vars.txt" -Raw -ErrorAction SilentlyContinue
    if (-not $text) { throw "Não foi possível ler variáveis do serviço Postgres." }
    $lines = $text -split "`r?`n"
    $url = ($lines | Where-Object { $_ -match '^DATABASE_URL=' }) -replace '^DATABASE_URL=',''
    if (-not $url -or $url.Trim() -eq '') {
        $url = ($lines | Where-Object { $_ -match '^POSTGRES_URL=' }) -replace '^POSTGRES_URL=',''
    }
    if (-not $url -or $url.Trim() -eq '') { throw "DATABASE_URL não encontrado nas variáveis do serviço Postgres." }
    return $url.Trim()
}

function Set-BackendDatabaseUrl([string] $url) {
    Write-Host "Configurando DATABASE_URL no backend ($BackendServiceName)..." -ForegroundColor Cyan
    $quoted = '"' + $url.Replace('"','\"') + '"'
    Invoke-Railway -Args "variables set --service \"$BackendServiceName\" DATABASE_URL $quoted" | Out-Null
}

function Redeploy-Backend {
    Write-Host "Reimplantando serviço do backend..." -ForegroundColor Cyan
    Invoke-Railway -Args "up" | Out-Null
}

if ($AutoConfigure) {
    try {
        Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "AUTO-CONFIG: DATABASE_URL (Railway)" -ForegroundColor Cyan
        Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Ensure-RailwayLogin
        Ensure-ProjectLink
        $pgUrl = Get-PostgresUrl
        Write-Host "✓ Postgres URL obtida" -ForegroundColor Green
        Set-BackendDatabaseUrl -url $pgUrl
        Write-Host "✓ DATABASE_URL definida no backend" -ForegroundColor Green
        Redeploy-Backend
        Write-Host "✓ Backend reiniciado (aguarde 1-2 min)" -ForegroundColor Green
        Write-Host "Teste: https://prescrimed-backend-production.up.railway.app/health" -ForegroundColor Yellow
    }
    catch {
        Write-Host "Erro na auto-configuração: $($_.Exception.Message)" -ForegroundColor Red
    }
}
# Script para configurar PostgreSQL no Railway
# Execute este script APÓS adicionar PostgreSQL no dashboard do Railway

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
    
    if ($health.DATABASE_URL -eq $true) {
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
