#!/usr/bin/env node
/**
 * Verifica health e endpoints principais do backend
 * Uso: node scripts/check-health.js https://seu-dominio.railway.app
 */
import axios from 'axios';

const base = (process.argv[2] || process.env.BACKEND_URL || 'https://prescrimed-backend.up.railway.app').replace(/\/$/,'');
const endpoints = [
  '/health',
  '/api/health',
  '/api/diagnostic/db-check',
  '/api/financeiro/stats'
];

async function check(url){
  try{
    const res = await axios.get(url, { timeout: 10000 });
    console.log(`✅ ${url} -> ${res.status}`);
  }catch(err){
    const status = err.response?.status || 'ERR';
    console.log(`❌ ${url} -> ${status} (${err.message})`);
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
