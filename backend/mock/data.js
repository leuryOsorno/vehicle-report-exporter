const { default: Redis } = require('ioredis');

const mockData = {
  metadata: {
    title: 'Informe de Viajes',
    dateRange: { from: '2024-04-01', to: '2024-04-24' },
    generatedAt: new Date().toISOString(),
    vehicles: ['veh-1', 'veh-2', 'veh-3']
  },
  summary: {
    totalTrips: 47,
    totalDistance: 1250.7,
    totalDuration: 2340,
    averageSpeed: 32.1
  },
  trips: Array.from({ length: 30 }, (_, i) => ({
    id: `trip-${i + 1}`,
    vehicleId: `veh-${(i % 3) + 1}`,
    vehicleName: `Vehículo ${(i % 3) + 1}`,
    driver: `Conductor ${(i % 3) + 1}`,
    startTime: new Date(Date.now() - (i * 3600000)).toISOString(),
    endTime: new Date(Date.now() - (i * 3600000) + 5400000).toISOString(),
    duration: 90,
    distance: Math.round(15 + Math.random() * 50 * 10) / 10,
    averageSpeed: Math.round(25 + Math.random() * 40 * 10) / 10,
    maxSpeed: Math.round(60 + Math.random() * 60 * 10) / 10,
    startLocation: `Origen ${i + 1}`,
    endLocation: `Destino ${i + 1}`,
    fuelConsumption: Math.round(Math.random() * 15 * 10) / 10
  }))
};

// Detecta si estamos dentro de Docker (por la existencia del archivo especial)
const isDocker = () => {
  const fs = require('fs');
  try {
    return fs.existsSync('/.dockerenv');
  } catch {
    return false;
  }
};

async function loadMockData() {
  const redisHost = isDocker() ? 'redis' : 'localhost';
  const redis = new Redis({ host: redisHost, port: 6379 });

  await redis.set('report:data', JSON.stringify(mockData));
  console.log(`✅ Datos de prueba cargados en Redis (${redisHost})`);

  await redis.disconnect();
}

module.exports = { loadMockData };
