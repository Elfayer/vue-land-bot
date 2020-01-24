module.exports = {
  apps: [
    {
      name: 'vuebot',
      script: 'npm run start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 5000,
      max_memory_restart: '200M',
      min_uptime: 1500,
      ignore_watch: [
        '.git',
        '.github',
        'assets',
        'data/providers/json',
        'logs',
        'node_modules',
        'src',
        'typings',
      ],
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: 'logs/vuebot-err.log',
      out_file: 'logs/vuebot-out.log',
    },
  ],
}
