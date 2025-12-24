# PrescrIMed - Script de Parada PowerShell
# Uso: .\parar.ps1

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "PrescrIMed - Parada"

Clear-Host

Write-Host "╔═══════════════════════════════════════════════════════════════════╗" -ForegroundColor Red
Write-Host "║                                                                   ║" -ForegroundColor Red
Write-Host "║              🛑 PRESCRIMED - PARAR SISTEMA 🛑                    ║" -ForegroundColor Red
Write-Host "║                                                                   ║" -ForegroundColor Red
Write-Host "╚═══════════════════════════════════════════════════════════════════╝" -ForegroundColor Red
Write-Host ""
Write-Host "   ⏳ Encerrando todos os processos Node.js..." -ForegroundColor Yellow
Write-Host ""

$processos = Get-Process -Name node -ErrorAction SilentlyContinue

if ($processos) {
    $processos | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ Sistema parado com sucesso!" -ForegroundColor Green
    Write-Host "   📊 $($processos.Count) processo(s) Node.js encerrado(s)." -ForegroundColor Cyan
} else {
    Write-Host "   ℹ️  Nenhum processo Node.js estava em execução." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "   Pressione qualquer tecla para fechar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
