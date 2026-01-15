@echo off
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║       INICIANDO SISTEMA PRESCRIMED               ║
echo ╚══════════════════════════════════════════════════╝
echo.

REM Limpar processos antigos
echo [1/4] Limpando processos antigos...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM mongod.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Iniciar MongoDB
echo [2/4] Iniciando MongoDB...
start /B node start-mongo-memory.js
timeout /t 3 /nobreak >nul

REM Iniciar Backend
echo [3/4] Iniciando Backend (porta 3000)...
start /MIN cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

REM Iniciar Frontend
echo [4/4] Iniciando Frontend (porta 5173)...
cd client
start /MIN cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ╔══════════════════════════════════════════════════╗
echo ║           ✓ SISTEMA INICIADO!                   ║
echo ╚══════════════════════════════════════════════════╝
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000
echo.
echo Login: superadmin@prescrimed.com
echo Senha: super123
echo.
echo Pressione qualquer tecla para abrir o navegador...
pause >nul

start http://localhost:5173

echo.
echo Sistema rodando! Feche esta janela quando terminar.
echo.
pause
