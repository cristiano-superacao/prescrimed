import bcrypt from 'bcryptjs';
import { sequelize, Empresa, Usuario, Paciente, Prescricao } from '../models/index.js';

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

async function main() {
  const senhaPadrao = process.env.SEED_PASSWORD || 'Prescri@2026';
  const slug = process.env.SEED_SLUG || 'empresa-teste';

  try {
    console.log('🌱 Seed mínimo (1 empresa, 1 usuário por role, 3 pacientes)...');

    await sequelize.authenticate();
    await sequelize.sync({ force: false, alter: process.env.NODE_ENV !== 'production' });

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
    const superadmin = await upsertUsuario({
      nome: 'Super Admin',
      email: `superadmin+${slug}@prescrimed.com`,
      role: 'superadmin',
      empresaId: null,
      senhaHash,
    });

    const admin = await upsertUsuario({
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

    const atendente = await upsertUsuario({
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

    console.log('✅ Seed concluído');
    console.log('---');
    console.log(`Empresa: ${empresa.nome} (${empresa.id})`);
    console.log(`Senha padrão: ${senhaPadrao}`);
    console.log(`superadmin: superadmin+${slug}@prescrimed.com`);
    console.log(`admin: admin+${slug}@prescrimed.com`);
    console.log(`nutricionista: nutri+${slug}@prescrimed.com`);
    console.log(`atendente: atendente+${slug}@prescrimed.com`);
  } catch (error) {
    console.error('❌ Falha no seed mínimo:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
