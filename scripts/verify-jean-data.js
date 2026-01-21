import pkg from 'pg';
const { Client } = pkg;

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:oyeoFuAQMHwzFMYbSLXjMQBsNsSqvEYn@gondola.proxy.rlwy.net:16321/railway';

async function verifyJeanData() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔗 Conectado ao banco Railway\n');

    // Empresa
    const empresa = await client.query(`SELECT nome, "tipoSistema", plano FROM empresas WHERE cnpj = '12.345.678/0001-90'`);
    console.log('🏢 Empresa:', empresa.rows[0]);

    // Usuários
    const usuarios = await client.query(`SELECT nome, email, role FROM usuarios WHERE "empresaId" = (SELECT id FROM empresas WHERE cnpj = '12.345.678/0001-90') ORDER BY role`);
    console.log('\n👥 Usuários cadastrados:', usuarios.rowCount);
    usuarios.rows.forEach(u => console.log(`  - ${u.nome} (${u.role}) - ${u.email}`));

    // Residentes
    const residentes = await client.query(`SELECT nome, cpf, TO_CHAR("dataNascimento", 'DD/MM/YYYY') as nascimento FROM pacientes WHERE "empresaId" = (SELECT id FROM empresas WHERE cnpj = '12.345.678/0001-90')`);
    console.log('\n🏥 Residentes:', residentes.rowCount);
    residentes.rows.forEach(r => console.log(`  - ${r.nome} (CPF: ${r.cpf}, Nascimento: ${r.nascimento})`));

    // Leitos
    const leitos = await client.query(`SELECT numero, status FROM cr_leitos WHERE "empresaId" = (SELECT id FROM empresas WHERE cnpj = '12.345.678/0001-90') ORDER BY numero`);
    console.log('\n🛏️ Leitos:', leitos.rowCount);
    leitos.rows.forEach(l => console.log(`  - Leito ${l.numero}: ${l.status}`));

    // Estoque
    const estoque = await client.query(`SELECT nome, quantidade, unidade, "valorUnitario" FROM "EstoqueItens" WHERE "empresaId" = (SELECT id FROM empresas WHERE cnpj = '12.345.678/0001-90')`);
    console.log('\n📦 Itens em estoque:', estoque.rowCount);
    estoque.rows.forEach(e => console.log(`  - ${e.nome}: ${e.quantidade} ${e.unidade}(s) @ R$ ${parseFloat(e.valorUnitario).toFixed(2)}`));

    // Prescrições
    const prescricoes = await client.query(`
      SELECT p.tipo, p.descricao, pac.nome as paciente_nome
      FROM prescricoes p
      JOIN pacientes pac ON p."pacienteId" = pac.id
      WHERE p."empresaId" = (SELECT id FROM empresas WHERE cnpj = '12.345.678/0001-90')
    `);
    console.log('\n📋 Prescrições:', prescricoes.rowCount);
    prescricoes.rows.forEach(p => console.log(`  - ${p.tipo} para ${p.paciente_nome}`));

    // Agendamentos
    const agendamentos = await client.query(`
      SELECT a.titulo, a.tipo, TO_CHAR(a."dataHora", 'DD/MM/YYYY HH24:MI') as data, pac.nome as paciente_nome
      FROM agendamentos a
      JOIN pacientes pac ON a."pacienteId" = pac.id
      WHERE a."empresaId" = (SELECT id FROM empresas WHERE cnpj = '12.345.678/0001-90')
    `);
    console.log('\n📅 Agendamentos:', agendamentos.rowCount);
    agendamentos.rows.forEach(a => console.log(`  - ${a.titulo} (${a.tipo}) - ${a.paciente_nome} em ${a.data}`));

    // Financeiro
    const receitas = await client.query(`
      SELECT SUM(valor) as total FROM "FinanceiroTransacoes"
      WHERE "empresaId" = (SELECT id FROM empresas WHERE cnpj = '12.345.678/0001-90')
      AND tipo = 'receita' AND status = 'pago'
    `);
    const despesas = await client.query(`
      SELECT SUM(valor) as total FROM "FinanceiroTransacoes"
      WHERE "empresaId" = (SELECT id FROM empresas WHERE cnpj = '12.345.678/0001-90')
      AND tipo = 'despesa' AND status = 'pago'
    `);
    
    console.log('\n💰 Financeiro:');
    console.log(`  - Receitas pagas: R$ ${parseFloat(receitas.rows[0].total || 0).toFixed(2)}`);
    console.log(`  - Despesas pagas: R$ ${parseFloat(despesas.rows[0].total || 0).toFixed(2)}`);
    console.log(`  - Saldo: R$ ${(parseFloat(receitas.rows[0].total || 0) - parseFloat(despesas.rows[0].total || 0)).toFixed(2)}`);

    console.log('\n✅ Verificação completa!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

verifyJeanData();
