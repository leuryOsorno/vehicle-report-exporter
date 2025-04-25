const fs = require('fs');
const { parse } = require('json2csv');

async function exportToCSV(data, filePath) {
  const fields = ['vehicleName', 'driver', 'startLocation', 'endLocation', 'distance', 'averageSpeed', 'duration'];
  const csv = parse(data.trips, { fields });

  fs.writeFileSync(filePath, csv);
}

module.exports = { exportToCSV };
