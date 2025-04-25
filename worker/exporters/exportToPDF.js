const fs = require('fs');
const PDFDocument = require('pdfkit');

async function exportToPDF(data, filePath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(16).text(data.metadata.title, { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Rango de fechas: ${data.metadata.dateRange.from} a ${data.metadata.dateRange.to}`);
  doc.text(`Generado en: ${data.metadata.generatedAt}`);
  doc.moveDown();

  doc.text(`Total de viajes: ${data.summary.totalTrips}`);
  doc.text(`Distancia total: ${data.summary.totalDistance} km`);
  doc.text(`Duración total: ${data.summary.totalDuration} min`);
  doc.text(`Velocidad promedio: ${data.summary.averageSpeed} km/h`);
  doc.moveDown();

  doc.fontSize(14).text('Lista de Viajes:');
  data.trips.forEach((trip, i) => {
    doc.fontSize(10).text(
      `#${i + 1}: ${trip.vehicleName} (${trip.startLocation} ➡️ ${trip.endLocation}) - ${trip.distance} km`
    );
  });

  doc.end();
}

module.exports = { exportToPDF };
