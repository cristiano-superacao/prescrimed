/**
 * Seed completo usando SQL direto
 * Mais confiável para popular o banco
 */

import pg from 'pg';
import bcrypt from 'bcryptjs';
const { Client } = pg;

async function seedJeanDemo() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('🌱 Iniciando seed completo para demonstração...\n');

    // Hash da senha
    const senhaHash = await bcrypt.hash('123456', 10);
    
    // 1. Buscar ou criar empresa
    console.log('📋 Criando/buscando empresa...');
    const empresaResult = await client.query(`
      INSERT INTO empresas (id, nome, "tipoSistema", cnpj, email, telefone, endereco, plano, ativo, "createdAt", "updatedAt")
      VALUES (
        'ceeec2b6-4633-4f28-9a83-29c7dc175eca',
        'Casa de Repouso Vida Plena',
        'casa-repouso',
        '99.999.999/0001-99',
        'contato@vidaplena.com.br',
        '(11) 3456-7890',
        'Rua das Flores, 456 - Jardim Paulista, São Paulo - SP',
        'profissional',
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (cnpj) DO UPDATE SET nome = EXCLUDED.nome
      RETURNING id, nome;
    `);
    console.log(`✅ Empresa: ${empresaResult.rows[0].nome}`);
    const empresaId = empresaResult.rows[0].id;

    // 2. Criar Jean Soares
    console.log('\n👤 Criando Jean Soares...');
    await client.query(`
      INSERT INTO usuarios (id, nome, email, senha, role, cpf, contato, permissoes, "empresaId", ativo, "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        'Jean Soares',
        'jeansoares@gmail.com',
        $1,
        'admin',
        '123.456.789-00',
        '(11) 98765-4321',
        '["gerenciar_usuarios", "gerenciar_pacientes", "gerenciar_financeiro", "gerenciar_estoque"]'::json,
        $2,
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome
    `, [senhaHash, empresaId]);
    console.log('✅ Jean Soares criado');

    // 3. Criar profissionais
    console.log('\n👥 Criando profissionais...');
    const profissionais = [
      ['Dra. Maria Silva', 'maria.silva@vidaplena.com.br', 'nutricionista', '234.567.890-11', '(11) 98765-1111', 'Nutrição Clínica', '12345', 'SP'],
      ['Carlos Santos', 'carlos.santos@vidaplena.com.br', 'enfermeiro', '345.678.901-22', '(11) 98765-2222', 'Enfermagem Geriátrica', null, null],
      ['Ana Costa', 'ana.costa@vidaplena.com.br', 'fisioterapeuta', '456.789.012-33', '(11) 98765-3333', 'Fisioterapia Geriátrica', 'CREFITO-67890', 'SP'],
      ['Roberto Lima', 'roberto.lima@vidaplena.com.br', 'tecnico_enfermagem', '567.890.123-44', '(11) 98765-4444', 'Técnico em Enfermagem', null, null],
      ['Juliana Oliveira', 'juliana.oliveira@vidaplena.com.br', 'assistente_social', '678.901.234-55', '(11) 98765-5555', 'Assistência Social', null, null],
      ['Pedro Ferreira', 'pedro.ferreira@vidaplena.com.br', 'atendente', '789.012.345-66', '(11) 98765-6666', null, null, null]
    ];

    for (const [nome, email, role, cpf, contato, especialidade, crm, crmUf] of profissionais) {
      await client.query(`
        INSERT INTO usuarios (id, nome, email, senha, role, cpf, contato, especialidade, crm, "crmUf", permissoes, "empresaId", ativo, "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(),
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          '[]'::json,
          $10,
          true,
          NOW(),
          NOW()
        )
        ON CONFLICT (email) DO NOTHING
      `, [nome, email, senhaHash, role, cpf, contato, especialidade, crm, crmUf, empresaId]);
      console.log(`  ✅ ${nome} (${role})`);
    }

    // 4. Criar residentes
    console.log('\n🏥 Criando residentes...');
    const residentes = [
      ['Sr. José da Silva', '111.222.333-44', '1940-03-15', 'jose.silva@email.com', '(11) 91111-1111', 'Rua A, 100 - Bairro Centro', 'Diabético tipo 2, hipertensão controlada. Mobilidade reduzida, necessita cadeira de rodas.'],
      ['Sra. Maria das Graças', '222.333.444-55', '1935-07-22', 'maria.gracas@email.com', '(11) 92222-2222', 'Rua B, 200 - Bairro Jardim', 'Alzheimer estágio inicial. Acompanhamento neurológico quinzenal. Sem restrições alimentares.'],
      ['Sr. Antonio Carlos', '333.444.555-66', '1945-11-08', 'antonio.carlos@email.com', '(11) 93333-3333', 'Rua C, 300 - Bairro Vila', 'Recuperação de AVC. Fisioterapia 3x por semana. Dieta hipossódica.']
    ];

    for (const [nome, cpf, dataNascimento, email, telefone, endereco, observacoes] of residentes) {
      await client.query(`
        INSERT INTO pacientes (id, nome, cpf, "dataNascimento", email, telefone, endereco, "empresaId", observacoes, "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(),
          $1, $2, $3, $4, $5, $6, $7, $8,
          NOW(),
          NOW()
        )
        ON CONFLICT (cpf) DO NOTHING
      `, [nome, cpf, dataNascimento, email, telefone, endereco, empresaId, observacoes]);
      console.log(`  ✅ ${nome}`);
    }

    // 5. Criar leitos
    console.log('\n🛏️  Criando leitos...');
    for (let i = 1; i <= 10; i++) {
      const numero = i <= 5 ? `10${i}` : `20${i-5}`;
      const status = i <= 3 ? 'ocupado' : 'disponivel';
      
      await client.query(`
        INSERT INTO cr_leitos (id, "empresaId", numero, status, observacoes, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [empresaId, numero, status, i <= 3 ? 'Ocupado' : null]);
    }
    console.log('  ✅ 10 leitos criados');

    // 6. Buscar IDs para relacionamentos
    const nutriRes = await client.query(`SELECT id FROM usuarios WHERE email = 'maria.silva@vidaplena.com.br' LIMIT 1`);
    const nutriId = nutriRes.rows[0]?.id;
    
    const pacRes = await client.query(`SELECT id, nome FROM pacientes WHERE "empresaId" = $1 ORDER BY "createdAt" LIMIT 3`, [empresaId]);
    const pacientes = pacRes.rows;

    // 7. Criar prescrições
    if (nutriId && pacientes.length > 0) {
      console.log('\n📋 Criando prescrições...');
      for (let i = 0; i < pacientes.length; i++) {
        const pac = pacientes[i];
        await client.query(`
          INSERT INTO prescricoes (id, "pacienteId", "nutricionistaId", "empresaId", tipo, descricao, observacoes, itens, status, "createdAt", "updatedAt")
          VALUES (
            gen_random_uuid(),
            $1, $2, $3,
            $4, $5, $6, $7,
            'ativa',
            NOW(), NOW()
          )
          ON CONFLICT DO NOTHING
        `, [
          pac.id, 
          nutriId, 
          empresaId,
          i === 0 ? 'mista' : 'nutricional',
          i === 0 ? 'Dieta hipoglicêmica e hipossódica' : i === 1 ? 'Dieta balanceada textura modificada' : 'Dieta hipossódica rigorosa pós-AVC',
          'Acompanhamento semanal',
          JSON.stringify([
            { nome: 'Café', descricao: 'Leite desnatado, pão integral', horario: '07:00' },
            { nome: 'Almoço', descricao: 'Arroz integral, frango, legumes', horario: '12:00' },
            { nome: 'Jantar', descricao: 'Sopa de legumes', horario: '18:00' }
          ])
        ]);
        console.log(`  ✅ Prescrição para ${pac.nome}`);
      }
    }

    // 8. Criar agendamentos
    console.log('\n📅 Criando agendamentos...');
    for (let i = 0; i < Math.min(3, pacientes.length); i++) {
      const pac = pacientes[i];
      await client.query(`
        INSERT INTO agendamentos (id, "pacienteId", "empresaId", titulo, descricao, "dataHora", duracao, tipo, status, "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(),
          $1, $2, $3, $4, 
          NOW() + interval '${i+1} days',
          ${i === 2 ? 60 : 30},
          ${i === 2 ? "'procedimento'" : i === 1 ? "'avaliacao'" : "'consulta'"},
          ${i === 2 ? "'confirmado'" : "'agendado'"},
          NOW(), NOW()
        )
      `, [pac.id, empresaId, `Consulta ${pac.nome}`, `Atendimento ${i+1}`]);
    }
    console.log('  ✅ 3 agendamentos criados');

    // 9. Criar itens de estoque
    console.log('\n📦 Criando itens de estoque...');
    const itens = [
      ['Dipirona 500mg', 'Analgésico', 'medicamento', 'medicamento', 'comprimido', 200, 50, 0.35],
      ['Omeprazol 20mg', 'Protetor gástrico', 'medicamento', 'medicamento', 'comprimido', 150, 40, 0.45],
      ['Suplemento Ensure', 'Suplemento alimentar', 'medicamento', 'alimento', 'lata', 30, 10, 28.90],
      ['Fralda Geriátrica G', 'Fralda descartável', 'material', 'higiene', 'pacote', 50, 15, 45.00],
      ['Luva Procedimento M', 'Luva descartável', 'material', 'epi', 'caixa', 25, 8, 32.00]
    ];

    for (const [nome, descricao, tipo, categoria, unidade, qtd, qtdMin, valor] of itens) {
      await client.query(`
        INSERT INTO "EstoqueItens" (id, "empresaId", nome, descricao, tipo, categoria, unidade, quantidade, "quantidadeMinima", "valorUnitario", ativo, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, true, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [empresaId, nome, descricao, tipo, categoria, unidade, qtd, qtdMin, valor]);
      console.log(`  ✅ ${nome}`);
    }

    // 10. Criar transações financeiras
    console.log('\n💰 Criando transações financeiras...');
    
    // Receitas
    for (const pac of pacientes) {
      await client.query(`
        INSERT INTO "FinanceiroTransacoes" (id, "empresaId", "pacienteId", tipo, categoria, descricao, valor, "dataVencimento", "dataPagamento", status, "formaPagamento", recorrente, "periodoRecorrencia", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, 'receita', 'Mensalidade', $3, 4500.00, '2026-01-10', '2026-01-08', 'pago', 'transferencia', true, 'mensal', NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [empresaId, pac.id, `Mensalidade ${pac.nome} - Janeiro/2026`]);
    }
    console.log(`  ✅ ${pacientes.length} mensalidades`);

    // Despesas
    await client.query(`
      INSERT INTO "FinanceiroTransacoes" (id, "empresaId", tipo, categoria, descricao, valor, "dataVencimento", status, "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), $1, 'despesa', 'Salários', 'Folha Janeiro/2026', 28000.00, '2026-01-05', 'pago', NOW(), NOW()),
        (gen_random_uuid(), $1, 'despesa', 'Fornecedores', 'Medicamentos', 3200.00, '2026-01-15', 'pago', NOW(), NOW()),
        (gen_random_uuid(), $1, 'despesa', 'Utilidades', 'Luz Dezembro', 1850.00, '2026-01-20', 'pendente', NOW(), NOW()),
        (gen_random_uuid(), $1, 'despesa', 'Utilidades', 'Água Dezembro', 680.00, '2026-01-25', 'pendente', NOW(), NOW())
      ON CONFLICT DO NOTHING
    `, [empresaId]);
    console.log('  ✅ 4 despesas');

    console.log('\n✅ Seed completo finalizado!');
    console.log('\n🔐 Login:');
    console.log('   Email: jeansoares@gmail.com');
    console.log('   Senha: 123456');

  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Executar
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL não configurada');
  process.exit(1);
}

seedJeanDemo()
  .then(() => {
    console.log('\n✨ Concluído!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });
