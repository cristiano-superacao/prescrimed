import bcrypt from 'bcryptjs';
import {
  sequelize,
  Empresa,
  Usuario,
  Paciente,
  Prescricao,
  EstoqueItem,
  EstoqueMovimentacao,
  FinanceiroTransacao,
} from '../models/index.js';
import { pathToFileURL } from 'url';

async function upsertUsuario({ nome, email, role, empresaId, senhaHash }) {
  const [usuario] = await Usuario.findOrCreate({
    where: { email },
    defaults: {
      nome,
      email,
      senha: senhaHash,
      role,
      empresaId,
      ativo: true,
    },
  });

  // Garante role/empresaId (idempotente)
  await usuario.update({
    nome,
    role,
    empresaId,
    ativo: true,
  });

  return usuario;
}

async function upsertPaciente({ nome, cpf, empresaId }) {
  const [paciente] = await Paciente.findOrCreate({
    where: { cpf },
    defaults: {
      nome,
      cpf,
      dataNascimento: '1950-01-01',
      email: `${cpf}@exemplo.com`,
      telefone: '(11) 90000-0000',
      endereco: 'Endereço demo',
      empresaId,
      observacoes: 'Paciente criado para ambiente de demonstração.',
    },
  });

  await paciente.update({ nome, empresaId });
  return paciente;
}

export async function seedMinimal({ closeConnection = true } = {}) {
  const senhaPadrao = process.env.SEED_PASSWORD || 'Prescri@2026';
  const slug = process.env.SEED_SLUG || 'empresa-teste';

  try {
    console.log('🌱 Seed mínimo (1 empresa, 1 usuário por role, 3 pacientes)...');

    await sequelize.authenticate();
    const dialect = typeof sequelize.getDialect === 'function' ? sequelize.getDialect() : '';
    const allowAlter = dialect !== 'sqlite' && process.env.NODE_ENV !== 'production';
    await sequelize.sync({ force: false, alter: allowAlter });

    const [empresa] = await Empresa.findOrCreate({
      where: { cnpj: '99.999.999/0001-99' },
      defaults: {
        nome: 'Empresa Teste - Prescrimed',
        tipoSistema: 'casa-repouso',
        cnpj: '99.999.999/0001-99',
        email: `contato+${slug}@prescrimed.com`,
        telefone: '(11) 99999-0000',
        endereco: 'Rua Demo, 123',
        plano: 'profissional',
        ativo: true,
      },
    });

    const senhaHash = await bcrypt.hash(senhaPadrao, 10);

    // Superadmin (sem empresa vinculada)
    await upsertUsuario({
      nome: 'Super Admin',
      email: `superadmin+${slug}@prescrimed.com`,
      role: 'superadmin',
      empresaId: null,
      senhaHash,
    });

    await upsertUsuario({
      nome: 'Admin Teste',
      email: `admin+${slug}@prescrimed.com`,
      role: 'admin',
      empresaId: empresa.id,
      senhaHash,
    });

    const nutricionista = await upsertUsuario({
      nome: 'Nutricionista Teste',
      email: `nutri+${slug}@prescrimed.com`,
      role: 'nutricionista',
      empresaId: empresa.id,
      senhaHash,
    });

    await upsertUsuario({
      nome: 'Atendente Teste',
      email: `atendente+${slug}@prescrimed.com`,
      role: 'atendente',
      empresaId: empresa.id,
      senhaHash,
    });

    const pacientes = [];
    for (let i = 1; i <= 3; i++) {
      const cpf = `9900000000${i}`;
      const paciente = await upsertPaciente({
        nome: `Paciente Teste ${i}`,
        cpf,
        empresaId: empresa.id,
      });
      pacientes.push(paciente);
    }

    // 1 prescrição medicamentosa para o paciente 1 (compatível com o frontend)
    await Prescricao.findOrCreate({
      where: { pacienteId: pacientes[0].id, empresaId: empresa.id },
      defaults: {
        pacienteId: pacientes[0].id,
        empresaId: empresa.id,
        nutricionistaId: nutricionista.id,
        tipo: 'medicamentosa',
        descricao: `Prescrição de medicamentos para ${pacientes[0].nome}`,
        observacoes: 'Gerada automaticamente (demo).',
        itens: [
          { nome: 'Dipirona', dosagem: '500mg', frequencia: '8/8h', duracao: '7 dias', observacoes: '', controlado: false },
          { nome: 'Omeprazol', dosagem: '20mg', frequencia: '1x ao dia', duracao: '14 dias', observacoes: '', controlado: false },
        ],
        status: 'ativa',
      },
    });

    // Estoque (2 itens + movimentações)
    const [dipirona] = await EstoqueItem.findOrCreate({
      where: { empresaId: empresa.id, categoria: 'medicamento', nome: 'Dipirona' },
      defaults: {
        empresaId: empresa.id,
        nome: 'Dipirona',
        unidade: 'comprimido',
        categoria: 'medicamento',
        descricao: 'Analgésico',
        quantidade: 50,
        quantidadeMinima: 10,
        valorUnitario: 0.35,
      },
    });

    const [suplemento] = await EstoqueItem.findOrCreate({
      where: { empresaId: empresa.id, categoria: 'alimento', nome: 'Suplemento Nutricional' },
      defaults: {
        empresaId: empresa.id,
        nome: 'Suplemento Nutricional',
        unidade: 'unidade',
        categoria: 'alimento',
        descricao: 'Nutrição',
        quantidade: 20,
        quantidadeMinima: 5,
        valorUnitario: 8.9,
      },
    });

    const now = new Date();
    await EstoqueMovimentacao.findOrCreate({
      where: { empresaId: empresa.id, estoqueItemId: dipirona.id, tipo: 'entrada', quantidade: 50, motivo: 'Seed demo' },
      defaults: {
        empresaId: empresa.id,
        estoqueItemId: dipirona.id,
        usuarioId: nutricionista.id,
        tipo: 'entrada',
        quantidade: 50,
        quantidadeAnterior: 0,
        quantidadeNova: 50,
        valorUnitario: 0.35,
        valorTotal: 17.5,
        motivo: 'Seed demo',
        observacoes: 'Entrada inicial (demo).',
        dataMovimentacao: now,
      },
    });

    await EstoqueMovimentacao.findOrCreate({
      where: { empresaId: empresa.id, estoqueItemId: suplemento.id, tipo: 'entrada', quantidade: 20, motivo: 'Seed demo' },
      defaults: {
        empresaId: empresa.id,
        estoqueItemId: suplemento.id,
        usuarioId: nutricionista.id,
        tipo: 'entrada',
        quantidade: 20,
        quantidadeAnterior: 0,
        quantidadeNova: 20,
        valorUnitario: 8.9,
        valorTotal: 178,
        motivo: 'Seed demo',
        observacoes: 'Entrada inicial (demo).',
        dataMovimentacao: now,
      },
    });

    // Financeiro (1 receita + 1 despesa)
    await FinanceiroTransacao.findOrCreate({
      where: { empresaId: empresa.id, tipo: 'receita', descricao: 'Mensalidade (demo)' },
      defaults: {
        empresaId: empresa.id,
        pacienteId: pacientes[0].id,
        tipo: 'receita',
        descricao: 'Mensalidade (demo)',
        valor: 1500,
        categoria: 'Mensalidade',
        dataVencimento: now,
        dataPagamento: now,
        status: 'pago',
        formaPagamento: 'pix',
        observacoes: 'Lançamento gerado automaticamente (demo).',
      },
    });

    await FinanceiroTransacao.findOrCreate({
      where: { empresaId: empresa.id, tipo: 'despesa', descricao: 'Compra de insumos (demo)' },
      defaults: {
        empresaId: empresa.id,
        tipo: 'despesa',
        descricao: 'Compra de insumos (demo)',
        valor: 320,
        categoria: 'Insumos',
        dataVencimento: now,
        dataPagamento: now,
        status: 'pago',
        formaPagamento: 'cartao',
        observacoes: 'Lançamento gerado automaticamente (demo).',
      },
    });

    console.log('✅ Seed concluído');
    console.log('---');
    console.log(`Empresa: ${empresa.nome} (${empresa.id})`);
    console.log(`Senha padrão: ${senhaPadrao}`);
    console.log(`superadmin: superadmin+${slug}@prescrimed.com`);
    console.log(`admin: admin+${slug}@prescrimed.com`);
    console.log(`nutricionista: nutri+${slug}@prescrimed.com`);
    console.log(`atendente: atendente+${slug}@prescrimed.com`);

    return { empresaId: empresa.id };
  } finally {
    if (closeConnection) {
      await sequelize.close();
    }
  }
}

const isMain = (() => {
  try {
    if (!process.argv?.[1]) return false;
    return import.meta.url === pathToFileURL(process.argv[1]).href;
  } catch {
    return false;
  }
})();

if (isMain) {
  seedMinimal().catch((error) => {
    console.error('❌ Falha no seed mínimo:', error);
    process.exitCode = 1;
  });
}
