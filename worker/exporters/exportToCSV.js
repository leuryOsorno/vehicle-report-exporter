const fs = require('fs');
const path = require('path');

/**
 * Exporta cualquier tipo de informe a CSV de manera agnóstica
 * @param {Object} data
 * @param {string} filename
 * @returns {string}
 */
async function exportToCSV(data, filename) {
  const outputDir = path.resolve(__dirname, '../../output');
  const fullPath = path.join(outputDir, filename);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const csvData = generateCSVContent(data);
  fs.writeFileSync(fullPath, csvData, 'utf8');

  return fullPath;
}

/**
 * Genera el contenido CSV de manera dinámica
 * @param {Object} data
 * @returns {string}
 */
function generateCSVContent(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Datos inválidos para exportar');
  }

  const sections = [];

  for (const [key, value] of Object.entries(data)) {
    if (!value) continue;

    sections.push(`[${key}]`);

    if (Array.isArray(value)) {
      if (value.length > 0) {
        sections.push(generateSectionFromArray(value));
      } else {
        sections.push('No data');
      }
    } else if (typeof value === 'object') {
      sections.push(generateSectionFromObject(value));
    } else {
      sections.push('Unsupported data type');
    }

    sections.push(''); // espacio entre secciones
  }

  return sections.join('\n');
}

/**
 * Convierte un objeto simple en formato CSV
 * @param {Object} obj
 * @returns {string}
 */
function generateSectionFromObject(obj) {
  const headers = Object.keys(obj);
  const values = headers.map(key => sanitizeValue(obj[key]));
  return [headers.join(','), values.join(',')].join('\n');
}

/**
 * Convierte un array de objetos en formato CSV
 * @param {Array} arr
 * @returns {string}
 */
function generateSectionFromArray(arr) {
  const allKeys = Array.from(
    new Set(arr.flatMap(item => Object.keys(item)))
  );

  const rows = arr.map(item =>
    allKeys.map(key => sanitizeValue(item[key])).join(',')
  );

  return [allKeys.join(','), ...rows].join('\n');
}

/**
 * Limpia valores peligrosos para CSV
 * @param {any} value
 * @returns {string}
 */
function sanitizeValue(value) {
  if (value == null) return '';
  let str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

module.exports = { exportToCSV };
