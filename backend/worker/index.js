const { Worker } = require('bullmq');
const { generateExportFile } = require('../services/exportService');
const fs = require('fs');
const path = require('path');
const { default: Redis } = require('ioredis');

const redis = new Redis({ host: 'redis', port: 6379 });

const exportWorker = new Worker('exportQueue', async job => {
  const { format } = job.data;
  const file = await generateExportFile(format);

  const filePath = path.join(__dirname, `../../output/report-${Date.now()}.${format}`);
  fs.writeFileSync(filePath, file);
  return { filePath };
}, {
  connection: redis
});

console.log('Export worker running...');
