@echo off
chcp 65001 >nul
title Prescrimed - Inicializador
color 0A

echo.
echo Iniciando Prescrimed...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0iniciar-sistema.ps1"

if %errorlevel% neq 0 (
    echo.
    echo ❌ Erro ao iniciar o sistema!
    echo.
    pause
    exit /b 1
)

echo ⚠️  IMPORTANTE: Não feche esta janela!
echo    Para parar o sistema, use PARAR_SISTEMA.bat
echo.
echo ============================================

timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo Sistema rodando... Pressione qualquer tecla para voltar ao menu.
pause >nul
