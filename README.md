# Vehicle Report Exporter

Exporta datos de viajes en PDF, XLSX y CSV desde Redis.


vehicle-report-exporter/
├── backend/              ← Aquí va el backend Express (API REST)
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── ...
├── worker/               ← Aquí vive el worker de BullMQ
│   ├── index.js
│   └── queue.js
├── frontend/             ← Aquí va tu app React
├── docker-compose.yml
└── README.md
