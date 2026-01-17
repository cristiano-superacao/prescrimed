# Script para replicar dados demo no Postgres do Railway
# Mantem o layout responsivo e profissional - apenas muda o banco de dados

Write-Host "`nSEED DE DADOS PARA O RAILWAY" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Verificar se esta na raiz do projeto
if (-not (Test-Path "package.json")) {
    Write-Host "[ERRO] Execute este script na raiz do projeto prescrimed-main" -ForegroundColor Red
    exit 1
}

# Solicitar a DATABASE_URL do Railway
Write-Host "Para pegar a DATABASE_URL:" -ForegroundColor Yellow
Write-Host "   1. Abra o painel do Railway (railway.app)" -ForegroundColor Gray
Write-Host "   2. Selecione seu projeto" -ForegroundColor Gray
Write-Host "   3. Va em 'Variables' ou na aba do Postgres" -ForegroundColor Gray
Write-Host "   4. Copie o valor completo da DATABASE_URL`n" -ForegroundColor Gray

$database_url = Read-Host "Cole aqui a DATABASE_URL do Railway"

if ([string]::IsNullOrWhiteSpace($database_url)) {
    Write-Host "`n[ERRO] DATABASE_URL nao pode estar vazia" -ForegroundColor Red
    exit 1
}

# Validar formato basico
if (-not ($database_url -match "^postgres(ql)?://")) {
    Write-Host "`n[AVISO] A URL nao parece ser do PostgreSQL. Tem certeza? (s/N)" -ForegroundColor Yellow
    $confirm = Read-Host
    if ($confirm -ne "s" -and $confirm -ne "S") {
        Write-Host "[ERRO] Operacao cancelada" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`nConfigurando conexao com Postgres do Railway..." -ForegroundColor Cyan
$env:DATABASE_URL = $database_url

Write-Host "Executando seed de dados demo...`n" -ForegroundColor Green

# Rodar o seed
npm run seed:demo

$exit_code = $LASTEXITCODE

# Limpar variavel de ambiente
Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue

if ($exit_code -eq 0) {
    Write-Host "`n[OK] DADOS REPLICADOS COM SUCESSO!" -ForegroundColor Green
    Write-Host "`nDados criados no Railway:" -ForegroundColor Cyan
    Write-Host "   * 3 empresas (Benevolencia Solidaria, Vital Fisio, Pet Care)" -ForegroundColor Gray
    Write-Host "   * 9 usuarios (3 por empresa: admin, nutri, atendente)" -ForegroundColor Gray
    Write-Host "   * 9 pacientes (3 por empresa)" -ForegroundColor Gray
    Write-Host "   * 9 prescricoes (1 por paciente)`n" -ForegroundColor Gray
    
    Write-Host "Credenciais de acesso (senha: Prescri@2026):" -ForegroundColor Yellow
    Write-Host "   Benevolencia Solidaria:" -ForegroundColor White
    Write-Host "     * admin+benevolencia-solidaria@prescrimed.com" -ForegroundColor Gray
    Write-Host "     * nutri+benevolencia-solidaria@prescrimed.com" -ForegroundColor Gray
    Write-Host "     * atendente+benevolencia-solidaria@prescrimed.com" -ForegroundColor Gray
    Write-Host "`n   Vital Fisio Center:" -ForegroundColor White
    Write-Host "     * admin+vital-fisio-center@prescrimed.com" -ForegroundColor Gray
    Write-Host "     * nutri+vital-fisio-center@prescrimed.com" -ForegroundColor Gray
    Write-Host "     * atendente+vital-fisio-center@prescrimed.com" -ForegroundColor Gray
    Write-Host "`n   Pet Care Premium:" -ForegroundColor White
    Write-Host "     * admin+pet-care-premium@prescrimed.com" -ForegroundColor Gray
    Write-Host "     * nutri+pet-care-premium@prescrimed.com" -ForegroundColor Gray
    Write-Host "     * atendente+pet-care-premium@prescrimed.com`n" -ForegroundColor Gray
    
    Write-Host "Proximos passos:" -ForegroundColor Cyan
    Write-Host "   1. Faca um novo deploy no Railway (ou clique em 'Redeploy')" -ForegroundColor Gray
    Write-Host "   2. Aguarde o deploy finalizar" -ForegroundColor Gray
    Write-Host "   3. Acesse a URL do seu projeto no Railway" -ForegroundColor Gray
    Write-Host "   4. Faca login com qualquer uma das credenciais acima`n" -ForegroundColor Gray
    
    Write-Host "O layout responsivo e profissional esta mantido!" -ForegroundColor Green
} else {
    Write-Host "`n[ERRO] Falha ao executar seed" -ForegroundColor Red
    Write-Host "Verifique se a DATABASE_URL esta correta e tente novamente`n" -ForegroundColor Yellow
}
