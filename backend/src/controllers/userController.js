const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const userController = {
  // POST /api/auth/register - Registrar nuevo usuario
  register: async (req, res) => {
    try {
      const { first_name, last_name, phone, email, password } = req.body;

      // Validaciones básicas
      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Faltan campos obligatorios: first_name, last_name, email, password'
        });
      }

      // Verificar si el email ya existe
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }

      // Crear usuario
      const newUser = await userModel.create({
        first_name,
        last_name,
        phone,
        email,
        password
      });

      // Generar token
      const token = jwt.sign(
        { 
          id: newUser.id, 
          email: newUser.email
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: newUser,
          token
        }
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar usuario',
        error: error.message
      });
    }
  },

  // POST /api/auth/login - Iniciar sesión
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validaciones
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son obligatorios'
        });
      }

      // Buscar usuario
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Verificar si el usuario está activo
      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Usuario desactivado'
        });
      }

      // Verificar contraseña
      const isPasswordValid = await userModel.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Generar token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Remover password de la respuesta
      const { password: userPassword, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({
        success: false,
        message: 'Error al iniciar sesión',
        error: error.message
      });
    }
  },

  // GET /api/auth/me - Obtener usuario actual
  getMe: async (req, res) => {
    try {
      const user = await userModel.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuario',
        error: error.message
      });
    }
  },

  // GET /api/users - Obtener todos los usuarios (solo admin)
  getAll: async (req, res) => {
    try {
      const users = await userModel.getAll();
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios',
        error: error.message
      });
    }
  },

  // GET /api/users/:id - Obtener usuario por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuario',
        error: error.message
      });
    }
  },

  // PUT /api/users/:id - Actualizar usuario
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const userData = req.body;

      // Verificar si el usuario existe
      const existingUser = await userModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Si se intenta cambiar el email, verificar que no exista
      if (userData.email && userData.email !== existingUser.email) {
        const emailExists = await userModel.findByEmail(userData.email);
        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: 'El email ya está en uso'
          });
        }
      }

      const updatedUser = await userModel.update(id, userData);

      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: updatedUser
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar usuario',
        error: error.message
      });
    }
  },

  // PUT /api/users/:id/password - Cambiar contraseña
  updatePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      // Validaciones
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Contraseña actual y nueva son obligatorias'
        });
      }

      // Obtener usuario con contraseña
      const user = await userModel.findByEmail(req.user.email);
      
      // Verificar contraseña actual
      const isPasswordValid = await userModel.verifyPassword(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Contraseña actual incorrecta'
        });
      }

      await userModel.updatePassword(id, newPassword);

      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cambiar contraseña',
        error: error.message
      });
    }
  },

  // DELETE /api/users/:id - Desactivar usuario
  deactivate: async (req, res) => {
    try {
      const { id } = req.params;
      const deactivatedUser = await userModel.deactivate(id);

      if (!deactivatedUser) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Usuario desactivado exitosamente',
        data: deactivatedUser
      });
    } catch (error) {
      console.error('Error al desactivar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al desactivar usuario',
        error: error.message
      });
    }
  },

  // DELETE /api/users/:id/permanent - Eliminar usuario permanentemente
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await userModel.delete(id);

      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Usuario eliminado permanentemente',
        data: deletedUser
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar usuario',
        error: error.message
      });
    }
  }
};

module.exports = userController;
