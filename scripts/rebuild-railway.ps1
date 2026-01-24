Param(
  [string]$DatabaseUrl,
  [switch]$WithSeeds = $true
)

Write-Host "🔨 Rebuild Railway PostgreSQL" -ForegroundColor Cyan

if (-not $DatabaseUrl -and -not $env:DATABASE_URL) {
  $DatabaseUrl = Read-Host "Cole sua DATABASE_URL (Railway)"
}

if (-not $DatabaseUrl -and -not $env:DATABASE_URL) {
  Write-Error "DATABASE_URL não informada. Passe via parâmetro -DatabaseUrl ou defina no ambiente."
  exit 1
}

if ($DatabaseUrl) { $env:DATABASE_URL = $DatabaseUrl }

$masked = $env:DATABASE_URL -replace ":[^:@]+@", ":***@"
Write-Host "🔑 DATABASE_URL: $masked" -ForegroundColor Yellow

try {
  Write-Host "📡 Executando rebuild (drop + recreate + dados iniciais)…" -ForegroundColor Yellow
  node "scripts/rebuild-railway-database.js"
  if ($LASTEXITCODE -ne 0) { throw "Rebuild retornou código $LASTEXITCODE" }
  Write-Host "✅ Rebuild concluído com sucesso." -ForegroundColor Green
} catch {
  Write-Error "❌ Falha no rebuild: $_"
  exit 1
}

if ($WithSeeds) {
  try {
    Write-Host "🌱 Rodando seeds de domínio (multi-empresa e cenários)…" -ForegroundColor Yellow
    . "scripts/seed-railway.ps1"
    if ($LASTEXITCODE -ne 0) { throw "Seed pós-rebuild retornou código $LASTEXITCODE" }
    Write-Host "✅ Seeds rodados com sucesso." -ForegroundColor Green
  } catch {
    Write-Error "❌ Falha ao rodar seeds pós-rebuild: $_"
    exit 1
  }
}

Write-Host "🩺 Health: https://prescrimed.up.railway.app/health" -ForegroundColor Cyan
