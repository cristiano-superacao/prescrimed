Param(
  [string]$ApiBase = "https://prescrimed-backend-production.up.railway.app/api"
)

$root = Split-Path $MyInvocation.MyCommand.Path -Parent
$streamlitDir = Join-Path (Split-Path $root -Parent) "streamlit"
$venvDir = Join-Path $streamlitDir ".venv"

If (-Not (Test-Path $venvDir)) {
  Throw "Ambiente virtual não encontrado em $venvDir. Execute setup-streamlit.ps1 primeiro."
}

Push-Location $streamlitDir
$env:API_BASE = $ApiBase
. "$venvDir\Scripts\Activate.ps1"
streamlit run app.py --server.port 8501 --server.address 0.0.0.0
Pop-Location
# Runs Streamlit dashboard in a local venv
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Proj = Split-Path -Parent $Root
$AppDir = Join-Path $Proj "streamlit-app"
$Venv = Join-Path $AppDir ".venv"

if (!(Test-Path $Venv)) {
  Write-Host "Creating Python venv in $Venv" -ForegroundColor Cyan
  py -m venv $Venv
}

$Py = Join-Path $Venv "Scripts/python.exe"
$Pip = Join-Path $Venv "Scripts/pip.exe"

& $Pip install --upgrade pip
& $Pip install -r (Join-Path $AppDir "requirements.txt")

Write-Host "Starting Streamlit app..." -ForegroundColor Green
& $Py -m streamlit run (Join-Path $AppDir "app.py") --server.port 8501 --server.headless true
