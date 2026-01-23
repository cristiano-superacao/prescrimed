#!/usr/bin/env node
/**
 * Script para popular Railway com dados de teste realistas
 * Cria 3 empresas (Casa Repouso, Fisioterapia, Petshop)
 * Com admins, funcionários e residentes/pacientes/pets
 */

const BASE_URL = process.env.API_BASE_URL || 'https://prescrimed-production.up.railway.app';

// Dados das 3 empresas
const empresas = [
  {
    nome: 'Casa de Repouso Vida Plena',
    tipo: 'casa-repouso',
    cnpj: '12345678000101',
    admin: {
      nome: 'Maria Silva',
      email: 'maria.silva@vidaplena.com',
      senha: 'Admin@2026',
      cpf: '11122233344',
      contato: '(71) 98765-4321'
    },
    funcionarios: [
      { nome: 'João Enfermeiro', email: 'joao.enf@vidaplena.com', funcao: 'enfermeiro', cpf: '22233344455' },
      { nome: 'Ana Técnica', email: 'ana.tec@vidaplena.com', funcao: 'tecnico_enfermagem', cpf: '33344455566' },
      { nome: 'Carlos Cuidador', email: 'carlos.cuid@vidaplena.com', funcao: 'cuidador', cpf: '44455566677' }
    ],
    residentes: [
      { nome: 'José Santos', cpf: '55566677788', dataNascimento: '1950-03-15', contato: '(71) 99111-2222' },
      { nome: 'Rita Oliveira', cpf: '66677788899', dataNascimento: '1948-07-22', contato: '(71) 99222-3333' },
      { nome: 'Pedro Costa', cpf: '77788899900', dataNascimento: '1952-11-10', contato: '(71) 99333-4444' }
    ]
  },
  {
    nome: 'Clínica de Fisioterapia Movimento',
    tipo: 'fisioterapia',
    cnpj: '23456789000102',
    admin: {
      nome: 'Dr. Roberto Lima',
      email: 'roberto.lima@movimento.com',
      senha: 'Fisio@2026',
      cpf: '88899900011',
      contato: '(71) 98876-5432'
    },
    funcionarios: [
      { nome: 'Dra. Paula Fisio', email: 'paula.fisio@movimento.com', funcao: 'fisioterapeuta', cpf: '99900011122' },
      { nome: 'Lucas Auxiliar', email: 'lucas.aux@movimento.com', funcao: 'auxiliar', cpf: '10011122233' },
      { nome: 'Fernanda Recepção', email: 'fernanda.rec@movimento.com', funcao: 'recepcionista', cpf: '11122233344' }
    ],
    residentes: [
      { nome: 'Marcos Alves', cpf: '22233344455', dataNascimento: '1980-05-20', contato: '(71) 99444-5555' },
      { nome: 'Sandra Pereira', cpf: '33344455566', dataNascimento: '1975-09-14', contato: '(71) 99555-6666' },
      { nome: 'Rafael Souza', cpf: '44455566677', dataNascimento: '1990-12-03', contato: '(71) 99666-7777' }
    ]
  },
  {
    nome: 'Petshop Amigo Fiel',
    tipo: 'petshop',
    cnpj: '34567890000103',
    admin: {
      nome: 'Dra. Juliana Vet',
      email: 'juliana.vet@amigofiel.com',
      senha: 'Pet@2026',
      cpf: '55566677788',
      contato: '(71) 98987-6543'
    },
    funcionarios: [
      { nome: 'Dr. André Veterinário', email: 'andre.vet@amigofiel.com', funcao: 'veterinario', cpf: '66677788899' },
      { nome: 'Camila Tosadora', email: 'camila.tosa@amigofiel.com', funcao: 'tosador', cpf: '77788899900' },
      { nome: 'Bruno Atendimento', email: 'bruno.atend@amigofiel.com', funcao: 'atendente', cpf: '88899900011' }
    ],
    residentes: [
      { nome: 'Rex', tipo: 'Cachorro', raca: 'Labrador', tutor: 'Carlos Mendes', cpf: '99900011122', contato: '(71) 99777-8888' },
      { nome: 'Mimi', tipo: 'Gato', raca: 'Siamês', tutor: 'Beatriz Rocha', cpf: '10011122233', contato: '(71) 99888-9999' },
      { nome: 'Thor', tipo: 'Cachorro', raca: 'Pastor Alemão', tutor: 'Eduardo Dias', cpf: '11122233344', contato: '(71) 99999-0000' }
    ]
  }
];

