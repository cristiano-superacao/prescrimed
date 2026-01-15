#!/usr/bin/env node

/**
 * 🚀 Script de Deploy Automatizado - Prescrimed
 * 
 * Este script facilita o processo de deploy do frontend
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cores para o terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  log(`\n📦 ${description}...`, 'cyan');
  try {
    execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, 'client') });
    log(`✅ ${description} - Concluído!`, 'green');
    return true;
  } catch (error) {
    log(`❌ Erro ao ${description.toLowerCase()}`, 'red');
    console.error(error.message);
    return false;
  }
}

function updateEnvProduction(backendUrl) {
  const envPath = path.join(__dirname, 'client', '.env.production');
  const envContent = `VITE_API_URL=${backendUrl}/api\n`;
  
  try {
    fs.writeFileSync(envPath, envContent);
    log(`✅ Arquivo .env.production atualizado com: ${backendUrl}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Erro ao atualizar .env.production`, 'red');
    console.error(error.message);
    return false;
  }
}

async function main() {
  log('\n🚀 Prescrimed - Deploy Automatizado\n', 'magenta');
  
  // Verificar se está na pasta correta
  if (!fs.existsSync(path.join(__dirname, 'client'))) {
    log('❌ Pasta client não encontrada. Execute este script da raiz do projeto.', 'red');
    process.exit(1);
  }

  // Perguntar URL do backend
  log('📋 Para começar, precisamos da URL do seu backend no Render:', 'yellow');
  log('   Exemplo: https://prescrimed-backend.onrender.com', 'blue');
  
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('\n🔗 Cole a URL do backend (sem /api no final): ', (backendUrl) => {
    rl.close();
    
    if (!backendUrl || !backendUrl.startsWith('http')) {
      log('\n❌ URL inválida. Por favor, forneça uma URL completa.', 'red');
      process.exit(1);
    }

    // Remover barra final se existir
    backendUrl = backendUrl.replace(/\/$/, '');

    log('\n🎯 Iniciando processo de deploy...', 'cyan');
    
    // 1. Atualizar .env.production
    if (!updateEnvProduction(backendUrl)) {
      process.exit(1);
    }

    // 2. Instalar dependências
    if (!execCommand('npm install', 'Instalando dependências')) {
      process.exit(1);
    }

    // 3. Build da aplicação
    if (!execCommand('npm run build', 'Gerando build de produção')) {
      process.exit(1);
    }

    // 3.5. Copiar arquivos necessários para o dist
    log('\n📋 Copiando arquivos de configuração...', 'cyan');
    const publicRedirects = path.join(__dirname, 'client', 'public', '_redirects');
    const netlifyToml = path.join(__dirname, 'client', 'netlify.toml');
    const distRedirects = path.join(__dirname, 'client', 'dist', '_redirects');
    const distNetlifyToml = path.join(__dirname, 'client', 'dist', 'netlify.toml');
    
    try {
      if (fs.existsSync(publicRedirects)) {
        fs.copyFileSync(publicRedirects, distRedirects);
        log('✅ Arquivo _redirects copiado', 'green');
      }
      if (fs.existsSync(netlifyToml)) {
        fs.copyFileSync(netlifyToml, distNetlifyToml);
        log('✅ Arquivo netlify.toml copiado', 'green');
      }
    } catch (error) {
      log('⚠️  Aviso: Não foi possível copiar alguns arquivos de configuração', 'yellow');
    }

    // 4. Deploy no Netlify
    log('\n🌐 Fazendo deploy no Netlify...', 'cyan');
    const deployCommand = 'netlify deploy --prod --dir=dist --site 7952a4ed-c83e-48bc-aeef-475f1167aeaf --message "Deploy automatizado via script"';
    
    if (!execCommand(deployCommand, 'Deploy no Netlify')) {
      process.exit(1);
    }

    // Sucesso!
    log('\n\n🎉 DEPLOY CONCLUÍDO COM SUCESSO! 🎉\n', 'green');
    log('✅ Frontend: https://precrimed.netlify.app', 'cyan');
    log(`✅ Backend: ${backendUrl}`, 'cyan');
    log('\n💡 Aguarde alguns segundos para o deploy propagar e teste o sistema!\n', 'yellow');
  });
}

main().catch(error => {
  log('\n❌ Erro inesperado:', 'red');
  console.error(error);
  process.exit(1);
});
