param(
  [string] $BackendServiceName = "prescrimed-backend",
  [string] $PostgresServiceName = "Postgres"
)

function Get-RailwayRunner {
  # Prefer npx to avoid PowerShell shim issues
  $npx = Get-Command npx -ErrorAction SilentlyContinue
  if ($npx) { return @{ File = $npx.Source; BaseArgs = @('railway') } }
  $railway = Get-Command railway -ErrorAction SilentlyContinue
  if ($railway) { return @{ File = $railway.Source; BaseArgs = @() } }
  throw "Railway CLI nao encontrado. Instale com: npm i -g railway ou use npx."
}

function Invoke-Railway {
  param([string[]] $Args)
  $runner = Get-RailwayRunner
  $argumentList = ($runner.BaseArgs + $Args) | Where-Object { $_ -ne $null -and $_ -ne '' }
  Write-Host ("-> {0} {1}" -f $runner.File, ($argumentList -join ' ')) -ForegroundColor DarkGray
  $filePath = $runner.File
  if ($filePath -like '*.ps1') {
    $filePath = (Get-Command powershell).Source
    $argumentList = @('-ExecutionPolicy','Bypass','-File', $runner.File) + $argumentList
  }
  $p = Start-Process -FilePath $filePath -ArgumentList $argumentList -PassThru -NoNewWindow
  $p.WaitForExit()
  return $p.ExitCode
}

function Get-RailwayOutput {
  param([string[]] $Args)
  $runner = Get-RailwayRunner
  $argumentList = ($runner.BaseArgs + $Args) | Where-Object { $_ -ne $null -and $_ -ne '' }
  $outFile = Join-Path $env:TEMP "railway_out_$(Get-Random).txt"
  $filePath = $runner.File
  if ($filePath -like '*.ps1') {
    $filePath = (Get-Command powershell).Source
    $argumentList = @('-ExecutionPolicy','Bypass','-File', $runner.File) + $argumentList
  }
  $p = Start-Process -FilePath $filePath -ArgumentList $argumentList -RedirectStandardOutput $outFile -PassThru -NoNewWindow
  $p.WaitForExit()
  if (-not (Test-Path $outFile)) { return "" }
  return Get-Content $outFile -Raw -ErrorAction SilentlyContinue
}

function Ensure-RailwayLogin {
  $exit = Invoke-Railway -Args @('whoami')
  if ($exit -ne 0) {
    Write-Host "Abrindo login no navegador..." -ForegroundColor Yellow
    $runner = Get-RailwayRunner
    Start-Process -FilePath $runner.File -ArgumentList ($runner.BaseArgs + @('login')) | Out-Null
    Write-Host "Conclua o login e pressione Enter para continuar." -ForegroundColor Yellow
    Read-Host | Out-Null
  }
}

function Ensure-ProjectLink {
  $exit = Invoke-Railway -Args @('status')
  if ($exit -ne 0) {
    $runner = Get-RailwayRunner
    # Open interactive 'link' in a separate window for user selection
    Write-Host "Abrindo 'railway link' para associar o projeto..." -ForegroundColor Yellow
    Start-Process -FilePath $runner.File -ArgumentList ($runner.BaseArgs + @('link')) | Out-Null
    Write-Host "Conclua o link e pressione Enter para continuar." -ForegroundColor Yellow
    Read-Host | Out-Null
    $exit2 = Invoke-Railway -Args @('status')
    if ($exit2 -ne 0) { throw "Projeto nao linkado. Execute 'railway link' e tente novamente." }
  }
}

function Get-PostgresUrl {
  $text = Get-RailwayOutput -Args @('variables','--service', $PostgresServiceName)
  if (-not $text) { throw "Nao foi possivel ler variaveis do servico Postgres." }
  # Try direct regex for postgres URL anywhere in output
  $regex = 'postgres(?:ql)?://[^\s\"]+'
  $m = [regex]::Match($text, $regex)
  if ($m.Success) { return $m.Value }
  # Try KEY=VALUE formats
  $lines = $text -split "`r?`n"
  $url = ($lines | Where-Object { $_ -match '^DATABASE_URL\s*=' }) -replace '^DATABASE_URL\s*=',''
  if (-not $url -or $url.Trim() -eq '') {
    $url = ($lines | Where-Object { $_ -match '^POSTGRES_URL\s*=' }) -replace '^POSTGRES_URL\s*=',''
  }
  if (-not $url -or $url.Trim() -eq '') {
    # Try table-like output: lines containing DATABASE_URL and a postgres URL
    $line = ($lines | Where-Object { $_ -match 'DATABASE_URL' }) | Select-Object -First 1
    if ($line) {
      $m2 = [regex]::Match($line, $regex)
      if ($m2.Success) { $url = $m2.Value }
    }
  }
  if (-not $url -or $url.Trim() -eq '') {
    # Emit output for debugging
    Write-Host "Variaveis Postgres (brutas):" -ForegroundColor Yellow
    Write-Host $text
    throw "DATABASE_URL nao encontrado nas variaveis do servico Postgres."
  }
  return $url.Trim()
}

function Set-BackendDatabaseUrl([string] $url) {
  Invoke-Railway -Args @('variables','set','--service', $BackendServiceName, 'DATABASE_URL', $url) | Out-Null
}

function Redeploy-Backend {
  # Prefer redeploy of service to avoid uploading local project
  Invoke-Railway -Args @('redeploy','--service', $BackendServiceName) | Out-Null
}

try {
  Write-Host "============================================================" -ForegroundColor Cyan
  Write-Host "AUTO CONFIG: DATABASE_URL (Railway)" -ForegroundColor Cyan
  Write-Host "============================================================" -ForegroundColor Cyan
  Ensure-RailwayLogin
  Ensure-ProjectLink
  $pgUrl = Get-PostgresUrl
  Write-Host "OK: Postgres URL obtida" -ForegroundColor Green
  Set-BackendDatabaseUrl -url $pgUrl
  Write-Host "OK: DATABASE_URL definida no backend" -ForegroundColor Green
  Redeploy-Backend
  Write-Host "OK: Backend reiniciado (aguarde 1-2 min)" -ForegroundColor Green
  Write-Host "Teste: https://prescrimed-backend-production.up.railway.app/health" -ForegroundColor Yellow
}
catch {
  $msg = $_.Exception.Message
  Write-Host ("Erro na auto-configuracao: {0}" -f $msg) -ForegroundColor Red
  exit 1
}
