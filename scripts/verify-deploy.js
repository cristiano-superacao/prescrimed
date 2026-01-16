#!/usr/bin/env node
/**
 * Script de Verificação Pré-Deploy
 * Valida que todos os arquivos necessários existem antes do deploy
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function log(type, message) {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  console.log(`${icons[type]} ${message}`);
}

function checkFile(filePath, required = true) {
  const fullPath = path.join(root, filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    checks.passed++;
    log('success', `${filePath}`);
  } else {
    if (required) {
      checks.failed++;
      log('error', `FALTANDO: ${filePath}`);
    } else {
      checks.warnings++;
      log('warning', `Opcional não encontrado: ${filePath}`);
    }
  }
  
  return exists;
}

function checkDirectory(dirPath) {
  const fullPath = path.join(root, dirPath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const files = fs.readdirSync(fullPath);
    checks.passed++;
    log('success', `${dirPath}/ (${files.length} arquivos)`);
  } else {
    checks.failed++;
    log('error', `DIRETÓRIO FALTANDO: ${dirPath}/`);
  }
  
  return exists;
}

console.log('\n🔍 VERIFICAÇÃO PRÉ-DEPLOY - PRESCRIMED\n');

console.log('📁 ARQUIVOS PRINCIPAIS:');
checkFile('server.js');
checkFile('package.json');
checkFile('railway.json');
checkFile('.gitignore');

console.log('\n📂 DIRETÓRIOS BACKEND:');
checkDirectory('routes');
checkDirectory('models');
checkDirectory('middleware');
checkDirectory('utils');

console.log('\n📋 ARQUIVOS DE ROTAS:');
checkFile('routes/index.js');
checkFile('routes/auth.routes.js');
checkFile('routes/usuario.routes.js');
checkFile('routes/empresa.routes.js');
checkFile('routes/paciente.routes.js');
checkFile('routes/prescricao.routes.js');
checkFile('routes/dashboard.routes.js');
checkFile('routes/agendamento.routes.js');
checkFile('routes/estoque.routes.js');
checkFile('routes/financeiro.routes.js');
checkFile('routes/admin.routes.js');

console.log('\n🗂️ MODELS:');
checkFile('models/Usuario.js');
checkFile('models/Empresa.js');
checkFile('models/Paciente.js');
checkFile('models/Prescricao.js');

console.log('\n🔒 MIDDLEWARE:');
checkFile('middleware/auth.middleware.js');

console.log('\n⚙️ UTILITÁRIOS:');
checkFile('utils/seed.js');

console.log('\n🎨 FRONTEND:');
checkDirectory('client/src');
checkDirectory('client/public');
checkFile('client/package.json');
checkFile('client/vite.config.js');
checkFile('client/index.html');

console.log('\n📦 FRONTEND - SERVIÇOS:');
checkFile('client/src/services/api.js');
checkFile('client/src/services/auth.service.js');

console.log('\n📄 ARQUIVOS OPCIONAIS:');
checkFile('.env', false);
checkFile('.env.production', false);
checkFile('README.md', false);

console.log('\n' + '='.repeat(50));
console.log(`✅ Passou: ${checks.passed}`);
console.log(`❌ Falhou: ${checks.failed}`);
console.log(`⚠️  Avisos: ${checks.warnings}`);
console.log('='.repeat(50));

if (checks.failed > 0) {
  console.log('\n❌ PRÉ-DEPLOY FALHOU! Corrija os erros acima.\n');
  process.exit(1);
} else if (checks.warnings > 0) {
  console.log('\n⚠️  PRÉ-DEPLOY OK COM AVISOS.\n');
  process.exit(0);
} else {
  console.log('\n✅ PRÉ-DEPLOY OK! Sistema pronto para deploy.\n');
  process.exit(0);
}
