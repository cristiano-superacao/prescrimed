#!/usr/bin/env pwsh
# Deploy automático para Netlify

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          🚀 DEPLOY AUTOMÁTICO - NETLIFY               ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Set-Location "$PSScriptRoot\client"

Write-Host "📦 Gerando build de produção...`n" -ForegroundColor Yellow

npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Erro ao gerar build!" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "`n✅ Build gerado com sucesso!`n" -ForegroundColor Green

Write-Host "📋 Copiando arquivo _redirects..." -ForegroundColor Yellow
Copy-Item "public\_redirects" "dist\_redirects" -Force

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao copiar _redirects" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "✅ Arquivo _redirects copiado!`n" -ForegroundColor Green

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                  ✅ BUILD PRONTO!                     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "📂 Pasta de deploy: " -NoNewline -ForegroundColor Cyan
Write-Host "client\dist\`n" -ForegroundColor White

Write-Host "🚀 OPÇÕES DE DEPLOY:`n" -ForegroundColor Yellow

Write-Host "1. MANUAL (Arraste e Solte)" -ForegroundColor Cyan
Write-Host "   ▸ Acesse: https://app.netlify.com/drop" -ForegroundColor White
Write-Host "   ▸ Arraste a pasta: client\dist`n" -ForegroundColor White

Write-Host "2. GIT (Automático)" -ForegroundColor Cyan
Write-Host "   ▸ Conecte seu GitHub no Netlify" -ForegroundColor White
Write-Host "   ▸ Build: cd client && npm run build" -ForegroundColor White
Write-Host "   ▸ Publish: client/dist`n" -ForegroundColor White

Write-Host "3. CLI NETLIFY" -ForegroundColor Cyan
Write-Host "   ▸ npm install -g netlify-cli" -ForegroundColor White
Write-Host "   ▸ netlify login" -ForegroundColor White
Write-Host "   ▸ netlify deploy --prod --dir=dist`n" -ForegroundColor White

Write-Host "✅ Layout responsivo e profissional mantidos!`n" -ForegroundColor Green

# Abrir pasta dist no Explorer
Write-Host "📁 Abrindo pasta dist no Explorer..." -ForegroundColor Yellow
Start-Process explorer.exe -ArgumentList (Resolve-Path "dist").Path

# Abrir Netlify Drop no navegador
Write-Host "🌐 Abrindo Netlify Drop no navegador...`n" -ForegroundColor Yellow
Start-Process "https://app.netlify.com/drop"

Write-Host "✨ Arraste a pasta 'dist' para o navegador!`n" -ForegroundColor Cyan

Read-Host "Pressione Enter para fechar"
