const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

// Rutas públicas (sin autenticación)
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rutas protegidas (requieren autenticación)
router.get('/me', authMiddleware, userController.getMe);
router.get('/', authMiddleware, userController.getAll);
router.get('/:id', authMiddleware, userController.getById);
router.put('/:id', authMiddleware, userController.update);
router.put('/password/:id', authMiddleware, userController.updatePassword);
router.delete('/:id', authMiddleware, userController.deactivate);
router.delete('/:id/permanent', authMiddleware, userController.delete);

module.exports = router;
