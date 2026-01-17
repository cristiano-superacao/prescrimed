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

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';
const SLUG = process.env.SEED_SLUG || 'empresa-teste';
const PASSWORD = process.env.SEED_PASSWORD || 'Prescri@2026';

async function http(method, path, { token, body } = {}) {
  const url = `${API_BASE_URL}${path}`;
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
    console.log(`🔎 Smoke API: ${API_BASE_URL}`);

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

    console.log('✅ Prescrição criada:', prescricao.id);
    console.log('   tipo (client):', prescricao.tipo);
    console.log('   tipoSistema:', prescricao.tipoSistema);
    console.log('   pacienteNome:', prescricao.pacienteNome);
    console.log('   medicamentos:', prescricao.medicamentos?.length || 0);

    const list = await http('GET', '/prescricoes', { token });
    console.log(`✅ Prescrições listadas: ${Array.isArray(list) ? list.length : (list?.prescricoes?.length || 0)}`);

    console.log('🎉 Smoke test concluído com sucesso');
  } catch (error) {
    console.error('❌ Smoke test falhou:', error.message);
    if (error.data) {
      console.error('Detalhes:', error.data);
    }
    process.exitCode = 1;
  }
}

main();
