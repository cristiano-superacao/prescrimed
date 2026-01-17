Param(
  [string]$PythonExe = "python"
)

Write-Host "[Streamlit] Criando ambiente virtual..." -ForegroundColor Cyan

$root = Split-Path $MyInvocation.MyCommand.Path -Parent
$streamlitDir = Join-Path (Split-Path $root -Parent) "streamlit"
$venvDir = Join-Path $streamlitDir ".venv"

If (-Not (Test-Path $streamlitDir)) {
  Throw "Diretório 'streamlit' não encontrado."
}

# Verificar Python
$pythonCmd = Get-Command $PythonExe -ErrorAction SilentlyContinue
If (-Not $pythonCmd) {
  Throw "Python não encontrado. Instale Python 3.10+ e tente novamente."
}

Push-Location $streamlitDir

# Criar venv se não existir
If (-Not (Test-Path $venvDir)) {
  & $PythonExe -m venv ".venv"
}

# Ativar venv
$activate = Join-Path $venvDir "Scripts\Activate.ps1"
If (-Not (Test-Path $activate)) {
  Throw "Arquivo de ativação não encontrado: $activate"
}
.
 $activate

# Atualizar pip e instalar requisitos
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

Pop-Location
Write-Host "[Streamlit] Ambiente pronto em $venvDir" -ForegroundColor Green
