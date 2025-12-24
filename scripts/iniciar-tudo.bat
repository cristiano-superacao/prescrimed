@echo off
echo ========================================
echo   PRESCRIMED - Inicializacao Completa
echo ========================================
echo.

:: Matar processos anteriores
taskkill /F /IM node.exe >nul 2>&1

echo [1/3] Iniciando MongoDB Memory Server...
start "MongoDB Memory" cmd /k "node start-mongo-memory.js"
timeout /t 5 /nobreak >nul

echo [2/3] Iniciando Backend API...
start "Backend API" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo [3/3] Iniciando Frontend React...
start "Frontend React" cmd /k "cd client && npm run dev"
timeout /t 8 /nobreak >nul

echo.
echo ========================================
echo   SISTEMA INICIADO COM SUCESSO!
echo ========================================
echo.
echo   MongoDB:  Rodando em background
echo   Backend:  http://localhost:3000
echo   Frontend: http://localhost:5173
echo.
echo   Credenciais de Login:
echo   Email: superadmin@prescrimed.com
echo   Senha: admin123456
echo.
echo ========================================
echo   Abrindo navegador...
echo ========================================
echo.

timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo Sistema pronto! Pressione qualquer tecla para sair...
pause >nul
