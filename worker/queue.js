const { Queue } = require('bullmq');
const { default: Redis } = require('ioredis');

const redis = new Redis({ host: 'redis', port: 6379 });
const exportQueue = new Queue('exportQueue', { connection: redis });

module.exports = { exportQueue };
