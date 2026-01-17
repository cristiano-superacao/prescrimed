Param(
  [string]$Port = "8501"
)

Write-Host "[Streamlit] Preparando ambiente virtual..."

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
  Write-Error "Python não encontrado no PATH. Instale Python 3.11+ e tente novamente."; exit 1
}

$venvPath = Join-Path $PSScriptRoot "..\.venv-streamlit"
if (-not (Test-Path $venvPath)) {
  python -m venv $venvPath
}

Write-Host "[Streamlit] Ativando venv..."
. "$venvPath\Scripts\Activate.ps1"

python -m pip install --upgrade pip
pip install -r "$PSScriptRoot\..\streamlit\requirements.txt"

Write-Host "[Streamlit] Iniciando dashboard em http://localhost:$Port"
$env:PRESCRIMED_BACKEND = "https://prescrimed-backend-production.up.railway.app"
streamlit run "$PSScriptRoot\..\streamlit\app.py" --server.port $Port