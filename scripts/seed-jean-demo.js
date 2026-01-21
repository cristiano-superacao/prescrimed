/**
 * Seed completo para demonstração do sistema
 * Cria usuário Jean Soares e dados completos para todos os módulos
 */

import bcrypt from 'bcryptjs';
import pkg from 'sequelize';
const { Sequelize, DataTypes } = pkg;

async function seedJeanDemo() {
  try {
    console.log('🌱 Iniciando seed completo para demonstração...\n');

    // Hash da senha padrão
    const senhaHash = await bcrypt.hash('123456', 10);

    // 1. Buscar ou criar empresa
    console.log('📋 Buscando empresa...');
    let empresa = await Empresa.findOne({
      where: { cnpj: '99.999.999/0001-99' }
    });

    if (!empresa) {
      empresa = await Empresa.create({
        nome: 'Casa de Repouso Vida Plena',
        tipoSistema: 'casa-repouso',
        cnpj: '99.999.999/0001-99',
        email: 'contato@vidaplena.com.br',
        telefone: '(11) 3456-7890',
        endereco: 'Rua das Flores, 456 - Jardim Paulista, São Paulo - SP',
        plano: 'profissional',
        ativo: true
      });
      console.log(`✅ Empresa criada: ${empresa.nome}`);
    } else {
      console.log(`✅ Empresa encontrada: ${empresa.nome}`);
    }

    // 2. Criar usuário Jean Soares (admin)
    console.log('\n👤 Criando usuário Jean Soares...');
    let jean = await Usuario.findOne({
      where: { email: 'jeansoares@gmail.com' }
    });

    if (!jean) {
      jean = await Usuario.create({
        nome: 'Jean Soares',
        email: 'jeansoares@gmail.com',
        senha: senhaHash,
        role: 'admin',
        cpf: '123.456.789-00',
        contato: '(11) 98765-4321',
        empresaId: empresa.id,
        permissoes: ['gerenciar_usuarios', 'gerenciar_pacientes', 'gerenciar_financeiro', 'gerenciar_estoque'],
        ativo: true
      });
      console.log(`✅ Jean Soares criado com sucesso`);
    } else {
      console.log(`✅ Jean Soares já existe`);
    }

    // 3. Criar profissionais para cada função
    console.log('\n👥 Criando profissionais...');
    
    const profissionais = [
      {
        nome: 'Dra. Maria Silva',
        email: 'maria.silva@vidaplena.com.br',
        role: 'nutricionista',
        cpf: '234.567.890-11',
        contato: '(11) 98765-1111',
        especialidade: 'Nutrição Clínica',
        crm: '12345',
        crmUf: 'SP'
      },
      {
        nome: 'Carlos Santos',
        email: 'carlos.santos@vidaplena.com.br',
        role: 'enfermeiro',
        cpf: '345.678.901-22',
        contato: '(11) 98765-2222',
        especialidade: 'Enfermagem Geriátrica'
      },
      {
        nome: 'Ana Costa',
        email: 'ana.costa@vidaplena.com.br',
        role: 'fisioterapeuta',
        cpf: '456.789.012-33',
        contato: '(11) 98765-3333',
        especialidade: 'Fisioterapia Geriátrica',
        crm: 'CREFITO-67890',
        crmUf: 'SP'
      },
      {
        nome: 'Roberto Lima',
        email: 'roberto.lima@vidaplena.com.br',
        role: 'tecnico_enfermagem',
        cpf: '567.890.123-44',
        contato: '(11) 98765-4444',
        especialidade: 'Técnico em Enfermagem'
      },
      {
        nome: 'Juliana Oliveira',
        email: 'juliana.oliveira@vidaplena.com.br',
        role: 'assistente_social',
        cpf: '678.901.234-55',
        contato: '(11) 98765-5555',
        especialidade: 'Assistência Social'
      },
      {
        nome: 'Pedro Ferreira',
        email: 'pedro.ferreira@vidaplena.com.br',
        role: 'atendente',
        cpf: '789.012.345-66',
        contato: '(11) 98765-6666'
      }
    ];

    const profissionaisCriados = [];
    for (const prof of profissionais) {
      let usuario = await Usuario.findOne({ where: { email: prof.email } });
      if (!usuario) {
        usuario = await Usuario.create({
          ...prof,
          senha: senhaHash,
          empresaId: empresa.id,
          permissoes: [],
          ativo: true
        });
        console.log(`  ✅ ${prof.nome} (${prof.role})`);
      }
      profissionaisCriados.push(usuario);
    }

    // 4. Criar 3 residentes (pacientes)
    console.log('\n🏥 Criando residentes...');
    
    const residentes = [
      {
        nome: 'Sr. José da Silva',
        cpf: '111.222.333-44',
        dataNascimento: '1940-03-15',
        email: 'jose.silva@email.com',
        telefone: '(11) 91111-1111',
        endereco: 'Rua A, 100 - Bairro Centro',
        observacoes: 'Diabético tipo 2, hipertensão controlada. Mobilidade reduzida, necessita cadeira de rodas.'
      },
      {
        nome: 'Sra. Maria das Graças',
        cpf: '222.333.444-55',
        dataNascimento: '1935-07-22',
        email: 'maria.gracas@email.com',
        telefone: '(11) 92222-2222',
        endereco: 'Rua B, 200 - Bairro Jardim',
        observacoes: 'Alzheimer estágio inicial. Acompanhamento neurológico quinzenal. Sem restrições alimentares.'
      },
      {
        nome: 'Sr. Antonio Carlos',
        cpf: '333.444.555-66',
        dataNascimento: '1945-11-08',
        email: 'antonio.carlos@email.com',
        telefone: '(11) 93333-3333',
        endereco: 'Rua C, 300 - Bairro Vila',
        observacoes: 'Recuperação de AVC. Fisioterapia 3x por semana. Dieta hipossódica.'
      }
    ];

    const residentesCriados = [];
    for (const res of residentes) {
      let paciente = await Paciente.findOne({ where: { cpf: res.cpf } });
      if (!paciente) {
        paciente = await Paciente.create({
          ...res,
          empresaId: empresa.id
        });
        console.log(`  ✅ ${res.nome}`);
      }
      residentesCriados.push(paciente);
    }

    // 5. Criar leitos da casa de repouso
    console.log('\n🛏️  Criando leitos...');
    const leitos = ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205'];
    
    for (const numero of leitos) {
      const leito = await CasaRepousoLeito.findOne({
        where: { empresaId: empresa.id, numero }
      });
      
      if (!leito) {
        await CasaRepousoLeito.create({
          empresaId: empresa.id,
          numero,
          status: ['101', '102', '103'].includes(numero) ? 'ocupado' : 'disponivel',
          observacoes: ['101', '102', '103'].includes(numero) 
            ? `Ocupado por ${residentesCriados[leitos.indexOf(numero)]?.nome || 'residente'}` 
            : null
        });
        console.log(`  ✅ Leito ${numero}`);
      }
    }

    // 6. Criar prescrições nutricionais
    console.log('\n📋 Criando prescrições...');
    const nutricionista = profissionaisCriados.find(p => p.role === 'nutricionista');
    
    for (let i = 0; i < residentesCriados.length; i++) {
      const paciente = residentesCriados[i];
      const prescricao = await Prescricao.findOne({
        where: { pacienteId: paciente.id, empresaId: empresa.id }
      });
      
      if (!prescricao) {
        await Prescricao.create({
          pacienteId: paciente.id,
          nutricionistaId: nutricionista.id,
          empresaId: empresa.id,
          tipo: i === 0 ? 'mista' : 'nutricional',
          descricao: i === 0 
            ? 'Dieta hipoglicêmica e hipossódica com suplementação'
            : i === 1
            ? 'Dieta balanceada com textura modificada para facilitar deglutição'
            : 'Dieta hipossódica rigorosa pós-AVC',
          observacoes: 'Acompanhamento semanal do peso e aceitação alimentar',
          itens: i === 0 ? [
            { nome: 'Café da manhã', descricao: 'Leite desnatado, pão integral, queijo branco, fruta', horario: '07:00' },
            { nome: 'Lanche manhã', descricao: 'Iogurte natural com aveia', horario: '10:00' },
            { nome: 'Almoço', descricao: 'Arroz integral, feijão, frango grelhado, legumes', horario: '12:00' },
            { nome: 'Lanche tarde', descricao: 'Fruta e biscoito integral', horario: '15:00' },
            { nome: 'Jantar', descricao: 'Sopa de legumes com carne magra', horario: '18:00' },
            { nome: 'Ceia', descricao: 'Chá e torrada', horario: '20:00' }
          ] : [],
          status: 'ativa'
        });
        console.log(`  ✅ Prescrição para ${paciente.nome}`);
      }
    }

    // 7. Criar agendamentos
    console.log('\n📅 Criando agendamentos...');
    const hoje = new Date();
    const agendamentosData = [
      {
        paciente: residentesCriados[0],
        titulo: 'Consulta Médica - Dr. Silva',
        descricao: 'Consulta de rotina mensal',
        dataHora: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 2, 10, 0),
        duracao: 30,
        tipo: 'consulta',
        status: 'agendado'
      },
      {
        paciente: residentesCriados[1],
        titulo: 'Avaliação Neurológica',
        descricao: 'Acompanhamento Alzheimer',
        dataHora: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 5, 14, 0),
        duracao: 45,
        tipo: 'avaliacao',
        status: 'agendado'
      },
      {
        paciente: residentesCriados[2],
        titulo: 'Sessão de Fisioterapia',
        descricao: 'Reabilitação motora pós-AVC',
        dataHora: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1, 9, 0),
        duracao: 60,
        tipo: 'procedimento',
        status: 'confirmado'
      }
    ];

    for (const agd of agendamentosData) {
      await Agendamento.create({
        ...agd,
        pacienteId: agd.paciente.id,
        empresaId: empresa.id,
        usuarioId: profissionaisCriados[0].id
      });
      console.log(`  ✅ ${agd.titulo} - ${agd.paciente.nome}`);
    }

    // 8. Criar sessões de fisioterapia
    console.log('\n🏃 Criando sessões de fisioterapia...');
    const fisio = profissionaisCriados.find(p => p.role === 'fisioterapeuta');
    
    await SessaoFisio.create({
      empresaId: empresa.id,
      pacienteId: residentesCriados[2].id,
      protocolo: 'Reabilitação motora pós-AVC - Exercícios de fortalecimento e coordenação',
      dataHora: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 2, 9, 0),
      duracao: 60,
      observacoes: 'Paciente evoluindo bem. Melhora na coordenação do membro superior direito.'
    });
    console.log(`  ✅ Sessão de fisioterapia para ${residentesCriados[2].nome}`);

    // 9. Criar itens de estoque
    console.log('\n📦 Criando itens de estoque...');
    const itensEstoque = [
      {
        nome: 'Dipirona 500mg',
        descricao: 'Analgésico e antitérmico',
        tipo: 'medicamento',
        categoria: 'medicamento',
        unidade: 'comprimido',
        quantidade: 200,
        quantidadeMinima: 50,
        valorUnitario: 0.35,
        localizacao: 'Farmácia - Prateleira A1',
        lote: 'LOT123456',
        validade: new Date(2026, 11, 31)
      },
      {
        nome: 'Omeprazol 20mg',
        descricao: 'Protetor gástrico',
        tipo: 'medicamento',
        categoria: 'medicamento',
        unidade: 'comprimido',
        quantidade: 150,
        quantidadeMinima: 40,
        valorUnitario: 0.45,
        localizacao: 'Farmácia - Prateleira A2',
        lote: 'LOT789012',
        validade: new Date(2027, 5, 30)
      },
      {
        nome: 'Suplemento Nutricional Ensure',
        descricao: 'Suplemento alimentar',
        tipo: 'medicamento',
        categoria: 'alimento',
        unidade: 'lata',
        quantidade: 30,
        quantidadeMinima: 10,
        valorUnitario: 28.90,
        localizacao: 'Despensa - Setor Suplementos'
      },
      {
        nome: 'Fralda Geriátrica G',
        descricao: 'Fralda descartável tamanho grande',
        tipo: 'material',
        categoria: 'higiene',
        unidade: 'pacote',
        quantidade: 50,
        quantidadeMinima: 15,
        valorUnitario: 45.00,
        localizacao: 'Almoxarifado - Setor Higiene'
      },
      {
        nome: 'Luva de Procedimento M',
        descricao: 'Luva descartável tamanho médio',
        tipo: 'material',
        categoria: 'epi',
        unidade: 'caixa',
        quantidade: 25,
        quantidadeMinima: 8,
        valorUnitario: 32.00,
        localizacao: 'Enfermaria - Armário 3'
      }
    ];

    const estoqueItens = [];
    for (const item of itensEstoque) {
      let estoqueItem = await EstoqueItem.findOne({
        where: { empresaId: empresa.id, nome: item.nome }
      });
      
      if (!estoqueItem) {
        estoqueItem = await EstoqueItem.create({
          ...item,
          empresaId: empresa.id,
          ativo: true
        });
        console.log(`  ✅ ${item.nome}`);
      }
      estoqueItens.push(estoqueItem);
    }

    // 10. Criar movimentações de estoque
    console.log('\n📊 Criando movimentações de estoque...');
    for (const item of estoqueItens) {
      await EstoqueMovimentacao.create({
        empresaId: empresa.id,
        estoqueItemId: item.id,
        usuarioId: jean.id,
        tipo: 'entrada',
        quantidade: item.quantidade,
        quantidadeAnterior: 0,
        quantidadeNova: item.quantidade,
        valorUnitario: item.valorUnitario,
        valorTotal: item.quantidade * item.valorUnitario,
        motivo: 'Estoque inicial',
        observacoes: 'Entrada inicial do sistema',
        dataMovimentacao: new Date()
      });
    }
    console.log(`  ✅ ${estoqueItens.length} movimentações de entrada criadas`);

    // 11. Criar transações financeiras
    console.log('\n💰 Criando transações financeiras...');
    
    // Receitas - Mensalidades dos residentes
    for (const residente of residentesCriados) {
      await FinanceiroTransacao.create({
        empresaId: empresa.id,
        pacienteId: residente.id,
        tipo: 'receita',
        categoria: 'Mensalidade',
        descricao: `Mensalidade ${residente.nome} - Janeiro/2026`,
        valor: 4500.00,
        dataVencimento: new Date(2026, 0, 10),
        dataPagamento: new Date(2026, 0, 8),
        status: 'pago',
        formaPagamento: 'transferencia',
        observacoes: 'Pagamento em dia',
        recorrente: true,
        periodoRecorrencia: 'mensal'
      });
      console.log(`  ✅ Mensalidade ${residente.nome}`);
    }

    // Despesas
    const despesas = [
      {
        categoria: 'Salários',
        descricao: 'Folha de pagamento - Janeiro/2026',
        valor: 28000.00,
        dataVencimento: new Date(2026, 0, 5),
        dataPagamento: new Date(2026, 0, 5),
        formaPagamento: 'transferencia'
      },
      {
        categoria: 'Fornecedores',
        descricao: 'Compra de medicamentos - Farmácia Central',
        valor: 3200.00,
        dataVencimento: new Date(2026, 0, 15),
        dataPagamento: new Date(2026, 0, 14),
        formaPagamento: 'boleto'
      },
      {
        categoria: 'Utilidades',
        descricao: 'Conta de luz - Dezembro/2025',
        valor: 1850.00,
        dataVencimento: new Date(2026, 0, 20),
        dataPagamento: null,
        formaPagamento: null
      },
      {
        categoria: 'Utilidades',
        descricao: 'Conta de água - Dezembro/2025',
        valor: 680.00,
        dataVencimento: new Date(2026, 0, 25),
        dataPagamento: null,
        formaPagamento: null
      }
    ];

    for (const desp of despesas) {
      await FinanceiroTransacao.create({
        empresaId: empresa.id,
        tipo: 'despesa',
        ...desp,
        status: desp.dataPagamento ? 'pago' : 'pendente',
        recorrente: desp.categoria === 'Utilidades',
        periodoRecorrencia: desp.categoria === 'Utilidades' ? 'mensal' : null
      });
      console.log(`  ✅ ${desp.descricao}`);
    }

    console.log('\n✅ Seed completo finalizado com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`   - Empresa: ${empresa.nome}`);
    console.log(`   - Usuários: 7 (Jean + 6 profissionais)`);
    console.log(`   - Residentes: 3`);
    console.log(`   - Leitos: 10 (3 ocupados)`);
    console.log(`   - Prescrições: 3`);
    console.log(`   - Agendamentos: 3`);
    console.log(`   - Sessões Fisio: 1`);
    console.log(`   - Itens Estoque: 5`);
    console.log(`   - Movimentações: 5`);
    console.log(`   - Transações: 7`);
    console.log('\n🔐 Login:');
    console.log(`   Email: jeansoares@gmail.com`);
    console.log(`   Senha: 123456`);

  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  }
}

// Executar seed
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não configurada');
  process.exit(1);
}

console.log('🔌 Conectando ao banco:', DATABASE_URL.split('@')[1]);

seedJeanDemo()
  .then(() => {
    console.log('\n✨ Seed concluído!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });
