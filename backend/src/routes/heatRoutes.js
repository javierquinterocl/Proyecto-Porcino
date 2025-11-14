const express = require('express');
const router = express.Router();
const heatController = require('../controllers/heatController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Todas las rutas de celos requieren autenticación
router.use(authMiddleware);

// Rutas públicas para usuarios autenticados
router.get('/', heatController.getAll);
router.get('/stats', heatController.getStats);
router.get('/pending', heatController.getPending);
router.get('/sow/:sowId', heatController.getBySowId);
router.get('/sow/:sowId/last', heatController.getLastBySowId);
router.get('/:id', heatController.getById);

// Rutas de creación y edición
router.post('/', heatController.create);
router.put('/:id', heatController.update);
router.patch('/:id', heatController.partialUpdate);
router.patch('/:id/status', heatController.updateStatus);

// Ruta de eliminación (solo para celos no servidos)
router.delete('/:id', heatController.delete);

module.exports = router;
