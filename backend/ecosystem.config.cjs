module.exports = {
  apps: [
    {
      name: "news-api",
      script: "index.js",
      instances: "max", // Runs on all available CPU cores on AWS EC2
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "800M",
      env: {
        NODE_ENV: "production",
        PORT: 5001,
      },
    },
  ],
};
