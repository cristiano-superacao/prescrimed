@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║          🚀 DEPLOY AUTOMÁTICO - NETLIFY               ║
echo ╚════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0client"

echo 📦 Gerando build de produção...
echo.
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Erro ao gerar build!
    pause
    exit /b 1
)

echo.
echo ✅ Build gerado com sucesso!
echo.
echo 📋 Copiando arquivo _redirects...
copy /Y "public\_redirects" "dist\_redirects" >nul

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao copiar _redirects
    pause
    exit /b 1
)

echo ✅ Arquivo _redirects copiado!
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                  ✅ BUILD PRONTO!                     ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 📂 Pasta de deploy: client\dist\
echo.
echo 🚀 OPÇÕES DE DEPLOY:
echo.
echo 1. MANUAL (Arraste e Solte)
echo    ▸ Acesse: https://app.netlify.com/drop
echo    ▸ Arraste a pasta: client\dist
echo.
echo 2. GIT (Automático)
echo    ▸ Conecte seu GitHub no Netlify
echo    ▸ Build: cd client ^&^& npm run build
echo    ▸ Publish: client/dist
echo.
echo 3. CLI NETLIFY
echo    ▸ npm install -g netlify-cli
echo    ▸ netlify login
echo    ▸ netlify deploy --prod --dir=dist
echo.
echo ✅ Layout responsivo e profissional mantidos!
echo.
pause
