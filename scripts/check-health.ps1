param(
  [string]$Url,
  [string]$Domain
)

# Constrói a URL a partir de domínio, se necessário
if (-not $Url) {
  if ($Domain) {
    $Url = "https://$Domain/health"
  } elseif ($env:RAILWAY_PUBLIC_DOMAIN) {
    $Url = "https://$env:RAILWAY_PUBLIC_DOMAIN/health"
  } else {
    Write-Host "❌ Informe -Url https://seu-subdominio.up.railway.app/health ou -Domain seu-subdominio.up.railway.app" -ForegroundColor Red
    exit 1
  }
}

Write-Host "🔎 Verificando health: $Url" -ForegroundColor Cyan

try {
  $r = Invoke-RestMethod -Uri $Url -TimeoutSec 10
  $status = $r.status
  $db = $r.database
  $uptime = [math]::Round([double]$r.uptime, 2)
  Write-Host "✅ OK | status: $status | db: $db | uptime: ${uptime}s" -ForegroundColor Green
  exit 0
} catch {
  Write-Host "❌ Falha ao acessar $Url" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor DarkRed
  exit 2
}
