@echo off
chcp 65001 > nul
cls

echo.
echo ╔═══════════════════════════════════════════════════╗
echo ║         🚀 PRESCRIMED - INICIAR SISTEMA          ║
echo ╚═══════════════════════════════════════════════════╝
echo.

REM Parar processos Node.js existentes
echo [1/4] 🛑 Parando servidores existentes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Limpar cache do npm
echo [2/4] 🧹 Limpando cache...
cd client
call npm cache clean --force >nul 2>&1
cd ..

REM Iniciar MongoDB Memory Server
echo [3/4] 🗄️  Iniciando MongoDB Memory Server...
start "MongoDB Memory Server" cmd /k "node start-mongo-memory.js"
timeout /t 8 /nobreak >nul

REM Iniciar Backend API
echo [4/4] ⚙️  Iniciando Backend API (porta 8000)...
start "Backend API - Porta 8000" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

REM Iniciar Frontend React
echo [5/5] 🎨 Iniciando Frontend React (porta 5173)...
start "Frontend React - Porta 5173" cmd /k "cd client && npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo ╔═══════════════════════════════════════════════════╗
echo ║           ✅ SISTEMA INICIADO COM SUCESSO         ║
echo ╚═══════════════════════════════════════════════════╝
echo.
echo 📊 MongoDB Memory: rodando
echo 🔧 Backend API:    http://localhost:8000
echo 🎨 Frontend App:   http://localhost:5173
echo.
echo 🔐 Credenciais:
echo    Email: superadmin@prescrimed.com
echo    Senha: admin123456
echo.
echo 💡 Pressione qualquer tecla para abrir o navegador...
pause >nul

start http://localhost:5173

echo.
echo ✅ Sistema pronto! Pressione qualquer tecla para sair...
pause >nul
