import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Empresa from '../models/Empresa.js';
import Usuario from '../models/Usuario.js';
import Paciente from '../models/Paciente.js';

dotenv.config();

async function verificarDados() {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URL ||
      process.env.MONGODB_URL ||
      process.env.DATABASE_URL;

    if (!mongoUri) {
      console.error('❌ MONGODB_URI não está configurada.');
      console.error('\nConfigure com:');
      console.error('  PowerShell: $env:MONGODB_URI="sua-uri"');
      console.error('  Bash: export MONGODB_URI="sua-uri"');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB\n');

    // Listar todas as empresas
    const empresas = await Empresa.find({}).sort({ createdAt: 1 });
    
    if (empresas.length === 0) {
      console.log('⚠️  Nenhuma empresa encontrada no banco de dados.');
      console.log('\nExecute o seed para criar empresas de exemplo:');
      console.log('  npm run seed:cloud');
      return;
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  📊 EMPRESAS NO BANCO DE DADOS: ${empresas.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    for (const empresa of empresas) {
      console.log(`🏢 ${empresa.nome}`);
      console.log(`   ID: ${empresa._id}`);
      console.log(`   Tipo: ${empresa.tipoSistema || 'não definido'}`);
      console.log(`   Email: ${empresa.email}`);
      console.log(`   Telefone: ${empresa.telefone || 'não informado'}`);
      console.log(`   Status: ${empresa.status || 'ativo'}`);
      console.log(`   Plano: ${empresa.plano || 'basico'}`);
      
      if (empresa.endereco) {
        const end = empresa.endereco;
        const enderecoStr = [end.rua, end.cidade, end.uf].filter(Boolean).join(', ');
        console.log(`   Endereço: ${enderecoStr || 'não informado'}`);
      }

      // Contar usuários
      const usuarios = await Usuario.countByEmpresa(empresa._id);
      console.log(`   👥 Usuários: ${usuarios}`);

      // Contar pacientes
      const pacientes = await Paciente.countByEmpresa(empresa._id);
      console.log(`   🏥 Pacientes: ${pacientes}`);

      // Módulos ativos
      if (empresa.configuracoes?.modulosAtivos) {
        console.log(`   📦 Módulos: ${empresa.configuracoes.modulosAtivos.join(', ')}`);
      }

      console.log(`   📅 Criada em: ${empresa.createdAt?.toLocaleString('pt-BR') || 'não disponível'}`);
      console.log('');
    }

    // Resumo
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  📈 RESUMO GERAL');
    console.log('═══════════════════════════════════════════════════════════');
    
    const totalUsuarios = await Usuario.countDocuments({});
    const totalPacientes = await Paciente.countDocuments({});
    
    console.log(`  Total de Empresas: ${empresas.length}`);
    console.log(`  Total de Usuários: ${totalUsuarios}`);
    console.log(`  Total de Pacientes: ${totalPacientes}`);
    
    // Contar por tipo
    const tipoCount = {};
    empresas.forEach(e => {
      const tipo = e.tipoSistema || 'indefinido';
      tipoCount[tipo] = (tipoCount[tipo] || 0) + 1;
    });
    
    console.log('\n  Empresas por tipo:');
    Object.entries(tipoCount).forEach(([tipo, count]) => {
      console.log(`    - ${tipo}: ${count}`);
    });

    console.log('\n✅ Verificação concluída com sucesso!');

  } catch (err) {
    console.error('❌ Erro ao verificar dados:', err.message);
    if (err.name === 'MongooseError') {
      console.error('\nVerifique se a URI do MongoDB está correta.');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado do MongoDB');
    process.exit(0);
  }
}

verificarDados();
