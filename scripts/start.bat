@echo off
chcp 65001 > nul
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                   PRESCRIMED SYSTEM                            ║
echo ║                  Iniciando Sistema...                          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo 🔍 Verificando dependências...
if not exist node_modules (
    echo ❌ Dependências do backend não instaladas!
    echo 📥 Execute primeiro: install.bat
    pause
    exit /b 1
)

if not exist client\node_modules (
    echo ❌ Dependências do frontend não instaladas!
    echo 📥 Execute primeiro: install.bat
    pause
    exit /b 1
)
echo ✓ Dependências instaladas
echo.

echo 🔍 Verificando configuração...
if not exist .env (
    echo ❌ Arquivo .env não encontrado!
    echo 📥 Execute primeiro: install.bat
    pause
    exit /b 1
)
echo ✓ Configuração OK
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                  🚀 INICIANDO SERVIDORES                       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🔧 Backend:  http://localhost:5000/api
echo 🌐 Frontend: http://localhost:5173
echo.
echo 💡 Pressione Ctrl+C em cada janela para parar
echo.
echo ⏳ Aguarde os servidores iniciarem (15-30 segundos)...
echo.

start "🔧 PrescrIMed Backend Server" cmd /k "color 0A && npm run dev"
timeout /t 5 /nobreak >nul
start "🌐 PrescrIMed Frontend Server" cmd /k "color 0B && cd client && npm run dev"

timeout /t 3 /nobreak >nul
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ✅ SISTEMA INICIADO!                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🌐 Acesse o sistema em: http://localhost:5173
echo.
echo 📝 Primeiro Acesso:
echo    1. Clique em "Cadastrar Empresa"
echo    2. Preencha os dados da sua empresa
echo    3. Você será o administrador automaticamente!
echo.
echo 💡 Duas janelas foram abertas (Backend e Frontend)
echo    Mantenha-as abertas enquanto usa o sistema
echo.
pause
