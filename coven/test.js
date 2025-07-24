// Script de teste simples para verificar se o servidor inicia
const { exec } = require('child_process');

console.log('🦇 Iniciando teste do CovenSO Backend...');

const child = exec('pnpm run start:dev', { cwd: __dirname });

child.stdout.on('data', (data) => {
  console.log(data);
  if (data.includes('CovenSO Backend rodando na porta')) {
    console.log('✅ Servidor iniciado com sucesso!');
    setTimeout(() => {
      child.kill();
      console.log('🔥 Teste concluído. Backend está funcionando!');
      process.exit(0);
    }, 3000);
  }
});

child.stderr.on('data', (data) => {
  console.error('Erro:', data);
});

child.on('error', (error) => {
  console.error('Erro ao executar:', error);
  process.exit(1);
});

// Timeout de segurança
setTimeout(() => {
  console.log('⚠️ Timeout - Forçando parada do teste');
  child.kill();
  process.exit(1);
}, 30000);