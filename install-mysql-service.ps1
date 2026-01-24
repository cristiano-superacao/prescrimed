# Script para instalar e configurar o serviço MySQL80
# Execute este script como Administrador

Write-Host "Instalando serviço MySQL80..." -ForegroundColor Green

# Instalar o serviço
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe"
$dataDir = "C:\ProgramData\MySQL\MySQL Server 8.0\Data"

# Instalar serviço
& $mysqlPath --install MySQL80 --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"

Write-Host "Aguardando 2 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Iniciar o serviço
Write-Host "Iniciando serviço MySQL80..." -ForegroundColor Green
Start-Service MySQL80

# Verificar status
Write-Host "`nStatus do serviço:" -ForegroundColor Green
Get-Service MySQL80

Write-Host "`nServiço MySQL80 instalado e iniciado com sucesso!" -ForegroundColor Green
