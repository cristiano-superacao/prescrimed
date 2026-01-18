@echo off
chcp 65001 > nul
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                   PRESCRIMED SYSTEM                            ║
echo ║              Instalação Automática Completa                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🔄 Iniciando instalação automática...
echo.

echo [1/4] ✓ Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo.
    echo 📥 Por favor, instale o Node.js:
    echo    https://nodejs.org
    pause
    exit /b 1
)
node --version
echo.

echo [2/4] 📦 Instalando dependências do Backend...
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências do backend!
    pause
    exit /b 1
)
echo ✓ Backend instalado com sucesso!
echo.

echo [3/4] 📦 Instalando dependências do Frontend...
cd client
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências do frontend!
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend instalado com sucesso!
echo.

echo [4/4] 🗄️  Configurando ambiente local (SQLite)...
if not exist .env (
    echo ⚠️  Criando arquivo .env...
    (
        echo NODE_ENV=development
        echo PORT=8000
        echo # Para usar PostgreSQL local, defina PGHOST/PGUSER/PGPASSWORD/PGDATABASE (opcional)
        echo # Para usar PostgreSQL do Railway/Cloud, defina DATABASE_URL (opcional)
    ) > .env
)

if not exist client\.env (
    echo ⚠️  Criando arquivo .env do frontend...
    (
        echo VITE_API_URL=http://localhost:8000/api
    ) > client\.env
)
echo ✓ Ambiente local configurado (SQLite)!
echo.

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ✅ INSTALAÇÃO CONCLUÍDA!                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🎉 Sistema PrescrIMed instalado com sucesso!
echo.
echo 🗄️  Banco de Dados: SQLite (local - pronto para usar)
echo 🚀 Para iniciar o sistema: start.bat
echo.
echo 📖 Ou inicie manualmente:
echo    Terminal 1: npm run dev
echo    Terminal 2: cd client ^&^& npm run dev
echo.
echo 🌐 Após iniciar, acesse: http://localhost:5173
echo.
echo 📝 Primeiro Acesso:
echo    1. Cadastre sua empresa
echo    2. Você será o administrador
echo    3. Comece a usar!
echo.
pause