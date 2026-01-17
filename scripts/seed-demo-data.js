import bcrypt from 'bcryptjs';
import { sequelize, Empresa, Usuario, Paciente, Prescricao } from '../models/index.js';

async function main() {
  try {
    console.log('🌱 Iniciando seed de dados demo...');

    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados');

    // Garante que as tabelas existam e acompanhem o schema no ambiente local
    await sequelize.sync({ force: false, alter: process.env.NODE_ENV !== 'production' });

    const empresasSpec = [
      {
        slug: 'benevolencia-solidaria',
        nome: 'Benevolência Solidária',
        tipoSistema: 'casa-repouso',
        cnpj: '11.111.111/0001-11',
        plano: 'profissional'
      },
      {
        slug: 'vital-fisio-center',
        nome: 'Vital Fisio Center',
        tipoSistema: 'fisioterapia',
        cnpj: '22.222.222/0001-22',
        plano: 'empresa'
      },
      {
        slug: 'pet-care-premium',
        nome: 'Pet Care Premium',
        tipoSistema: 'petshop',
        cnpj: '33.333.333/0001-33',
        plano: 'basico'
      }
    ];

    const senhaHash = await bcrypt.hash('Prescri@2026', 10);

    for (const [index, spec] of empresasSpec.entries()) {
      const empresa = await Empresa.findOrCreate({
        where: { cnpj: spec.cnpj },
        defaults: {
          nome: spec.nome,
          tipoSistema: spec.tipoSistema,
          email: `${spec.slug}@exemplo.com`,
          telefone: '(11) 99999-0000',
          endereco: 'Endereço demo, 123 - Centro',
          plano: spec.plano,
          ativo: true
        }
      }).then(([e]) => e);

      console.log(`🏢 Empresa pronta: ${empresa.nome}`);

      // Cria usuários: admin, nutricionista, atendente (em sequência para evitar lock no SQLite)
      const usuarios = [];

      const admin = await Usuario.findOrCreate({
        where: { email: `admin+${spec.slug}@prescrimed.com` },
        defaults: {
          nome: `Admin ${empresa.nome}`,
          email: `admin+${spec.slug}@prescrimed.com`,
          senha: senhaHash,
          role: 'admin',
          empresaId: empresa.id,
          ativo: true
        }
      }).then(([u]) => u);
      usuarios.push(admin);

      const nutri = await Usuario.findOrCreate({
        where: { email: `nutri+${spec.slug}@prescrimed.com` },
        defaults: {
          nome: `Nutricionista ${index + 1}`,
          email: `nutri+${spec.slug}@prescrimed.com`,
          senha: senhaHash,
          role: 'nutricionista',
          empresaId: empresa.id,
          ativo: true
        }
      }).then(([u]) => u);
      usuarios.push(nutri);

      const atendente = await Usuario.findOrCreate({
        where: { email: `atendente+${spec.slug}@prescrimed.com` },
        defaults: {
          nome: `Atendente ${index + 1}`,
          email: `atendente+${spec.slug}@prescrimed.com`,
          senha: senhaHash,
          role: 'atendente',
          empresaId: empresa.id,
          ativo: true
        }
      }).then(([u]) => u);
      usuarios.push(atendente);

      const nutricionista = usuarios[1];

      // 3 pacientes por empresa
      const pacientes = [];
      for (let i = 1; i <= 3; i++) {
        const paciente = await Paciente.findOrCreate({
          where: { cpf: `${index + 1}000000000${i}` },
          defaults: {
            nome: `Paciente ${i} - ${empresa.nome}`,
            cpf: `${index + 1}000000000${i}`,
            dataNascimento: '1950-01-0' + i,
            email: `paciente${i}+${spec.slug}@exemplo.com`,
            telefone: '(11) 90000-0000',
            endereco: `Quarto ${i}, Unidade ${empresa.nome}`,
            empresaId: empresa.id,
            observacoes: 'Paciente criado para ambiente de demonstração.'
          }
        }).then(([p]) => p);
        pacientes.push(paciente);
      }

      console.log(`👥 Pacientes criados para ${empresa.nome}: ${pacientes.length}`);

      // 1 prescrição por paciente
      for (const paciente of pacientes) {
        await Prescricao.findOrCreate({
          where: {
            pacienteId: paciente.id,
            empresaId: empresa.id
          },
          defaults: {
            pacienteId: paciente.id,
            empresaId: empresa.id,
            nutricionistaId: nutricionista.id,
            tipo: 'nutricional',
            descricao: `Plano nutricional inicial para ${paciente.nome}`,
            observacoes: 'Prescrição gerada automaticamente para demonstração.',
            itens: [
              {
                refeicao: 'Café da manhã',
                descricao: 'Opções leves ricas em fibras e proteínas',
                horario: '08:00'
              },
              {
                refeicao: 'Almoço',
                descricao: 'Prato balanceado com salada, proteína magra e carboidrato complexo',
                horario: '12:00'
              },
              {
                refeicao: 'Jantar',
                descricao: 'Refeição leve com foco em digestão tranquila',
                horario: '18:30'
              }
            ],
            status: 'ativa'
          }
        });
      }

      console.log(`🧾 Prescrições criadas para ${empresa.nome}`);
    }

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('Credenciais de exemplo disponíveis em docs/CREDENCIAIS_USUARIOS.md (ajuste se necessário).');
  } catch (error) {
    console.error('❌ Erro ao executar seed demo:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

main();
