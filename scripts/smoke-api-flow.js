/*
 * Smoke test simples via HTTP para validar:
 * - login
 * - listar pacientes
 * - criar prescrição (comum/controlado) e verificar retorno
 *
 * Uso:
 *   node scripts/smoke-api-flow.js
 *   API_BASE_URL=http://localhost:3000/api SEED_SLUG=empresa-teste node scripts/smoke-api-flow.js
 */

const PORT = process.env.PORT || 8000;
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}/api`;
const SLUG = process.env.SEED_SLUG || 'empresa-teste';
const PASSWORD = process.env.SEED_PASSWORD || 'Prescri@2026';

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

async function isHealthy(apiBaseUrl) {
  const root = String(apiBaseUrl || '').replace(/\/api\/?$/, '');
  if (!root) return false;
  try {
    const res = await fetch(`${root}/health`, { method: 'GET' });
    if (!res.ok) return false;
    const data = await res.json().catch(() => null);
    return Boolean(data?.status);
  } catch {
    return false;
  }
}

async function pickApiBaseUrl() {
  const candidates = [
    process.env.API_BASE_URL,
    `http://localhost:${PORT}/api`,
    `http://127.0.0.1:${PORT}/api`,
    'http://localhost:8000/api',
    'http://127.0.0.1:8000/api',
    'http://localhost:3000/api',
    'http://127.0.0.1:3000/api',
  ].filter(Boolean);

  for (const base of candidates) {
    // Health é fora do /api
    // Mantém simples e resiliente (porta 8000/3000 etc)
    if (await isHealthy(base)) return base;
  }

  return candidates[0] || `http://localhost:${PORT}/api`;
}

async function http(method, path, { token, body } = {}) {
  const base = globalThis.__API_BASE_URL__ || API_BASE_URL;
  const url = path.startsWith('http') ? path : `${base}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${res.statusText} em ${method} ${path}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

async function login(email) {
  const data = await http('POST', '/auth/login', {
    body: { email, senha: PASSWORD },
  });
  return data.token;
}

async function getUsuarioIdByEmail(token, email) {
  const usuarios = await http('GET', '/usuarios', { token });
  const list = Array.isArray(usuarios) ? usuarios : (usuarios?.usuarios || []);
  const found = list.find((u) => String(u.email || '').toLowerCase() === String(email).toLowerCase());
  return found?.id || found?._id || null;
}

async function main() {
  try {
    globalThis.__API_BASE_URL__ = await pickApiBaseUrl();
    log('🔎', `Smoke API: ${globalThis.__API_BASE_URL__}`, 'blue');

    const adminEmail = `admin+${SLUG}@prescrimed.com`;
    const token = await login(adminEmail);
    console.log('✅ Login ok:', adminEmail);

    // Valida permissões (fluxo usado pelo frontend)
    const atendenteEmail = `atendente+${SLUG}@prescrimed.com`;
    const atendenteId = await getUsuarioIdByEmail(token, atendenteEmail);
    if (!atendenteId) {
      throw new Error('Não encontrei o usuário atendente. Rode primeiro: node scripts/seed-minimal-demo.js');
    }

    const permissoesDemo = ['dashboard', 'pacientes', 'prescricoes'];
    await http('PUT', `/usuarios/${atendenteId}/permissoes`, {
      token,
      body: { permissoes: permissoesDemo },
    });
    console.log('✅ Permissões atualizadas para:', atendenteEmail);

    const tokenAtendente = await login(atendenteEmail);
    const me = await http('GET', '/usuarios/me', { token: tokenAtendente });
    const mePerms = me?.permissoes || [];
    const okPerms = permissoesDemo.every((p) => mePerms.includes(p));
    if (!okPerms) {
      throw new Error(`Permissões não persistiram no /usuarios/me. Esperado: ${permissoesDemo.join(', ')}; atual: ${mePerms.join(', ')}`);
    }
    console.log('✅ /usuarios/me inclui permissoes:', mePerms.length);

    const pacientes = await http('GET', '/pacientes', { token });
    const lista = Array.isArray(pacientes) ? pacientes : (pacientes?.pacientes || []);
    if (!lista.length) {
      throw new Error('Nenhum paciente encontrado. Rode primeiro: node scripts/seed-minimal-demo.js');
    }
    console.log(`✅ Pacientes carregados: ${lista.length}`);

    const pacienteId = lista[0].id || lista[0]._id;

    // Estoque: cria item + movimentação + stats
    const novoItem = await http('POST', '/estoque/medicamentos', {
      token,
      body: {
        nome: `Item Smoke ${Date.now()}`,
        quantidade: 10,
        quantidadeMinima: 2,
        unidade: 'un',
        categoria: 'Teste',
        precoUnitario: 1.5,
      },
    });
    const itemId = novoItem?._id || novoItem?.id;
    if (!itemId) throw new Error('Não consegui obter id/_id do item criado no estoque');

    await http('POST', '/estoque/medicamentos/movimentacao', {
      token,
      body: {
        medicamentoId: itemId,
        tipo: 'saida',
        quantidade: 1,
        motivo: 'Smoke test',
        observacao: 'Baixa automática (demo).',
      },
    });
    log('✅', 'Estoque: item criado + movimentação registrada', 'green');

    const estoqueStats = await http('GET', '/estoque/stats', { token });
    if (!estoqueStats) throw new Error('Estoque stats não retornou dados');
    log('✅', `Estoque stats ok (itens: ${estoqueStats.totalItens ?? '-'})`, 'green');

    // Financeiro: cria transação + stats
    const transacao = await http('POST', '/financeiro', {
      token,
      body: {
        tipo: 'receita',
        descricao: 'Receita (smoke)',
        valor: 123.45,
        categoria: 'Teste',
        status: 'pago',
        formaPagamento: 'pix',
        pacienteId,
        data: new Date().toISOString(),
      },
    });
    const transacaoId = transacao?._id || transacao?.id;
    if (!transacaoId) throw new Error('Resposta inesperada ao criar transação financeira');
    log('✅', `Financeiro: transação criada (${transacaoId})`, 'green');

    const finStats = await http('GET', '/financeiro/stats', { token });
    if (!finStats) throw new Error('Financeiro stats não retornou dados');
    log('✅', 'Financeiro stats ok', 'green');

    const prescricao = await http('POST', '/prescricoes', {
      token,
      body: {
        pacienteId,
        tipo: 'controlado',
        medicamentos: [
          { nome: 'Diazepam', dosagem: '10mg', frequencia: '1x ao dia', duracao: '5 dias', observacoes: 'Demo' }
        ],
      },
    });

    if (!prescricao?.id) {
      throw new Error('Resposta inesperada ao criar prescrição');
    }

    log('✅', `Prescrição criada: ${prescricao.id}`, 'green');
    console.log('   tipo (client):', prescricao.tipo);
    console.log('   tipoSistema:', prescricao.tipoSistema);
    console.log('   pacienteNome:', prescricao.pacienteNome);
    console.log('   medicamentos:', prescricao.medicamentos?.length || 0);

    const list = await http('GET', '/prescricoes', { token });
    log('✅', `Prescrições listadas: ${Array.isArray(list) ? list.length : (list?.prescricoes?.length || 0)}`, 'green');
    log('🎉', 'Smoke test concluído com sucesso', 'green');
  } catch (error) {
    log('❌', `Smoke test falhou: ${error.message}`, 'red');
    if (error.data) {
      console.error('Detalhes:', error.data);
    }
    process.exitCode = 1;
  }
}

main();
