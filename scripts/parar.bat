@echo off
chcp 65001 >nul
cls

echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║              🛑 PRESCRIMED - PARAR SISTEMA 🛑                    ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.
echo   ⏳ Encerrando todos os processos Node.js...
echo.

taskkill /F /IM node.exe >nul 2>&1

if %errorlevel% equ 0 (
    echo   ✅ Sistema parado com sucesso!
) else (
    echo   ℹ️  Nenhum processo Node.js estava em execução.
)

echo.
echo   Pressione qualquer tecla para fechar...
pause >nul
