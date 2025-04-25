const ExcelJS = require('exceljs');
const fs = require('fs');

async function exportToXLSX(data, filePath) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Viajes');

  sheet.columns = [
    { header: 'Vehículo', key: 'vehicleName' },
    { header: 'Conductor', key: 'driver' },
    { header: 'Inicio', key: 'startLocation' },
    { header: 'Destino', key: 'endLocation' },
    { header: 'Distancia (km)', key: 'distance' },
    { header: 'Velocidad Prom. (km/h)', key: 'averageSpeed' },
    { header: 'Duración (min)', key: 'duration' }
  ];

  data.trips.forEach(trip => {
    sheet.addRow({
      vehicleName: trip.vehicleName,
      driver: trip.driver,
      startLocation: trip.startLocation,
      endLocation: trip.endLocation,
      distance: trip.distance,
      averageSpeed: trip.averageSpeed,
      duration: trip.duration
    });
  });

  await workbook.xlsx.writeFile(filePath);
}

module.exports = { exportToXLSX };
