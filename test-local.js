<<<<<<< HEAD
// Node 18+ possui fetch nativo

const PORT = process.env.PORT || 8000;
const CANDIDATE_BASE_URLS = [
  process.env.TEST_BASE_URL,
  `http://localhost:${PORT}`,
  `http://127.0.0.1:${PORT}`,
].filter(Boolean);

let BASE_URL = null;
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(emoji, message, color = 'reset') {
  console.log(`${emoji} ${colors[color]}${message}${colors.reset}`);
}

async function fetchJson(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson ? await response.json() : await response.text();

    return { response, body, isJson };
  } finally {
    clearTimeout(timeout);
  }
}

async function pickBaseUrl() {
  const healthPaths = ['/health', '/api/health'];

  for (const baseUrl of CANDIDATE_BASE_URLS) {
    for (const healthPath of healthPaths) {
      try {
        const { response, body } = await fetchJson(`${baseUrl}${healthPath}`, {}, 4000);
        if (response.ok && body && typeof body === 'object' && body.status) {
          BASE_URL = baseUrl;
          log('✅', `Servidor detectado em: ${BASE_URL} (${healthPath})`, 'green');
          return true;
        }
      } catch (error) {
        // tenta próximos alvos
      }
    }
  }

  return false;
}

async function testHealthCheck() {
  try {
    const { response, body } = await fetchJson(`${BASE_URL}/health`, {}, 4000);
    if (!response.ok) {
      log('❌', `Health check falhou (HTTP ${response.status})`, 'red');
      return false;
    }
    log('✅', `Health check: ${body.status}`, 'green');
    return true;
  } catch (error) {
    log('❌', `Health check falhou: ${error.message}`, 'red');
    return false;
  }
}

async function testRegisterEmpresa() {
  try {
    const novaEmpresa = {
      tipoSistema: 'casa-repouso',
      nomeEmpresa: `Clínica Teste Local ${Date.now()}`,
      cnpj: `${Date.now().toString().slice(-8)}/0001-99`,
      email: `teste${Date.now()}@clinica.com`,
      senha: 'Teste@2026',
      nomeAdmin: 'Admin Teste',
      cpf: '12345678901',
      contato: '(11) 99999-9999'
    };

    log('📝', 'Criando nova empresa via /api/auth/register...', 'blue');
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaEmpresa)
    });

    const data = await response.json();
    
    if (response.ok) {
      log('✅', `Empresa criada: ${data.empresa?.nome} (ID: ${data.empresa?.id})`, 'green');
      log('✅', `Usuário admin: ${data.usuario?.email} (Role: ${data.usuario?.role})`, 'green');
      return { empresa: data.empresa, usuario: data.usuario, email: novaEmpresa.email, senha: novaEmpresa.senha };
    } else {
      log('❌', `Erro ao criar empresa: ${data.error}`, 'red');
      return null;
    }
  } catch (error) {
    log('❌', `Erro ao registrar empresa: ${error.message}`, 'red');
    return null;
  }
}

async function testLogin(email, senha) {
  try {
    log('🔐', `Fazendo login com ${email}...`, 'blue');
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    
    if (response.ok) {
      log('✅', `Login bem-sucedido! Token recebido (${data.token.slice(0, 20)}...)`, 'green');
      log('✅', `Usuário: ${data.user.nome} (${data.user.role})`, 'green');
      return data.token;
    } else {
      log('❌', `Erro no login: ${data.error}`, 'red');
      return null;
    }
  } catch (error) {
    log('❌', `Erro ao fazer login: ${error.message}`, 'red');
    return null;
  }
}

