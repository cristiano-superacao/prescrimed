# Reset das configurações locais para rodar o Prescrimed
param()

# Ir para a raiz do projeto
Set-Location (Join-Path $PSScriptRoot '..')

# Copiar .env.example para .env
if (Test-Path ".env") { Remove-Item ".env" -Force }
Copy-Item ".env.example" ".env" -Force

# Limpar build do frontend
if (Test-Path "client/dist") { Remove-Item "client/dist" -Recurse -Force }

Write-Host "[OK] Configuração local resetada. Comandos sugeridos:" -ForegroundColor Green
Write-Host "  npm install"
Write-Host "  cd client && npm install && cd .."
Write-Host "  npm run dev:full"
