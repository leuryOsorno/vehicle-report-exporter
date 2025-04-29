const { Worker } = require('bullmq');
const { generateExportFile } = require('./services/exportService');
const fs = require('fs');
const path = require('path');
const { default: Redis } = require('ioredis');

const redis = new Redis({ host: 'redis', port: 6379, maxRetriesPerRequest: null });


const exportWorker = new Worker('exportQueue', async job => {
  const { format } = job.data;

  try {
    const filePath = await generateExportFile(format);
    const relativePath = '/files/' + path.basename(filePath);
    return { filePath: relativePath };


  } catch (err) {
    console.error(`❌ Error processing job ${job.id}:`, err);
    throw err; // Esto permitirá que BullMQ lo marque como "failed" y lo devuelva por `/status/:jobId`
  }
}, {
  connection: redis
});


console.log('Export worker running...');
