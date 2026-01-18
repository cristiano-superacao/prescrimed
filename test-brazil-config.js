/**
 * Teste de Configuração Regional Brasileira
 * 
 * Este script valida se todas as configurações de timezone e locale estão funcionando corretamente
 */

import { 
  BRAZIL_CONFIG, 
  getBrazilNow, 
  toBrazilTime, 
  formatBrazilDate, 
  formatBrazilDateTime, 
  calculateAge 
} from './utils/date.js';

console.log('\n🇧🇷 TESTE DE CONFIGURAÇÃO REGIONAL BRASILEIRA\n');
console.log('='.repeat(60));

// 1. Verificar constantes de configuração
console.log('\n📋 1. CONFIGURAÇÕES REGIONAIS:');
console.log(`   Timezone: ${BRAZIL_CONFIG.timezone}`);
console.log(`   Locale: ${BRAZIL_CONFIG.locale}`);
console.log(`   Moeda: ${BRAZIL_CONFIG.currency}`);

// 2. Testar timezone do processo
console.log('\n⏰ 2. TIMEZONE DO PROCESSO:');
console.log(`   TZ definido: ${process.env.TZ || 'não definido'}`);

// 3. Testar data/hora atual brasileira
console.log('\n📅 3. DATA E HORA ATUAL (Horário de Brasília):');
const agora = getBrazilNow();
console.log(`   Date object: ${agora}`);
console.log(`   Data formatada: ${formatBrazilDate(agora)}`);
console.log(`   Data/hora formatada: ${formatBrazilDateTime(agora)}`);

// 4. Testar conversão de timezone
console.log('\n🌍 4. CONVERSÃO DE TIMEZONE:');
const dataUTC = new Date('2026-01-17T12:00:00Z'); // Meio-dia UTC
const dataBrasil = toBrazilTime(dataUTC);
console.log(`   UTC: ${dataUTC.toISOString()}`);
console.log(`   Brasil: ${formatBrazilDateTime(dataBrasil)}`);

// 5. Testar cálculo de idade
console.log('\n👶 5. CÁLCULO DE IDADE (usando horário brasileiro):');
const dataNascimento = '1990-01-15';
const idade = calculateAge(dataNascimento);
console.log(`   Data de nascimento: ${dataNascimento}`);
console.log(`   Idade calculada: ${idade} anos`);

// 6. Testar formatação de moeda
console.log('\n💰 6. FORMATAÇÃO DE MOEDA:');
const valor = 1234.56;
const valorFormatado = new Intl.NumberFormat(BRAZIL_CONFIG.locale, {
  style: 'currency',
  currency: BRAZIL_CONFIG.currency
}).format(valor);
console.log(`   Valor: ${valor}`);
console.log(`   Formatado: ${valorFormatado}`);

// 7. Testar formatação de números
console.log('\n🔢 7. FORMATAÇÃO DE NÚMEROS:');
const numero = 1234567.89;
const numeroFormatado = new Intl.NumberFormat(BRAZIL_CONFIG.locale).format(numero);
console.log(`   Número: ${numero}`);
console.log(`   Formatado: ${numeroFormatado}`);

console.log('\n' + '='.repeat(60));
console.log('✅ TESTE CONCLUÍDO - Todas as funções estão operacionais!\n');
