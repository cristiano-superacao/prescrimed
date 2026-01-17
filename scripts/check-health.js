#!/usr/bin/env node
/**
 * Verifica health e endpoints principais do backend
 * Uso: node scripts/check-health.js https://seu-dominio.railway.app
 */

const base = (process.argv[2] || process.env.BACKEND_URL || 'https://prescrimed-backend.up.railway.app').replace(/\/$/,'');
const endpoints = [
  '/health',
  '/api/health',
  '/api/diagnostic/db-check',
  '/api/financeiro/stats'
];

async function check(url){
  try{
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    console.log(`✅ ${url} -> ${res.status}`);
  }catch(err){
    const msg = err && err.message ? err.message : String(err);
    console.log(`❌ ${url} -> ERR (${msg})`);
  }
}

async function main(){
  console.log(`\n🔍 Checando backend: ${base}\n`);
  for(const ep of endpoints){
    await check(base + ep);
  }
  console.log('\n✔️  Verificação concluída.');
}

main();
