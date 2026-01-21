#!/usr/bin/env node
/**
 * Script para criar usuário administrador via API
 */

const BASE_URL = process.env.API_BASE_URL || 'https://prescrimed-backend-production.up.railway.app';

async function createAdminUser() {
  console.log('🔧 Criando usuário administrador...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  try {
    // Usar endpoint de registro público
    console.log('1️⃣ Registrando empresa e administrador...');
    const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeEmpresa: 'Clínica Demo',
        tipoSistema: 'casa-repouso',
        cnpj: '12345678000199',
        nomeAdmin: 'Jean Soares',
        email: 'jeansoares@gmail.com',
        senha: '123456',
        cpf: '12345678900',
        contato: '(71) 99658-2310'
      })
    });

    if (!registerRes.ok) {
      const errorData = await registerRes.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(`Falha no registro: ${registerRes.status} - ${JSON.stringify(errorData)}`);
    }

    const registerData = await registerRes.json();
    console.log(`✅ Registro concluído!\n`);
    console.log(`   Empresa: ${registerData.empresa?.nome || 'Clínica Demo'}`);
    console.log(`   Usuário: ${registerData.usuario?.nome || 'Jean Soares'}\n`);

    // 2. Testar login
    console.log('2️⃣ Testando login...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'jeansoares@gmail.com',
        senha: '123456'
      })
    });

    if (!loginRes.ok) {
      const errorText = await loginRes.text();
      throw new Error(`Falha no login: ${loginRes.status} - ${errorText}`);
    }

    const loginData = await loginRes.json();
    console.log(`✅ Login bem-sucedido! Token recebido.\n`);

    console.log('🎉 Configuração concluída!\n');
    console.log('Credenciais:');
    console.log('  Email: jeansoares@gmail.com');
    console.log('  Senha: 123456\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

createAdminUser();
