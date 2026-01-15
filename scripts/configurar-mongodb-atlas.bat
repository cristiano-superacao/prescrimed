@echo off
chcp 65001 >nul
cls

echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║           🔧 CONFIGURAÇÃO MONGODB ATLAS - PRESCRIMED 🔧           ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.
echo.

echo ═══════════════════════════════════════════════════════════════════
echo   📋 SUAS CREDENCIAIS MONGODB ATLAS
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   Email: cristiano.s.santos@ba.estudante.senai.br
echo   Senha: 18042016
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.

set /p "abrir_atlas=Deseja abrir o MongoDB Atlas no navegador? (S/N): "
if /i "%abrir_atlas%"=="S" (
    echo.
    echo ⏳ Abrindo MongoDB Atlas...
    start https://cloud.mongodb.com
    echo ✅ Atlas aberto! Faça login com suas credenciais acima.
    echo.
)

echo ═══════════════════════════════════════════════════════════════════
echo   📝 INSTRUÇÕES
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   1. Faça login no Atlas com suas credenciais
echo   2. Vá em "Database" ^> Clique em "Connect" no seu cluster
echo   3. Escolha "Connect your application"
echo   4. Copie a string de conexão
echo   5. Cole a string quando solicitado abaixo
echo.
echo   ⚠️  IMPORTANTE: Substitua na string:
echo       - ^<password^> pela senha do usuário do banco
echo       - ^<dbname^> por 'prescrimed'
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.

:INPUT_URI
set /p "mongodb_uri=Cole aqui a string de conexão do MongoDB Atlas: "

if "%mongodb_uri%"=="" (
    echo.
    echo ❌ String de conexão não pode estar vazia!
    echo.
    goto INPUT_URI
)

echo.
echo ⏳ Testando conexão...
echo.

REM Definir variável de ambiente
set MONGODB_URI=%mongodb_uri%

REM Testar conexão
call npm run verify:empresas

if %errorlevel% equ 0 (
    echo.
    echo ✅ Conexão estabelecida com sucesso!
    echo.
    
    set /p "init_db=Deseja inicializar o banco de dados (criar coleções)? (S/N): "
    if /i "!init_db!"=="S" (
        echo.
        echo ⏳ Inicializando banco de dados...
        call npm run init:db
        echo.
    )
    
    set /p "seed_db=Deseja popular o banco com dados de exemplo? (S/N): "
    if /i "!seed_db!"=="S" (
        echo.
        echo ⏳ Populando banco de dados...
        call npm run seed:cloud
        echo.
        
        echo.
        echo ✅ Banco de dados configurado com sucesso!
        echo.
        echo ═══════════════════════════════════════════════════════════════════
        echo   🎉 CONFIGURAÇÃO CONCLUÍDA!
        echo ═══════════════════════════════════════════════════════════════════
        echo.
        echo   📊 Empresas criadas:
        echo      - Casa Bela Vida (casa-repouso)
        echo      - PetCare Premium (petshop)
        echo      - ClinFisio Avançada (fisioterapia)
        echo.
        echo   👤 Credenciais de teste:
        echo      Email: admin.casa@prescrimed.com
        echo      Senha: PrescriMed!2024
        echo.
        echo   🌐 Acesse: https://prescrimed.up.railway.app
        echo.
    )
    
    echo ═══════════════════════════════════════════════════════════════════
    echo   💡 PRÓXIMOS PASSOS
    echo ═══════════════════════════════════════════════════════════════════
    echo.
    echo   1. Configure a mesma URI no Railway (serviço backend)
    echo   2. Configure variáveis do frontend (VITE_API_URL)
    echo   3. Acesse o sistema e faça login
    echo.
    
) else (
    echo.
    echo ❌ Erro ao conectar ao MongoDB!
    echo.
    echo Verifique:
    echo   - A string de conexão está correta?
    echo   - Substituiu ^<password^> pela senha do usuário?
    echo   - O cluster está ativo no Atlas?
    echo   - Seu IP está liberado em Network Access?
    echo.
    echo Consulte o arquivo MONGODB_ATLAS_CONFIG.md para mais detalhes.
    echo.
)

echo.
pause
