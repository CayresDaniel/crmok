const mysql = require('mysql2/promise');

async function clearDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'evolution'
  });

  try {
    console.log('🔄 Limpando banco de dados...');
    
    // Desabilitar verificação de chaves estrangeiras
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    
    // Limpar todas as tabelas
    const tables = [
      'messages', 'contacts', 'chats', 'webhook', 'websocket', 
      'sqs', 'nats', 'rabbitmq', 'proxy', 'chatwoot', 'settings', 'instances'
    ];
    
    for (const table of tables) {
      try {
        await connection.execute(`DELETE FROM \`${table}\``);
        console.log(`✅ Tabela ${table} limpa`);
      } catch (error) {
        console.log(`⚠️ Tabela ${table} não existe ou erro:`, error.message);
      }
    }
    
    // Reabilitar verificação de chaves estrangeiras
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('🎉 Banco limpo com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error);
  } finally {
    await connection.end();
  }
}

clearDatabase();