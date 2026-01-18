@echo off
chcp 65001 >nul
title Prescrimed - Diagnóstico do Sistema
color 0B

echo.
echo ============================================
echo    🔍 DIAGNÓSTICO DO SISTEMA PRESCRIMED
echo ============================================
echo.

echo [1/6] Verificando Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo    Instale em: https://nodejs.org
    goto :diagnostico_final
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo ✅ Node.js %NODE_VERSION% instalado
)

echo.
echo [2/6] Verificando NPM...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ NPM não encontrado!
    goto :diagnostico_final
) else (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo ✅ NPM %NPM_VERSION% instalado
)

echo.
echo [3/6] Verificando processos Node.js...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if %errorlevel% equ 0 (
    echo ✅ Processos Node.js em execução:
    tasklist /FI "IMAGENAME eq node.exe" /FO TABLE
) else (
    echo ⚠️  Nenhum processo Node.js em execução
    echo    O backend pode não estar rodando!
)

echo.
echo [4/6] Verificando porta 3000 (Backend)...
netstat -an | find ":3000" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ✅ Porta 3000 está em uso (Backend rodando)
) else (
    echo ❌ Porta 3000 livre (Backend NÃO está rodando)
    echo    Execute: INICIAR_SISTEMA_COMPLETO.bat
)

echo.
echo [5/6] Verificando porta 5173 (Frontend)...
netstat -an | find ":5173" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ✅ Porta 5173 está em uso (Frontend rodando)
) else (
    echo ⚠️  Porta 5173 livre (Frontend NÃO está rodando)
)

echo.
echo [6/6] Testando conexão com o backend...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/health' -UseBasicParsing -TimeoutSec 3; if ($response.StatusCode -eq 200) { Write-Host '✅ Backend respondendo corretamente' -ForegroundColor Green } } catch { Write-Host '❌ Backend não está respondendo' -ForegroundColor Red }"

:diagnostico_final
echo.
echo ============================================
echo    📋 RESUMO DO DIAGNÓSTICO
echo ============================================
echo.
echo Se o backend não estiver rodando:
echo   1. Execute: INICIAR_SISTEMA_COMPLETO.bat
echo   2. Aguarde ~10 segundos
echo   3. Execute este diagnóstico novamente
echo.
echo Se os erros 404 persistirem:
echo   1. Verifique se há erros no terminal do backend
echo   2. Confirme se as dependências estão instaladas:
echo      npm install
echo   3. Limpe processos: PARAR_SISTEMA.bat
echo   4. Reinicie: INICIAR_SISTEMA_COMPLETO.bat
echo.
echo 📱 URLs do Sistema:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3000
echo   Health:   http://localhost:3000/health
echo.

pause
