import axios from 'axios';
import 'dotenv/config';

const API = process.env.API_URL || 'http://localhost:8000/api';

async function login(email, senha) {
  const { data } = await axios.post(`${API}/auth/login`, { email, senha });
  return data?.token;
}

async function authed(token) {
  const client = axios.create({ baseURL: API, headers: { Authorization: `Bearer ${token}` } });
  return client;
}

async function run() {
  try {
    console.log('🔐 Testando acessos por role (residentes)...');
    // Buscar empresaId via /usuarios/me (após login)
    const accounts = [
      { role: 'nutricionista', email: null },
      { role: 'assistente_social', email: null },
      { role: 'tecnico_enfermagem', email: null },
    ];

    // Descobrir emails criados (padrão): <role>.<slugEmpresa>@prescrimed.com — vamos tentar pela empresa principal slug
    const slug = 'casa-de-repouso-vida-plena';
    accounts[0].email = `nutricionista.${slug}@prescrimed.com`;
    accounts[1].email = `assistente-social.${slug}@prescrimed.com`;
    accounts[2].email = `tecnico-enfermagem.${slug}@prescrimed.com`;

    // Fallback: se não existir, usar já existentes conhecidos
    const fallbacks = {
      nutricionista: 'joao.nutri@prescrimed.com',
    };

    for (const acc of accounts) {
      let email = acc.email;
      let token;
      try {
        token = await login(email, 'teste123');
      } catch (e) {
        if (fallbacks[acc.role]) {
          email = fallbacks[acc.role];
          token = await login(email, 'teste123');
        } else {
          throw e;
        }
      }
      console.log(`\n👤 ${acc.role} → ${email}`);
      const client = await authed(token);

      // Perfil
      const me = await client.get('/usuarios/me');
      const empresaId = me?.data?.empresaId || me?.data?.empresa?.id;
      console.log('   🏢 empresaId =', empresaId);

      // Listar pacientes
      const pacientes = await client.get('/pacientes', { params: { page: 1, pageSize: 5, empresaId } });
      console.log('   👥 pacientes:', pacientes?.data?.items?.length ?? (Array.isArray(pacientes?.data) ? pacientes.data.length : 0));

      // Listar agendamentos
      const agends = await client.get('/agendamentos', { params: { page: 1, pageSize: 5, empresaId } });
      console.log('   📅 agendamentos:', agends?.data?.items?.length ?? (Array.isArray(agends?.data) ? agends.data.length : 0));

      // Operações específicas
      if (acc.role === 'nutricionista') {
        const pacItems = pacientes?.data?.items || pacientes?.data || [];
        const pac = pacItems[0];
        if (pac) {
          const presc = await client.post('/prescricoes', {
            pacienteId: pac.id,
            tipo: 'nutricional',
            medicamentos: [ { nome: 'Plano alimentar', dosagem: '', frequencia: '', duracao: '', observacoes: '' } ],
            observacoes: 'Teste rápido'
          });
          console.log('   💊 prescrição criada id =', presc?.data?.id || presc?.data?._id || 'ok');
        }
      }

      if (acc.role === 'tecnico_enfermagem') {
        const pacItems = pacientes?.data?.items || pacientes?.data || [];
        const pac = pacItems[0];
        if (pac) {
          const reg = await client.post('/enfermagem', {
            pacienteId: pac.id,
            tipo: 'sinais_vitais',
            titulo: 'Aferição teste',
            descricao: 'Registro automatizado de teste',
            sinaisVitais: { PA: '120/80', FC: 72 },
            prioridade: 'baixa'
          });
          console.log('   🩺 registro criado id =', reg?.data?.id || reg?.data?._id || 'ok');
        }
      }

      // Assistente social: valida leitura geral
      if (acc.role === 'assistente_social') {
        // Nenhuma operação de escrita específica; valida leitura ok
        console.log('   📖 assistente social consegue ler pacientes/agendamentos.');
      }
    }

    console.log('\n✅ Teste de acesso por roles concluído.');
  } catch (err) {
    console.error('❌ Falha no teste:', err?.message || err);
    process.exitCode = 1;
  }
}

run();
