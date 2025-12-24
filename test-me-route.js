import http from 'http';

const API_URL = 'http://localhost:3000/api';

function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (options.body) {
      reqOptions.headers['Content-Type'] = 'application/json';
      reqOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
    }

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function testMeRoute() {
  try {
    console.log('🧪 Testando rota /api/usuarios/me\n');

    // 1. Fazer login
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await httpRequest(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'superadmin@prescrimed.com',
        senha: 'super123'
      })
    });

    if (loginResponse.status !== 200) {
      throw new Error(`Login falhou: ${JSON.stringify(loginResponse.data)}`);
    }

    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso!\n');

    // 2. Testar GET /usuarios/me
    console.log('2️⃣ Testando GET /usuarios/me...');
    const meResponse = await httpRequest(`${API_URL}/usuarios/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (meResponse.status !== 200) {
      throw new Error(`GET /usuarios/me falhou: ${meResponse.status} - ${JSON.stringify(meResponse.data)}`);
    }

    console.log('✅ Rota /usuarios/me funcionando!');
    console.log('📦 Dados recebidos:');
    console.log(JSON.stringify(meResponse.data, null, 2));
    console.log('');

    // 3. Testar GET /usuarios/me/summary
    console.log('3️⃣ Testando GET /usuarios/me/summary...');
    const summaryResponse = await httpRequest(`${API_URL}/usuarios/me/summary`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (summaryResponse.status !== 200) {
      throw new Error(`GET /usuarios/me/summary falhou: ${summaryResponse.status}`);
    }

    console.log('✅ Rota /usuarios/me/summary funcionando!');
    console.log('📦 Resumo recebido:');
    console.log(JSON.stringify(summaryResponse.data, null, 2));
    console.log('');

    console.log('🎉 Todos os testes passaram com sucesso!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    process.exit(1);
  }
}

testMeRoute();
