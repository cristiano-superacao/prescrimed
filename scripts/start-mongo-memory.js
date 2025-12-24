import { MongoMemoryServer } from 'mongodb-memory-server';

async function startMongoMemory() {
  console.log('🔧 Iniciando MongoDB em memória...');
  
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'prescrimed'
    }
  });

  const uri = mongod.getUri();
  console.log('✅ MongoDB em memória iniciado!');
  console.log('📍 URI:', uri);
  console.log('');
  console.log('💡 Para parar, pressione Ctrl+C');
  console.log('');
  
  // Manter o processo rodando
  process.on('SIGINT', async () => {
    console.log('\n🛑 Parando MongoDB em memória...');
    await mongod.stop();
    console.log('✅ MongoDB parado com sucesso!');
    process.exit(0);
  });

  // Manter o processo vivo
  await new Promise(() => {});
}

startMongoMemory().catch(console.error);
