const Redis = require('ioredis');
const { exportToPDF } = require('../../worker/exporters/exportToPDF');
const { exportToXLSX } = require('../../worker/exporters/exportToXLSX');
const { exportToCSV } = require('../../worker/exporters/exportToCSV');

const redis = new Redis({ host: 'redis', port: 6379 });

async function generateExportFile(format) {
  const raw = await redis.get('report:data');
  const data = JSON.parse(raw);

  if (format === 'pdf') {
    return await exportToPDF(data);
  }
  if (format === 'xlsx') {
    return await exportToXLSX(data);
  }
  if (format === 'csv') {
    return await exportToCSV(data);
  }

  throw new Error(`Formato no soportado: ${format}`);
}

module.exports = { generateExportFile };
