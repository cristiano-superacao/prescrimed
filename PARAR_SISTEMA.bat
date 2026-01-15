@echo off
chcp 65001 >nul
title Prescrimed - Parar Sistema
color 0C

echo.
echo ============================================
echo    🛑 PARANDO SISTEMA PRESCRIMED
echo ============================================
echo.

echo 🔄 Encerrando processos Node.js...
taskkill /F /IM node.exe >nul 2>&1

timeout /t 2 /nobreak >nul

echo.
echo ============================================
echo    ✅ SISTEMA PARADO COM SUCESSO!
echo ============================================
echo.

timeout /t 3 /nobreak
exit
