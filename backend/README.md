# Backend module

Este proyecto proporciona un sistema backend para generar y exportar informes vehiculares en formatos PDF, XLSX y CSV. Usa Express, BullMQ, y Redis para manejar exportaciones en segundo plano.

## Estructura del Proyecto
vehicle-report-exporter/ ├── backend/ │ ├── routes/ │ │ └── export.js # Endpoint para iniciar exportaciones │ ├── services/ │ │ └── exportService.js # Generadores de PDF/XLSX/CSV │ ├── worker/ │ │ ├── index.js # Worker BullMQ que procesa exportaciones │ │ └── queue.js # Definición de la cola │ ├── mock/ │ │ └── data.js # Datos simulados desde Redis │ └── server.js # Servidor Express ├── output/ # Archivos exportados └── docker-compose.yml # Redis 8.0 en contenedor