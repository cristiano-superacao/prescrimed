@echo off
SETLOCAL ENABLEEXTENSIONS
REM Reset das configurações locais para rodar o Prescrimed

REM Ir para a raiz do projeto (este arquivo está em scripts/)
cd /d "%~dp0.."

REM Copiar .env.example para .env
IF EXIST .env DEL /F /Q .env
COPY /Y .env.example .env >NUL

REM Limpar build do frontend (vite)
IF EXIST client\dist rmdir /S /Q client\dist

ECHO [OK] Configuração local resetada. Use os comandos:
ECHO   npm install
ECHO   cd client && npm install && cd ..
ECHO   npm run dev:full

ENDLOCAL
