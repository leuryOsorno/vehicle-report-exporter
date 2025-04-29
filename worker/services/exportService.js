const Redis = require('ioredis');
const { exportToPDF } = require('../exporters/exportToPDF');
const { exportToXLSX } = require('../exporters/exportToXLSX');
const { exportToCSV } = require('../exporters/exportToCSV');

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
    const filename = `report-${Date.now()}.csv`;
    return await exportToCSV(data,filename);
  }

  throw new Error(`Formato no soportado: ${format}`);
}

module.exports = { generateExportFile };
