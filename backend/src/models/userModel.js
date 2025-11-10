const pool = require('../config/db');
const bcrypt = require('bcrypt');

const userModel = {
  // Crear un nuevo usuario (registro)
  create: async (userData) => {
    const { first_name, last_name, phone, email, password } = userData;
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, phone, email, password, is_active) 
       VALUES ($1, $2, $3, $4, $5, true) 
       RETURNING id, first_name, last_name, phone, email, is_active, created_at`,
      [first_name, last_name, phone, email, hashedPassword]
    );
    
    return result.rows[0];
  },

  // Buscar usuario por email
  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  // Buscar usuario por ID
  findById: async (id) => {
    const result = await pool.query(
      `SELECT id, first_name, last_name, phone, email, is_active, created_at, updated_at 
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Obtener todos los usuarios
  getAll: async () => {
    const result = await pool.query(
      `SELECT id, first_name, last_name, phone, email, is_active, created_at, updated_at 
       FROM users 
       ORDER BY created_at DESC`
    );
    return result.rows;
  },

  // Actualizar usuario
  update: async (id, userData) => {
    const { first_name, last_name, phone, email, is_active } = userData;
    
    const result = await pool.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, phone = $3, email = $4, 
           is_active = $5, updated_at = NOW() 
       WHERE id = $6 
       RETURNING id, first_name, last_name, phone, email, is_active, created_at, updated_at`,
      [first_name, last_name, phone, email, is_active, id]
    );
    
    return result.rows[0];
  },

  // Cambiar contraseña
  updatePassword: async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const result = await pool.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
      [hashedPassword, id]
    );
    
    return result.rows[0];
  },

  // Eliminar usuario (soft delete - desactivar)
  deactivate: async (id) => {
    const result = await pool.query(
      `UPDATE users SET is_active = false, updated_at = NOW() 
       WHERE id = $1 
       RETURNING id, first_name, last_name, email, is_active`,
      [id]
    );
    return result.rows[0];
  },

  // Eliminar usuario permanentemente
  delete: async (id) => {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, email',
      [id]
    );
    return result.rows[0];
  },

  // Verificar contraseña
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

module.exports = userModel;
