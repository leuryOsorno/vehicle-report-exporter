const express = require('express');
const app = express();
const exportRouter = require('./routes/export');
app.use('/export', exportRouter);
app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
