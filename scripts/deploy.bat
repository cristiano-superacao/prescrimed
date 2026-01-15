@echo off
chcp 65001 >nul
cls

echo.
echo ============================================
echo   🚀 PRESCRIMED - DEPLOY AUTOMATIZADO
echo ============================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não encontrado!
    echo.
    echo Por favor, instale o Node.js em: https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Verificar se Netlify CLI está instalado
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Netlify CLI não encontrado. Instalando...
    echo.
    npm install -g netlify-cli
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Falha ao instalar Netlify CLI
        pause
        exit /b 1
    )
    echo ✅ Netlify CLI instalado com sucesso!
    echo.
)

REM Executar script de deploy
echo 🔄 Iniciando script de deploy...
echo.
node deploy.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo   ✅ DEPLOY CONCLUÍDO COM SUCESSO!
    echo ============================================
    echo.
) else (
    echo.
    echo ============================================
    echo   ❌ ERRO NO PROCESSO DE DEPLOY
    echo ============================================
    echo.
)

pause
