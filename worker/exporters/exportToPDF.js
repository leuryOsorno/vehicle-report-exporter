const fs = require('fs');
const path = require('path');
const PdfPrinter = require('pdfmake');

// Registrar fuentes
const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  }
};

async function exportToPDF(data) {
  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [],
    defaultStyle: { font: 'Helvetica' },
    styles: {
      header: { fontSize: 16, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
      subheader: { fontSize: 12, margin: [0, 0, 0, 5] },
      tableHeader: { bold: true, fillColor: '#eeeeee' },
    }
  };

  // 👉 1. Título principal
  if (data.metadata?.title) {
    docDefinition.content.push({ text: data.metadata.title, style: 'header' });
  }

  // 👉 2. Fechas de metadata
  if (data.metadata?.dateRange?.from && data.metadata?.dateRange?.to) {
    docDefinition.content.push({ text: `Rango de fechas: ${data.metadata.dateRange.from} a ${data.metadata.dateRange.to}`, style: 'subheader' });
  }
  if (data.metadata?.generatedAt) {
    docDefinition.content.push({ text: `Generado en: ${data.metadata.generatedAt}`, style: 'subheader' });
  }

  docDefinition.content.push({ text: '', margin: [0, 10] }); // Espacio adicional

  // 👉 3. Ahora procesamos el resto de la data
  for (const [key, value] of Object.entries(data)) {
    if (key === 'metadata') continue;

    docDefinition.content.push({ text: capitalize(key), style: 'subheader' });
    await renderData(docDefinition.content, value);
  }

  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  const outputDir = path.join(__dirname, '../../output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `report-${Date.now()}.pdf`);
  const writeStream = fs.createWriteStream(outputPath);

  pdfDoc.pipe(writeStream);
  pdfDoc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', reject);
  });
}

// 🎯 Función auxiliar para renderizar los datos
async function renderData(content, data) {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      content.push({ text: 'Sin datos disponibles.', margin: [0, 5] });
      return;
    }
    if (typeof data[0] === 'object') {
      const headers = Object.keys(data[0]);
      const body = [
        headers.map(h => ({ text: capitalize(h), style: 'tableHeader' })),
        ...data.map(row => headers.map(h => String(row[h] ?? '')))
      ];

      content.push({
        table: {
          headerRows: 1,
          widths: Array(headers.length).fill('*'),
          body,
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5, 0, 15],
      });
    } else {
      data.forEach(item => {
        content.push({ text: `- ${item}`, margin: [0, 2] });
      });
    }
  } else if (typeof data === 'object') {
    // 🔥 Verticalizar objeto
    const headers = ['Campo', 'Valor'];
    const body = [
      headers.map(h => ({ text: h, style: 'tableHeader' })),
      ...Object.entries(data).map(([key, value]) => [
        capitalize(key),
        typeof value === 'object' ? JSON.stringify(value) : String(value)
      ]),
    ];

    content.push({
      table: {
        headerRows: 1,
        widths: ['40%', '*'],
        body,
      },
      layout: 'lightHorizontalLines',
      margin: [0, 5, 0, 15],
    });
  } else {
    content.push({ text: String(data), margin: [0, 2] });
  }
}


function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

module.exports = { exportToPDF };
