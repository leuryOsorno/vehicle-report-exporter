const express = require('express');
const cors = require('cors');
const path = require('path');
const { exportQueue } = require('./queue');
const { loadMockData } = require('./mock/data');

const app = express();
const PORT = 3030;
app.use('/files', express.static(path.join(__dirname, '/output')));
app.use(cors());
app.use(express.json());


// Mock para inicializar Redis (opcional)
loadMockData();

app.get('/report/data', async (req, res) => {
  try {
    const raw = await redis.get('report:data');
    const data = JSON.parse(raw);
    res.json(data);
  } catch (err) {
    console.error('Error al obtener datos de Redis:', err);
    res.status(500).json({ error: 'No se pudieron obtener los datos del reporte' });
  }
});


// Endpoints de exportación
app.get('/export/:format', async (req, res) => {
  const { format } = req.params;
  if (!['pdf', 'xlsx', 'csv'].includes(format)) {
    return res.status(400).json({ error: 'Formato no soportado' });
  }

  const job = await exportQueue.add('export', { format });
  res.json({ jobId: job.id });
});

// Validador del estado
app.get('/export/status/:jobId', async (req, res) => {
  const job = await exportQueue.getJob(req.params.jobId);
  const state = await job?.getState();

  if (state === 'completed') {
    const result = await job.returnvalue;
    const fileName = result.filePath.split('/').pop(); // extrae nombre del archivo
    const url = `${req.protocol}://${req.get('host')}/files/${fileName}`;
    res.json({ status: 'done', url:(url)?url:'Nada', download: fileName});
  } else if (state === 'failed') {
    res.json({ status: 'failed', reason: job.failedReason, jId: req.params.jobId });
  } else {
    res.json({ status: state, jId: req.params.jobId });
  }
});


app.get('/files/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '../output', fileName);

  res.download(filePath, fileName, err => {
    if (err) {
      console.error('❌ Error al descargar el archivo:', err);
      res.status(500).send('Error al descargar el archivo');
    }
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
