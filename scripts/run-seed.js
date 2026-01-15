#!/usr/bin/env node
/**
 * Script simples para executar seed-cloud via Railway
 */

console.log('🌱 Iniciando seed via CLI...\n');

// Importar dinâmicamente o seed
import('./seed-cloud.js')
  .then(() => {
    console.log('\n✅ Seed executado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro ao executar seed:', error);
    process.exit(1);
  });
