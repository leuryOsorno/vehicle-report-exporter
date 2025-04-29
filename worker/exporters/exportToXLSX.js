const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

async function exportToXLSX(data) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Reporte');

  // Metadata - título grande
  sheet.mergeCells('A1', 'C1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = data.metadata.title || 'Reporte';
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: 'center' };

  // Metadata - fechas
  sheet.addRow([]);
  sheet.addRow([`Rango de fechas: ${data.metadata.dateRange.from} a ${data.metadata.dateRange.to}`]);
  sheet.addRow([`Generado en: ${data.metadata.generatedAt}`]);
  sheet.addRow([]);

  await renderData(sheet, data);

  const outputDir = path.join(__dirname, '../../output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `report-${Date.now()}.xlsx`);
  await workbook.xlsx.writeFile(outputPath);

  return outputPath;
}

async function renderData(sheet, data) {
  // Ya hemos manejado metadata, quitamos esa parte
  const entries = Object.entries(data).filter(([key]) => key !== 'metadata');

  for (const [section, value] of entries) {
    sheet.addRow([]);
    const sectionHeader = sheet.addRow([capitalize(section)]);
    sectionHeader.font = { bold: true };
    sheet.addRow([]);

    if (Array.isArray(value)) {
      if (value.length === 0) {
        sheet.addRow(['Sin datos disponibles']);
        continue;
      }

      if (typeof value[0] === 'object') {
        // Array de objetos -> tabla horizontal
        const headers = Object.keys(value[0]);
        sheet.addRow(headers.map(capitalize));

        value.forEach(item => {
          sheet.addRow(headers.map(h => item[h] ?? ''));
        });
      } else {
        // Array de strings -> lista
        value.forEach(item => {
          sheet.addRow([item]);
        });
      }
    } else if (typeof value === 'object') {
      // 🔥 Objeto verticalizado
      sheet.addRow(['Campo', 'Valor']).font = { bold: true };
      Object.entries(value).forEach(([key, val]) => {
        sheet.addRow([capitalize(key), typeof val === 'object' ? JSON.stringify(val) : val]);
      });
    } else {
      // Valor primitivo
      sheet.addRow([String(value)]);
    }
  }
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { exportToXLSX };
