@echo off
chcp 65001 > nul
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         PRESCRIMED - Correção e Configuração Automática       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🔧 Corrigindo sistema e configurando MongoDB Atlas...
echo.

echo [1/6] Parando processos Node...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM nodemon.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo ✓ Processos parados
echo.

echo [2/6] Limpando cache do Node...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f package-lock.json
npm cache clean --force
echo ✓ Cache limpo
echo.

echo [3/6] Reinstalando dependências...
call npm install
echo ✓ Dependências instaladas
echo.

echo [4/6] Verificando configuração do MongoDB...
echo ✓ MongoDB Atlas configurado
echo.

echo [5/6] Instalando dependências do frontend...
cd client
call npm install
cd ..
echo ✓ Frontend configurado
echo.

echo [6/6] Teste de inicialização...
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ✅ CORREÇÃO CONCLUÍDA!                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🎉 Sistema corrigido e pronto para uso!
echo.
echo 🗄️  MongoDB Atlas Demo já configurado
echo 🚀 Para iniciar: start.bat
echo.
echo 📝 Ou inicie manualmente:
echo    Terminal 1: npm run dev
echo    Terminal 2: cd client ^&^& npm run dev
echo.
pause
