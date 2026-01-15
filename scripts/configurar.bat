@echo off
chcp 65001 >nul
cls

echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║           🚀 PRESCRIMED - CONFIGURAÇÃO MONGODB ATLAS 🚀           ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.
echo.

echo ═══════════════════════════════════════════════════════════════════
echo   OPÇÃO 1: MONGODB ATLAS (NUVEM - RECOMENDADO) ☁️
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   ✅ Grátis para sempre (512MB)
echo   ✅ Acesso de qualquer lugar
echo   ✅ Backup automático
echo   ✅ Altamente disponível
echo.
echo   Login: cristiano.s.santos@ba.estudante.senai.br
echo   Senha: 18042016
echo.
echo   📖 Guia completo: MONGODB_ATLAS_GUIA.md
echo.

set /p "opcao1=Deseja abrir o MongoDB Atlas agora? (S/N): "
if /i "%opcao1%"=="S" (
    echo.
    echo ⏳ Abrindo MongoDB Atlas...
    start https://cloud.mongodb.com/v2
    echo ✅ Atlas aberto! Siga o guia MONGODB_ATLAS_GUIA.md
    echo.
)

echo.
echo ═══════════════════════════════════════════════════════════════════
echo   OPÇÃO 2: MONGODB LOCAL (SEM INSTALAÇÃO) 🔧
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   ✅ Roda na memória RAM
echo   ✅ Não precisa instalar MongoDB
echo   ✅ Perfeito para testes
echo   ⚠️ Dados são perdidos ao reiniciar
echo.

set /p "opcao2=Deseja usar MongoDB em memória? (S/N): "
if /i "%opcao2%"=="S" (
    echo.
    echo ⏳ Iniciando MongoDB em memória...
    start "MongoDB Memory" cmd /k "node start-mongo-memory.js"
    timeout /t 5 >nul
    echo ✅ MongoDB iniciado!
    goto INICIAR_SISTEMA
)

echo.
echo ═══════════════════════════════════════════════════════════════════
echo   OPÇÃO 3: MONGODB LOCAL INSTALADO 💻
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   Se você já tem MongoDB instalado localmente...
echo.

set /p "opcao3=Você tem MongoDB instalado? (S/N): "
if /i "%opcao3%"=="S" (
    echo.
    echo ⏳ Verificando MongoDB...
    mongod --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ MongoDB encontrado!
        echo ⏳ Iniciando MongoDB local...
        start "MongoDB Server" cmd /k "mongod --dbpath data\db"
        timeout /t 3 >nul
        goto INICIAR_SISTEMA
    ) else (
        echo ❌ MongoDB não encontrado no PATH
        echo 📥 Baixe em: https://www.mongodb.com/try/download/community
        echo.
        set /p "instalar=Deseja abrir a página de download? (S/N): "
        if /i "!instalar!"=="S" (
            start https://www.mongodb.com/try/download/community
        )
    )
)

echo.
echo ═══════════════════════════════════════════════════════════════════

:INICIAR_SISTEMA
echo.
echo ═══════════════════════════════════════════════════════════════════
echo   🚀 INICIANDO SISTEMA PRESCRIMED
echo ═══════════════════════════════════════════════════════════════════
echo.

set /p "iniciar=Deseja iniciar o sistema agora? (S/N): "
if /i "%iniciar%"=="S" (
    echo.
    echo ⏳ Iniciando Backend (porta 5000)...
    start "PrescrIMed Backend" cmd /k "npm run dev"
    
    timeout /t 3 >nul
    
    echo ⏳ Iniciando Frontend (porta 5173)...
    start "PrescrIMed Frontend" cmd /k "cd client && npm run dev"
    
    timeout /t 5 >nul
    
    echo.
    echo ╔═══════════════════════════════════════════════════════════════════╗
    echo ║                    ✅ SISTEMA INICIADO COM SUCESSO! ✅            ║
    echo ╚═══════════════════════════════════════════════════════════════════╝
    echo.
    echo   📊 Backend:  http://localhost:5000
    echo   🌐 Frontend: http://localhost:5173
    echo.
    echo   📖 Documentação completa: README.md
    echo   🔧 Guia MongoDB Atlas: MONGODB_ATLAS_GUIA.md
    echo.
    
    set /p "abrir=Deseja abrir o sistema no navegador? (S/N): "
    if /i "!abrir!"=="S" (
        echo ⏳ Abrindo navegador...
        start http://localhost:5173
        echo ✅ Navegador aberto!
    )
)

echo.
echo ═══════════════════════════════════════════════════════════════════
echo   📚 PRÓXIMOS PASSOS
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   1. Se escolheu Atlas: Configure seguindo MONGODB_ATLAS_GUIA.md
echo   2. Acesse: http://localhost:5173
echo   3. Clique em "Registrar"
echo   4. Preencha os dados da primeira empresa
echo   5. Comece a usar! 🎉
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.

pause
