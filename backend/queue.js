const { Queue } = require('bullmq');

const connection = {
  host: 'redis', // Este hostname es válido dentro del Docker Compose
  port: 6379
};

const exportQueue = new Queue('exportQueue', { connection });

module.exports = { exportQueue };