async function seedData() {
  console.log('🌱 Iniciando seed de dados no Railway...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  const results = {
    empresas: [],
    usuarios: [],
    residentes: []
  };

  for (const empresa of empresas) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Criando: ${empresa.nome}`);
    console.log(`${'='.repeat(60)}\n`);

    try {
      // 1. Registrar empresa e admin
      console.log(`1️⃣ Registrando empresa e administrador...`);
      const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeEmpresa: empresa.nome,
          tipoSistema: empresa.tipo,
          cnpj: empresa.cnpj,
          nomeAdmin: empresa.admin.nome,
          email: empresa.admin.email,
          senha: empresa.admin.senha,
          cpf: empresa.admin.cpf,
          contato: empresa.admin.contato
        })
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(`Falha no registro: ${registerRes.status} - ${JSON.stringify(errorData)}`);
      }

      const registerData = await registerRes.json();
      console.log(`   ✅ Empresa criada: ${empresa.nome}`);
      console.log(`   ✅ Admin criado: ${empresa.admin.nome}\n`);

      results.empresas.push({
        nome: empresa.nome,
        tipo: empresa.tipo,
        admin: empresa.admin.email
      });

      // 2. Fazer login para obter token
      console.log(`2️⃣ Autenticando como admin...`);
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: empresa.admin.email,
          senha: empresa.admin.senha
        })
      });

      if (!loginRes.ok) {
        throw new Error(`Falha no login: ${loginRes.status}`);
      }

      const loginData = await loginRes.json();
      const token = loginData.token;
      const empresaId = loginData.usuario?.empresaId;
      console.log(`   ✅ Autenticado com sucesso\n`);

      // 3. Criar funcionários
      console.log(`3️⃣ Criando funcionários...`);
      for (const func of empresa.funcionarios) {
        const userRes = await fetch(`${BASE_URL}/api/usuarios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            nome: func.nome,
            email: func.email,
            senha: 'Senha@123',
            cpf: func.cpf,
            funcao: func.funcao,
            empresaId: empresaId
          })
        });

        if (userRes.ok) {
          console.log(`   ✅ Funcionário criado: ${func.nome} (${func.funcao})`);
          results.usuarios.push({ nome: func.nome, funcao: func.funcao, empresa: empresa.nome });
        } else {
          console.log(`   ⚠️ Erro ao criar ${func.nome}: ${userRes.status}`);
        }
      }
      console.log();

      // 4. Criar residentes/pacientes/pets
      console.log(`4️⃣ Criando ${empresa.tipo === 'petshop' ? 'pets' : 'residentes/pacientes'}...`);
      for (const residente of empresa.residentes) {
        const endpoint = empresa.tipo === 'petshop' ? '/api/petshop/pets' : '/api/pacientes';
        
        const body = empresa.tipo === 'petshop' 
          ? {
              nome: residente.nome,
              tipo: residente.tipo,
              raca: residente.raca,
              tutorNome: residente.tutor,
              tutorCpf: residente.cpf,
              tutorContato: residente.contato,
              empresaId: empresaId
            }
          : {
              nome: residente.nome,
              cpf: residente.cpf,
              dataNascimento: residente.dataNascimento,
              contato: residente.contato,
              empresaId: empresaId
            };

        const pacRes = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });

        if (pacRes.ok) {
          console.log(`   ✅ ${empresa.tipo === 'petshop' ? 'Pet' : 'Residente'} criado: ${residente.nome}`);
          results.residentes.push({ nome: residente.nome, empresa: empresa.nome });
        } else {
          console.log(`   ⚠️ Erro ao criar ${residente.nome}: ${pacRes.status}`);
        }
      }
      console.log();

    } catch (error) {
      console.error(`❌ Erro em ${empresa.nome}:`, error.message);
    }
  }

  // Sumário final
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✨ SEED CONCLUÍDO!`);
  console.log(`${'='.repeat(60)}\n`);
  
  console.log(`📊 Resumo:`);
  console.log(`   Empresas criadas: ${results.empresas.length}`);
  console.log(`   Usuários criados: ${results.usuarios.length + results.empresas.length}`);
  console.log(`   Residentes/Pets criados: ${results.residentes.length}\n`);

  console.log(`🔑 Credenciais de Acesso:\n`);
  empresas.forEach(emp => {
    console.log(`   ${emp.nome}:`);
    console.log(`      Email: ${emp.admin.email}`);
    console.log(`      Senha: ${emp.admin.senha}\n`);
  });

  console.log(`🌐 Acesse: https://prescrimed.up.railway.app\n`);
}

seedData().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
