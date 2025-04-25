const express = require('express');
const cors = require('cors');
const { exportQueue } = require('../worker/queue');
const { loadMockData } = require('./mock/data');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Mock para inicializar Redis (opcional)
loadMockData();

// Endpoints de exportación
app.post('/export/:format', async (req, res) => {
  const { format } = req.params;
  if (!['pdf', 'xlsx', 'csv'].includes(format)) {
    return res.status(400).json({ error: 'Formato no soportado' });
  }

  const job = await exportQueue.add('export', { format });
  res.json({ jobId: job.id });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
