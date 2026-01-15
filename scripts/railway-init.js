#!/usr/bin/env node
/**
 * Script de inicialização do Railway
 * Executa após deploy para configurar o banco de dados
 */

const { execSync } = require('child_process');

console.log('🚀 Iniciando configuração do banco de dados no Railway...\n');

try {
  // 1. Testar conexão
  console.log('📋 Passo 1: Testando conexão com banco...');
  execSync('node scripts/test-db-connection.js', { stdio: 'inherit' });
  
  // 2. Inicializar banco (criar coleções e índices)
  console.log('\n📋 Passo 2: Inicializando banco de dados...');
  execSync('node scripts/init-db.js', { stdio: 'inherit' });
  
  // 3. Semear dados
  console.log('\n📋 Passo 3: Semeando dados iniciais...');
  execSync('node scripts/seed-cloud.js', { stdio: 'inherit' });
  
  // 4. Verificar empresas
  console.log('\n📋 Passo 4: Verificando dados semeados...');
  execSync('node scripts/verificar-empresas.js', { stdio: 'inherit' });
  
  console.log('\n✅ Configuração completa! Sistema pronto para uso.');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Erro durante a configuração:', error.message);
  process.exit(1);
}
