const fs = require('fs');
const path = require('path');

async function generateExportFile(format) {
  const mockFilePath = path.join(__dirname, `../mock/report.${format}`);
  return fs.readFileSync(mockFilePath);
}

module.exports = { generateExportFile };
