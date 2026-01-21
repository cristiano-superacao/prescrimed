import pkg from 'pg';
const { Client } = pkg;
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:oyeoFuAQMHwzFMYbSLXjMQBsNsSqvEYn@gondola.proxy.rlwy.net:16321/railway';

async function seedJeanComplete() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔗 Conectado ao banco de dados Railway');

    // Hash da senha
    const senhaHash = await bcrypt.hash('123456', 10);
    const empresaId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    
    // 1. Criar Empresa Jean Soares
    console.log('\n📊 Criando empresa Jean Soares...');
    await client.query(`
      INSERT INTO empresas (id, nome, "tipoSistema", cnpj, email, telefone, endereco, plano, ativo, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      ON CONFLICT (cnpj) DO UPDATE SET 
        nome = EXCLUDED.nome,
        email = EXCLUDED.email
      RETURNING id
    `, [
      empresaId,
      'Casa de Repouso Jean Soares',
      'casa-repouso',
      '12.345.678/0001-90',
      'contato@jeansoares.com.br',
      '(11) 98765-4321',
      'Av. Principal, 1000 - Centro',
      'profissional',
      true
    ]);
    console.log('✅ Empresa criada');

    // 2. Criar Usuário Jean Soares (Admin)
    console.log('\n👤 Criando usuário Jean Soares...');
    const jeanId = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
    
    // Verificar se já existe
    const existingJean = await client.query('SELECT id FROM usuarios WHERE email = $1', ['jeansoares@gmail.com']);
    
    if (existingJean.rows.length === 0) {
      await client.query(`
        INSERT INTO usuarios (id, nome, email, senha, role, "empresaId", ativo, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      `, [jeanId, 'Jean Soares', 'jeansoares@gmail.com', senhaHash, 'admin', empresaId, true]);
      console.log('✅ Jean Soares (admin) criado');
    } else {
      await client.query(`
        UPDATE usuarios SET senha = $1, nome = $2 WHERE email = $3
      `, [senhaHash, 'Jean Soares', 'jeansoares@gmail.com']);
      console.log('✅ Jean Soares (admin) atualizado');
    }

    // 3. Criar Profissionais
    console.log('\n👥 Criando profissionais...');
    
    const profissionais = [
      { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', nome: 'Dra. Maria Silva', email: 'maria.silva@jeansoares.com.br', role: 'nutricionista', cpf: '111.222.333-44', especialidade: 'Nutrição Clínica', crm: 'CRN-3 12345', crmUf: 'SP' },
      { id: 'd4e5f6a7-b8c9-0123-def1-234567890123', nome: 'Dr. Carlos Santos', email: 'carlos.santos@jeansoares.com.br', role: 'enfermeiro', cpf: '222.333.444-55', especialidade: 'Enfermagem Geriátrica', crm: 'COREN-SP 123456', crmUf: 'SP' },
      { id: 'e5f6a7b8-c9d0-1234-ef12-345678901234', nome: 'Ana Paula Costa', email: 'ana.costa@jeansoares.com.br', role: 'fisioterapeuta', cpf: '333.444.555-66', especialidade: 'Fisioterapia Geriátrica', crm: 'CREFITO-3 12345', crmUf: 'SP' },
      { id: 'f6a7b8c9-d0e1-2345-f123-456789012345', nome: 'Roberto Lima', email: 'roberto.lima@jeansoares.com.br', role: 'atendente', cpf: '444.555.666-77', contato: '(11) 91234-5678' },
      { id: 'a7b8c9d0-e1f2-3456-1234-567890123456', nome: 'Juliana Ferreira', email: 'juliana.ferreira@jeansoares.com.br', role: 'tecnico_enfermagem', cpf: '555.666.777-88', especialidade: 'Técnico em Enfermagem' }
    ];

    for (const prof of profissionais) {
      await client.query(`
        INSERT INTO usuarios (id, nome, email, senha, role, cpf, contato, especialidade, crm, "crmUf", "empresaId", ativo, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome
      `, [
        prof.id, prof.nome, prof.email, senhaHash, prof.role, 
        prof.cpf, prof.contato || null, prof.especialidade || null, 
        prof.crm || null, prof.crmUf || null, empresaId, true
      ]);
      console.log(`  ✅ ${prof.nome} (${prof.role})`);
    }

    // 4. Criar Residentes (Pacientes)
    console.log('\n🏥 Criando residentes...');
    
    const residentes = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        nome: 'Sr. José da Silva',
        cpf: '123.456.789-00',
        dataNascimento: '1940-05-15',
        email: 'familia.jose@email.com',
        telefone: '(11) 98888-1111',
        endereco: 'Rua das Flores, 100',
        observacoes: 'Paciente com diabetes tipo 2, hipertensão controlada. Dieta hipossódica e hipoglicêmica.'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        nome: 'Sra. Ana Maria Santos',
        cpf: '234.567.890-11',
        dataNascimento: '1945-08-20',
        email: 'familia.ana@email.com',
        telefone: '(11) 98888-2222',
        endereco: 'Av. Brasil, 200',
        observacoes: 'Paciente com Alzheimer em estágio inicial. Necessita acompanhamento constante.'
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        nome: 'Sr. Pedro Oliveira',
        cpf: '345.678.901-22',
        dataNascimento: '1938-12-10',
        email: 'familia.pedro@email.com',
        telefone: '(11) 98888-3333',
        endereco: 'Rua São Paulo, 300',
        observacoes: 'Paciente pós-AVC, em recuperação motora. Fisioterapia 3x por semana.'
      }
    ];

    for (const residente of residentes) {
      await client.query(`
        INSERT INTO pacientes (id, nome, cpf, "dataNascimento", email, telefone, endereco, "empresaId", observacoes, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        ON CONFLICT (cpf) DO UPDATE SET nome = EXCLUDED.nome
      `, [
        residente.id, residente.nome, residente.cpf, residente.dataNascimento,
        residente.email, residente.telefone, residente.endereco, empresaId, residente.observacoes
      ]);
      console.log(`  ✅ ${residente.nome}`);
    }

    // 5. Criar Prescrições
    console.log('\n📋 Criando prescrições...');
    
    await client.query(`
      INSERT INTO prescricoes (id, "pacienteId", "nutricionistaId", "empresaId", tipo, descricao, itens, status, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      ON CONFLICT DO NOTHING
    `, [
      '44444444-4444-4444-4444-444444444444',
      '11111111-1111-1111-1111-111111111111', // José
      'c3d4e5f6-a7b8-9012-cdef-123456789012', // Dra. Maria
      empresaId,
      'nutricional',
      'Dieta hipossódica e hipoglicêmica para controle de diabetes e hipertensão',
      JSON.stringify([
        { refeicao: 'Café da manhã', horario: '07:00', alimentos: 'Pão integral, queijo branco, suco natural sem açúcar' },
        { refeicao: 'Lanche da manhã', horario: '10:00', alimentos: 'Fruta (maçã ou pera)' },
        { refeicao: 'Almoço', horario: '12:00', alimentos: 'Arroz integral, feijão, frango grelhado, salada verde, legumes cozidos' },
        { refeicao: 'Lanche da tarde', horario: '15:00', alimentos: 'Iogurte natural, aveia' },
        { refeicao: 'Jantar', horario: '18:00', alimentos: 'Sopa de legumes, peixe assado' }
      ]),
      'ativa'
    ]);
    console.log('  ✅ Prescrição nutricional - José da Silva');

    // 6. Criar Agendamentos
    console.log('\n📅 Criando agendamentos...');
    
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    await client.query(`
      INSERT INTO agendamentos (id, "pacienteId", "empresaId", "usuarioId", titulo, descricao, "dataHora", duracao, tipo, status, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      ON CONFLICT DO NOTHING
    `, [
      '55555555-5555-5555-5555-555555555555',
      '33333333-3333-3333-3333-333333333333', // Pedro
      empresaId,
      'e5f6a7b8-c9d0-1234-ef12-345678901234', // Ana Paula (Fisio)
      'Sessão de Fisioterapia',
      'Fisioterapia motora pós-AVC - exercícios de recuperação',
      amanha.toISOString(),
      60,
      'procedimento',
      'agendado'
    ]);
    console.log('  ✅ Agendamento fisioterapia - Pedro Oliveira');

    // 7. Criar Leitos
    console.log('\n🛏️ Criando leitos...');
    
    const leitos = [
      { numero: '101', status: 'ocupado', pacienteId: '11111111-1111-1111-1111-111111111111' },
      { numero: '102', status: 'ocupado', pacienteId: '22222222-2222-2222-2222-222222222222' },
      { numero: '103', status: 'ocupado', pacienteId: '33333333-3333-3333-3333-333333333333' },
      { numero: '104', status: 'disponivel', pacienteId: null },
      { numero: '105', status: 'disponivel', pacienteId: null }
    ];

    for (const leito of leitos) {
      await client.query(`
        INSERT INTO cr_leitos (id, "empresaId", numero, status, observacoes, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [empresaId, leito.numero, leito.status, leito.pacienteId ? `Ocupado por paciente` : null]);
      console.log(`  ✅ Leito ${leito.numero} - ${leito.status}`);
    }

    // 8. Criar Itens de Estoque
    console.log('\n📦 Criando itens de estoque...');
    
    const estoque = [
      { nome: 'Dipirona 500mg', tipo: 'medicamento', categoria: 'medicamento', unidade: 'comprimido', quantidade: 200, quantidadeMinima: 50, valorUnitario: 0.45 },
      { nome: 'Paracetamol 750mg', tipo: 'medicamento', categoria: 'medicamento', unidade: 'comprimido', quantidade: 150, quantidadeMinima: 40, valorUnitario: 0.35 },
      { nome: 'Omeprazol 20mg', tipo: 'medicamento', categoria: 'medicamento', unidade: 'comprimido', quantidade: 180, quantidadeMinima: 50, valorUnitario: 0.60 },
      { nome: 'Suplemento Nutricional 400g', tipo: 'medicamento', categoria: 'alimento', unidade: 'lata', quantidade: 30, quantidadeMinima: 10, valorUnitario: 45.90 },
      { nome: 'Fralda Geriátrica G', tipo: 'medicamento', categoria: 'higiene', unidade: 'unidade', quantidade: 500, quantidadeMinima: 100, valorUnitario: 2.80 }
    ];

    const estoqueIds = [];
    for (const item of estoque) {
      const result = await client.query(`
        INSERT INTO "EstoqueItens" (id, "empresaId", nome, tipo, categoria, unidade, quantidade, "quantidadeMinima", "valorUnitario", ativo, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING id
      `, [empresaId, item.nome, item.tipo, item.categoria, item.unidade, item.quantidade, item.quantidadeMinima, item.valorUnitario, true]);
      estoqueIds.push(result.rows[0].id);
      console.log(`  ✅ ${item.nome} - ${item.quantidade} ${item.unidade}(s)`);
    }

    // 9. Criar Movimentações de Estoque
    console.log('\n📊 Criando movimentações de estoque...');
    
    // Buscar ID real do Jean
    const jeanResult = await client.query('SELECT id FROM usuarios WHERE email = $1', ['jeansoares@gmail.com']);
    const jeanRealId = jeanResult.rows[0]?.id || jeanId;
    
    for (let i = 0; i < estoqueIds.length; i++) {
      await client.query(`
        INSERT INTO "EstoqueMovimentacoes" (id, "empresaId", "estoqueItemId", "usuarioId", tipo, quantidade, "quantidadeAnterior", "quantidadeNova", "valorUnitario", "valorTotal", motivo, "dataMovimentacao", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW(), NOW())
      `, [
        empresaId,
        estoqueIds[i],
        jeanRealId,
        'entrada',
        estoque[i].quantidade,
        0,
        estoque[i].quantidade,
        estoque[i].valorUnitario,
        estoque[i].quantidade * estoque[i].valorUnitario,
        'Entrada inicial - carga do sistema'
      ]);
    }
    console.log('  ✅ Movimentações de entrada registradas');

    // 10. Criar Transações Financeiras
    console.log('\n💰 Criando transações financeiras...');
    
    // Buscar ID real do Jean
    const jeanFinResult = await client.query('SELECT id FROM usuarios WHERE email = $1', ['jeansoares@gmail.com']);
    const jeanFinRealId = jeanFinResult.rows[0]?.id || jeanId;
    
    const transacoes = [
      {
        tipo: 'receita',
        categoria: 'Mensalidade',
        descricao: 'Mensalidade Janeiro 2026 - José da Silva',
        valor: 4500.00,
        pacienteId: '11111111-1111-1111-1111-111111111111',
        status: 'pago',
        formaPagamento: 'pix'
      },
      {
        tipo: 'receita',
        categoria: 'Mensalidade',
        descricao: 'Mensalidade Janeiro 2026 - Ana Maria Santos',
        valor: 4500.00,
        pacienteId: '22222222-2222-2222-2222-222222222222',
        status: 'pago',
        formaPagamento: 'cartao'
      },
      {
        tipo: 'receita',
        categoria: 'Mensalidade',
        descricao: 'Mensalidade Janeiro 2026 - Pedro Oliveira',
        valor: 5200.00,
        pacienteId: '33333333-3333-3333-3333-333333333333',
        status: 'pago',
        formaPagamento: 'boleto'
      },
      {
        tipo: 'despesa',
        categoria: 'Medicamentos',
        descricao: 'Compra de medicamentos - Fornecedor XYZ',
        valor: 1850.00,
        status: 'pago',
        formaPagamento: 'transferencia'
      },
      {
        tipo: 'despesa',
        categoria: 'Salários',
        descricao: 'Folha de pagamento Janeiro 2026',
        valor: 15000.00,
        status: 'pendente',
        formaPagamento: null
      }
    ];

    for (const transacao of transacoes) {
      await client.query(`
        INSERT INTO "FinanceiroTransacoes" (
          id, "empresaId", "pacienteId", "usuarioId", tipo, categoria, descricao, 
          valor, "dataVencimento", "dataPagamento", status, "formaPagamento", recorrente, "createdAt", "updatedAt"
        )
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      `, [
        empresaId,
        transacao.pacienteId || null,
        jeanFinRealId,
        transacao.tipo,
        transacao.categoria,
        transacao.descricao,
        transacao.valor,
        hoje.toISOString(),
        transacao.status === 'pago' ? hoje.toISOString() : null,
        transacao.status,
        transacao.formaPagamento,
        false
      ]);
      console.log(`  ✅ ${transacao.tipo === 'receita' ? '💵' : '💸'} ${transacao.descricao} - R$ ${transacao.valor.toFixed(2)}`);
    }

    console.log('\n✅ Seed completo finalizado com sucesso!');
    console.log('\n=== CREDENCIAIS ===');
    console.log('Email: jeansoares@gmail.com');
    console.log('Senha: 123456');
    console.log('\n=== RESUMO ===');
    console.log('✅ 1 Empresa criada');
    console.log('✅ 6 Usuários criados (1 admin + 5 profissionais)');
    console.log('✅ 3 Residentes criados');
    console.log('✅ 1 Prescrição criada');
    console.log('✅ 1 Agendamento criado');
    console.log('✅ 5 Leitos criados');
    console.log('✅ 5 Itens de estoque criados');
    console.log('✅ 5 Movimentações de estoque');
    console.log('✅ 5 Transações financeiras');

  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    throw error;
  } finally {
    await client.end();
    console.log('\n🔌 Conexão fechada');
  }
}

seedJeanComplete().catch(console.error);