async function testListEmpresas(token) {
  try {
    log('📋', 'Listando empresas...', 'blue');
    const response = await fetch(`${BASE_URL}/api/empresas`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (response.ok && Array.isArray(data)) {
      log('✅', `${data.length} empresa(s) encontrada(s):`, 'green');
      data.forEach((empresa, i) => {
        console.log(`  ${i + 1}. ${empresa.nome} (${empresa.tipoSistema}) - ${empresa.usuarios?.length || 0} usuário(s)`);
      });
      return data;
    } else {
      log('❌', `Erro ao listar empresas: ${data.error || 'Resposta inválida'}`, 'red');
      return null;
    }
  } catch (error) {
    log('❌', `Erro ao listar empresas: ${error.message}`, 'red');
    return null;
  }
}

async function testCreateEmpresaAPI(token) {
  try {
    const novaEmpresaAPI = {
      nome: `Empresa API Teste ${Date.now()}`,
      tipoSistema: 'fisioterapia',
      cnpj: `${Date.now().toString().slice(-8)}/0001-88`,
      email: `api${Date.now()}@empresa.com`,
      telefone: '(11) 88888-8888',
      endereco: 'Rua API, 456'
    };

    log('🏢', 'Criando empresa via POST /api/empresas...', 'blue');
    const response = await fetch(`${BASE_URL}/api/empresas`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(novaEmpresaAPI)
    });

    const data = await response.json();
    
    if (response.ok) {
      log('✅', `Empresa criada via API: ${data.nome} (ID: ${data.id})`, 'green');
      return data;
    } else {
      log('❌', `Erro ao criar empresa via API: ${data.error}`, 'red');
      if (data.details) {
        console.log('  Detalhes:', data.details);
      }
      return null;
    }
  } catch (error) {
    log('❌', `Erro ao criar empresa via API: ${error.message}`, 'red');
    return null;
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  log('🧪', 'TESTE LOCAL DO SISTEMA PRESCRIMED', 'yellow');
  console.log('='.repeat(60) + '\n');

  const found = await pickBaseUrl();
  if (!found) {
    log('❌', `Não foi possível conectar no servidor. Tentativas: ${CANDIDATE_BASE_URLS.join(', ')}`, 'red');
    log('💡', 'Dica: inicie o backend e/ou defina TEST_BASE_URL (ex: http://127.0.0.1:3000)', 'yellow');
    return;
  }

  // 1. Health Check
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    log('⚠️', 'Servidor não está respondendo. Verifique se está rodando.', 'yellow');
    return;
  }

  console.log('');

  // 2. Registrar nova empresa
  const empresaData = await testRegisterEmpresa();
  if (!empresaData) {
    log('⚠️', 'Não foi possível criar empresa. Abortando testes.', 'yellow');
    return;
  }

  console.log('');

  // 3. Login
  const token = await testLogin(empresaData.email, empresaData.senha);
  if (!token) {
    log('⚠️', 'Não foi possível fazer login. Abortando testes.', 'yellow');
    return;
  }

  console.log('');

  // 4. Listar empresas
  await testListEmpresas(token);

  console.log('');

  // 5. Criar empresa via API direta
  await testCreateEmpresaAPI(token);

  console.log('');

  // 6. Listar empresas novamente
  await testListEmpresas(token);

  console.log('\n' + '='.repeat(60));
  log('🎉', 'TESTES CONCLUÍDOS COM SUCESSO!', 'green');
  log('💾', 'Dados salvos no banco de dados SQLite local (database.sqlite)', 'blue');
  log('☁️', 'No Railway, os dados serão salvos no PostgreSQL da nuvem', 'blue');
  console.log('='.repeat(60) + '\n');
}

// Executar testes
runTests().catch((error) => {
  log('❌', `Erro fatal nos testes: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
=======
// Node 18+ possui fetch nativo

const PORT = process.env.PORT || 8000;
const CANDIDATE_BASE_URLS = [
  process.env.TEST_BASE_URL,
  `http://localhost:${PORT}`,
  `http://127.0.0.1:${PORT}`,
].filter(Boolean);

let BASE_URL = null;
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(emoji, message, color = 'reset') {
  console.log(`${emoji} ${colors[color]}${message}${colors.reset}`);
}

async function fetchJson(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson ? await response.json() : await response.text();

    return { response, body, isJson };
  } finally {
    clearTimeout(timeout);
  }
}

async function pickBaseUrl() {
  const healthPaths = ['/health', '/api/health'];

  for (const baseUrl of CANDIDATE_BASE_URLS) {
    for (const healthPath of healthPaths) {
      try {
        const { response, body } = await fetchJson(`${baseUrl}${healthPath}`, {}, 4000);
        if (response.ok && body && typeof body === 'object' && body.status) {
          BASE_URL = baseUrl;
          log('✅', `Servidor detectado em: ${BASE_URL} (${healthPath})`, 'green');
          return true;
        }
      } catch (error) {
        // tenta próximos alvos
      }
    }
  }

  return false;
}

async function testHealthCheck() {
  try {
    const { response, body } = await fetchJson(`${BASE_URL}/health`, {}, 4000);
    if (!response.ok) {
      log('❌', `Health check falhou (HTTP ${response.status})`, 'red');
      return false;
    }
    log('✅', `Health check: ${body.status}`, 'green');
    return true;
  } catch (error) {
    log('❌', `Health check falhou: ${error.message}`, 'red');
    return false;
  }
}

async function testRegisterEmpresa() {
  try {
    const novaEmpresa = {
      tipoSistema: 'casa-repouso',
      nomeEmpresa: `Clínica Teste Local ${Date.now()}`,
      cnpj: `${Date.now().toString().slice(-8)}/0001-99`,
      email: `teste${Date.now()}@clinica.com`,
      senha: 'Teste@2026',
      nomeAdmin: 'Admin Teste',
      cpf: '12345678901',
      contato: '(11) 99999-9999'
    };

    log('📝', 'Criando nova empresa via /api/auth/register...', 'blue');
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaEmpresa)
    });

    const data = await response.json();
    
    if (response.ok) {
      log('✅', `Empresa criada: ${data.empresa?.nome} (ID: ${data.empresa?.id})`, 'green');
      log('✅', `Usuário admin: ${data.usuario?.email} (Role: ${data.usuario?.role})`, 'green');
      return { empresa: data.empresa, usuario: data.usuario, email: novaEmpresa.email, senha: novaEmpresa.senha };
    } else {
      log('❌', `Erro ao criar empresa: ${data.error}`, 'red');
      return null;
    }
  } catch (error) {
    log('❌', `Erro ao registrar empresa: ${error.message}`, 'red');
    return null;
  }
}

