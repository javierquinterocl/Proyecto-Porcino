const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const sowRoutes = require('./routes/sowRoutes');
const boarRoutes = require('./routes/boarRoutes');
const heatRoutes = require('./routes/heatRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Aumentar límite para imágenes base64
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Log de peticiones en desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: '🐷 API de Porcicultura - Porcime',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      users: {
        list: 'GET /api/users (admin)',
        get: 'GET /api/users/:id',
        update: 'PUT /api/users/:id (admin)',
        delete: 'DELETE /api/users/:id (admin)'
      },
      sows: {
        list: 'GET /api/sows',
        stats: 'GET /api/sows/stats',
        get: 'GET /api/sows/:id',
        getByEarTag: 'GET /api/sows/ear-tag/:ear_tag',
        create: 'POST /api/sows',
        update: 'PUT /api/sows/:id',
        partialUpdate: 'PATCH /api/sows/:id',
        softDelete: 'DELETE /api/sows/:id',
        delete: 'DELETE /api/sows/:id/permanent (admin)'
      },
      boars: {
        list: 'GET /api/boars',
        stats: 'GET /api/boars/stats',
        get: 'GET /api/boars/:id',
        getByEarTag: 'GET /api/boars/ear-tag/:ear_tag',
        create: 'POST /api/boars',
        update: 'PUT /api/boars/:id',
        partialUpdate: 'PATCH /api/boars/:id',
        softDelete: 'DELETE /api/boars/:id',
        delete: 'DELETE /api/boars/:id/permanent (admin)'
      },
      heats: {
        list: 'GET /api/heats',
        stats: 'GET /api/heats/stats',
        pending: 'GET /api/heats/pending',
        get: 'GET /api/heats/:id',
        getBySow: 'GET /api/heats/sow/:sowId',
        getLastBySow: 'GET /api/heats/sow/:sowId/last',
        create: 'POST /api/heats',
        update: 'PUT /api/heats/:id',
        partialUpdate: 'PATCH /api/heats/:id',
        updateStatus: 'PATCH /api/heats/:id/status',
        delete: 'DELETE /api/heats/:id'
      }
    }
  });
});

// Rutas
app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sows', sowRoutes);
app.use('/api/boars', boarRoutes);
app.use('/api/heats', heatRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Documentación en http://localhost:${PORT}`);
});

module.exports = app;
