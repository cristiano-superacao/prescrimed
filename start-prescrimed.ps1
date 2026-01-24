# Script PowerShell para rodar Prescrimed com MySQL local ou Locaweb
# Carrega variáveis do .env (se existir) e inicia o backend em modo produção

# Carregar variáveis do .env se disponível
if (Test-Path .env) {
    Write-Host "Carregando variáveis do .env..."
    Get-Content .env | ForEach-Object {
        if ($_ -match '^(\w+)=(.*)$') {
            $name = $matches[1]
            $value = $matches[2]
            [System.Environment]::SetEnvironmentVariable($name, $value)
        }
    }
}

# Setar variáveis essenciais manualmente (caso não estejam no .env)
$env:NODE_ENV = "production"
if (-not $env:MYSQL_HOST) { $env:MYSQL_HOST = "localhost" }
if (-not $env:MYSQL_PORT) { $env:MYSQL_PORT = "3306" }
if (-not $env:MYSQL_DATABASE) { $env:MYSQL_DATABASE = "prescrimed" }
if (-not $env:MYSQL_USER) { $env:MYSQL_USER = "prescrimed" }
if (-not $env:MYSQL_PASSWORD) { $env:MYSQL_PASSWORD = "c18042016Cs@23" }

Write-Host "Iniciando build do frontend..."
cmd /c "npm run build:client"

Write-Host "Iniciando backend Prescrimed em modo produção..."
node server.js
