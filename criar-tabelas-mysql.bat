@echo off
REM Script para criar as tabelas do Prescrimed automaticamente no MySQL
REM Altere os dados de usuário, senha e host conforme necessário

set MYSQL_USER=prescrimed
set MYSQL_PASS=c18042016Cs@23
set MYSQL_HOST=localhost
set MYSQL_DB=prescrimed
set SQL_FILE=scripts\mysql-schema-prescrimed.sql

REM Executa o script SQL
mysql -u %MYSQL_USER% -p%MYSQL_PASS% -h %MYSQL_HOST% %MYSQL_DB% < %SQL_FILE%

if %ERRORLEVEL% EQU 0 (
    echo Tabelas criadas com sucesso!
) else (
    echo Ocorreu um erro ao criar as tabelas.
)
pause
