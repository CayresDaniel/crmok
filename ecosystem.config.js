module.exports = {
  apps: [
    {
      name: 'coven-backend',
      script: './coven/dist/src/main.js',
      cwd: '/home/coven-beauty',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3009
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true,
      // Restart automaticamente quando o processo falha
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      // Configurações de restart exponencial
      restart_delay: 1000,
      // Kill timeout
      kill_timeout: 3000,
      // Monitoramento de saúde
      health_check_grace_period: 3000,
      health_check_url: 'http://localhost:3009/api/health',
      health_check_interval: 30000
    },
    {
      name: 'coven-frontend',
      script: 'npm',
      args: 'run preview',
      cwd: '/home/coven-beauty/covenos-frontend',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3010
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s',
      restart_delay: 2000
    },
    {
      name: 'venom-bot',
      script: './whatsapp-venom/server.js',
      cwd: '/home/coven-beauty',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: './logs/venom-error.log',
      out_file: './logs/venom-out.log',
      log_file: './logs/venom-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 5,
      min_uptime: '15s',
      restart_delay: 3000,
      // WhatsApp pode demorar mais para inicializar
      kill_timeout: 10000
    }
  ]
}