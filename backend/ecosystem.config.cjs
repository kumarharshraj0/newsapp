module.exports = {
  apps: [
    {
      name: "news-backend-api",
      script: "./index.js",
      instances: "max", // Uses all available CPU cores
      exec_mode: "cluster", // Enables PM2 cluster mode
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      watch: false,
      max_memory_restart: "1G", // Auto-restart if a worker takes more than 1GB RAM
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