async function testLogin(email, senha) {
  try {
    log('🔐', `Fazendo login com ${email}...`, 'blue');
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    
    if (response.ok) {
      log('✅', `Login bem-sucedido! Token recebido (${data.token.slice(0, 20)}...)`, 'green');
      log('✅', `Usuário: ${data.user.nome} (${data.user.role})`, 'green');
      return data.token;
    } else {
      log('❌', `Erro no login: ${data.error}`, 'red');
      return null;
    }
  } catch (error) {
    log('❌', `Erro ao fazer login: ${error.message}`, 'red');
    return null;
  }
}

async function testListEmpresas(token) {
  try {
    log('📋', 'Listando empresas...', 'blue');
    const response = await fetch(`${BASE_URL}/api/empresas`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (response.ok && Array.isArray(data)) {
      log('✅', `${data.length} empresa(s) encontrada(s):`, 'green');
      data.forEach((empresa, i) => {
        console.log(`  ${i + 1}. ${empresa.nome} (${empresa.tipoSistema}) - ${empresa.usuarios?.length || 0} usuário(s)`);
      });
      return data;
    } else {
      log('❌', `Erro ao listar empresas: ${data.error || 'Resposta inválida'}`, 'red');
      return null;
    }
  } catch (error) {
    log('❌', `Erro ao listar empresas: ${error.message}`, 'red');
    return null;
  }
}

async function testCreateEmpresaAPI(token) {
  try {
    const novaEmpresaAPI = {
      nome: `Empresa API Teste ${Date.now()}`,
      tipoSistema: 'fisioterapia',
      cnpj: `${Date.now().toString().slice(-8)}/0001-88`,
      email: `api${Date.now()}@empresa.com`,
      telefone: '(11) 88888-8888',
      endereco: 'Rua API, 456'
    };

    log('🏢', 'Criando empresa via POST /api/empresas...', 'blue');
    const response = await fetch(`${BASE_URL}/api/empresas`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(novaEmpresaAPI)
    });

    const data = await response.json();
    
    if (response.ok) {
      log('✅', `Empresa criada via API: ${data.nome} (ID: ${data.id})`, 'green');
      return data;
    } else {
      log('❌', `Erro ao criar empresa via API: ${data.error}`, 'red');
      if (data.details) {
        console.log('  Detalhes:', data.details);
      }
      return null;
    }
  } catch (error) {
    log('❌', `Erro ao criar empresa via API: ${error.message}`, 'red');
    return null;
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  log('🧪', 'TESTE LOCAL DO SISTEMA PRESCRIMED', 'yellow');
  console.log('='.repeat(60) + '\n');

  const found = await pickBaseUrl();
  if (!found) {
    log('❌', `Não foi possível conectar no servidor. Tentativas: ${CANDIDATE_BASE_URLS.join(', ')}`, 'red');
    log('💡', 'Dica: inicie o backend e/ou defina TEST_BASE_URL (ex: http://127.0.0.1:3000)', 'yellow');
    return;
  }

  // 1. Health Check
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    log('⚠️', 'Servidor não está respondendo. Verifique se está rodando.', 'yellow');
    return;
  }

  console.log('');

  // 2. Registrar nova empresa
  const empresaData = await testRegisterEmpresa();
  if (!empresaData) {
    log('⚠️', 'Não foi possível criar empresa. Abortando testes.', 'yellow');
    return;
  }

  console.log('');

  // 3. Login
  const token = await testLogin(empresaData.email, empresaData.senha);
  if (!token) {
    log('⚠️', 'Não foi possível fazer login. Abortando testes.', 'yellow');
    return;
  }

  console.log('');

  // 4. Listar empresas
  await testListEmpresas(token);

  console.log('');

  // 5. Criar empresa via API direta
  await testCreateEmpresaAPI(token);

  console.log('');

  // 6. Listar empresas novamente
  await testListEmpresas(token);

  console.log('\n' + '='.repeat(60));
  log('🎉', 'TESTES CONCLUÍDOS COM SUCESSO!', 'green');
  log('💾', 'Dados salvos no banco de dados SQLite local (database.sqlite)', 'blue');
  log('☁️', 'No Railway, os dados serão salvos no PostgreSQL da nuvem', 'blue');
  console.log('='.repeat(60) + '\n');
}

// Executar testes
runTests().catch((error) => {
  log('❌', `Erro fatal nos testes: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
>>>>>>> 9eb81865cc33511fa5c624f41c8e69ea8bf20e94
