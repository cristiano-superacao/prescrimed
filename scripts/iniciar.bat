@echo off
chcp 65001 >nul
cls

echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║              🚀 PRESCRIMED - INÍCIO RÁPIDO 🚀                    ║
echo ║                   Sistema de Prescrições Médicas                  ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.
echo   ⚡ Iniciando sistema (Backend + Frontend)...
echo   ⏳ Aguarde alguns segundos...
echo.

REM Mata processos Node.js existentes
taskkill /F /IM node.exe >nul 2>&1

timeout /t 2 >nul

REM Inicia Backend
echo ✅ [1/2] Iniciando Backend (porta 8000)...
start "🔧 PrescrIMed Backend" cmd /k "cd /d "%~dp0" && npm run dev"
timeout /t 5 >nul

REM Inicia Frontend
echo ✅ [2/2] Iniciando Frontend (porta 5173)...
start "🌐 PrescrIMed Frontend" cmd /k "cd /d "%~dp0client" && npm run dev"
timeout /t 5 >nul

cls
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║              ✅ SISTEMA PRESCRIMED INICIADO! ✅                   ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.
echo   🎉 Tudo pronto para usar!
echo.
echo   📊 Backend:  http://localhost:8000
echo   🌐 Frontend: http://localhost:5173
echo   🗄️  Banco:    SQLite local (arquivo database.sqlite)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo   🚪 PRIMEIRO ACESSO
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   1. Acesse: http://localhost:5173
echo   2. Clique em "Registrar" (canto superior direito)
echo   3. Preencha os dados da sua empresa/clínica
echo   4. Você será o primeiro usuário ADMINISTRADOR
echo   5. Comece a cadastrar pacientes e prescrições! 🎊
echo.
echo ═══════════════════════════════════════════════════════════════════
echo   📚 RECURSOS
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   📖 README.md              - Documentação completa
echo   🔧 Railway/Deploy         - Configure DATABASE_URL no provedor
echo   ⚙️  configurar.bat         - Opções avançadas
echo   🛠️  COMO_INICIAR.md        - Guia de inicialização
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.

REM Abre o navegador
timeout /t 3 >nul
echo ⏳ Abrindo navegador...
start http://localhost:5173

echo.
echo ✅ Sistema aberto no navegador!
echo.
echo ═══════════════════════════════════════════════════════════════════
echo   ⚠️  IMPORTANTE
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   • Por padrão, os dados ficam em SQLite (arquivo local)
echo   • Para ambiente multiusuário/produção, use PostgreSQL (DATABASE_URL)
echo.
echo   • Para PARAR o sistema: Feche as 3 janelas do terminal
echo   • Para REINICIAR: Execute este arquivo novamente
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   Pressione qualquer tecla para fechar esta janela...
echo   (As outras 3 janelas devem permanecer abertas!)
echo.
pause >nul
