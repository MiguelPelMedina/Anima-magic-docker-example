const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// --- Middlewares globales ---
app.use(helmet()); // cabeceras HTTP de seguridad
//app.use(cors()); // permite peticiones cross-origin (ajustar origen en producción)
app.use(compression()); // comprime las respuestas (gzip)
app.use(express.json()); // parsea el body JSON de las peticiones

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')); // logging de peticiones solo en desarrollo
}

// --- Rutas ---
app.use('/api', routes);

// Ruta de salud, útil para comprobar que el contenedor responde
// (y más adelante, para un healthcheck de Docker)
app.get('/health', (req, res) => {
  res.status(200).json({ estado: 'ok' });
});

// --- Middlewares de error (siempre al final) ---
//app.use(notFound);
//app.use(errorHandler);

module.exports = app;