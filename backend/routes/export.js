const express = require('express');
const router = express.Router();
const { generateExportFile } = require('../services/exportService');

router.get('/:format', async (req, res) => {
  const { format } = req.params;
  const file = await generateExportFile(format);
  res.setHeader('Content-Disposition', `attachment; filename=report.${format}`);
  res.send(file);
});

module.exports = router;
