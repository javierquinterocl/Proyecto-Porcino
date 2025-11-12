import axios from 'axios';

// Configuración base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado - limpiar todo y redirigir
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Solo redirigir si no estamos ya en login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================

/**
 * Registrar un nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @param {string} userData.firstName o userData.first_name - Nombre
 * @param {string} userData.lastName o userData.last_name - Apellido
 * @param {string} userData.email - Email
 * @param {string} userData.password - Contraseña
 * @param {string} [userData.phone] - Teléfono (opcional)
 * @returns {Promise<Object>} Respuesta con user y token
 */
export const register = async (userData) => {
  // Transformar nombres de campos del frontend al backend
  const backendData = {
    first_name: userData.firstName || userData.first_name,
    last_name: userData.lastName || userData.last_name,
    email: userData.email,
    password: userData.password,
    phone: userData.phone || ''
  };
  
  const response = await api.post('/auth/register', backendData);
  
  // NO guardar token - el usuario debe hacer login después de registrarse
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  
  return response.data;
};

/**
 * Iniciar sesión
 * @param {Object} credentials - Credenciales de acceso
 * @param {string} credentials.email - Email
 * @param {string} credentials.password - Contraseña
 * @returns {Promise<Object>} Respuesta con user y token
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  
  // Guardar token y usuario en localStorage
  if (response.data.success && response.data.data) {
    const { token, user } = response.data.data;
    saveAuthData(token, user);
    return { user, token };
  }
  
  return response.data;
};

/**
 * Obtener información del usuario autenticado
 * @returns {Promise<Object>} Datos del usuario
 */
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Obtener todos los usuarios (solo admin)
 * @returns {Promise<Array>} Lista de usuarios
 */
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data.data || [];
};

/**
 * Obtener usuario por ID
 * @param {string|number} id - ID del usuario
 * @returns {Promise<Object>} Datos del usuario
 */
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data.data;
};

/**
 * Actualizar usuario
 * @param {string|number} id - ID del usuario
 * @param {Object} userData - Datos a actualizar
 * @returns {Promise<Object>} Usuario actualizado
 */
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data.data;
};

/**
 * Cambiar contraseña
 * @param {string|number} id - ID del usuario
 * @param {Object} passwords - Contraseñas actual y nueva
 * @returns {Promise<Object>} Respuesta
 */
export const updatePassword = async (id, passwords) => {
  const response = await api.put(`/users/password/${id}`, passwords);
  return response.data;
};

/**
 * Desactivar usuario
 * @param {string|number} id - ID del usuario
 * @returns {Promise<Object>} Usuario desactivado
 */
export const deactivateUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data.data;
};

/**
 * Eliminar usuario permanentemente
 * @param {string|number} id - ID del usuario
 * @returns {Promise<Object>} Usuario eliminado
 */
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}/permanent`);
  return response.data.data;
};

/**
 * Cerrar sesión (limpiar datos locales)
 */
export const logout = () => {
  clearAuthData();
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Guardar token y datos de usuario en localStorage
 * @param {string} token - JWT token
 * @param {Object} user - Datos del usuario
 */
export const saveAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('authToken', token); // Para compatibilidad con AuthContext
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Limpiar datos de autenticación
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('authToken'); // Para compatibilidad con AuthContext
  localStorage.removeItem('user');
};

/**
 * Obtener token del localStorage
 * @returns {string|null} Token JWT
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Obtener usuario del localStorage
 * @returns {Object|null} Datos del usuario
 */
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Verificar si el usuario está autenticado
 * @returns {boolean} True si hay token
 */
export const isAuthenticated = () => {
  return !!getToken();
};

// ==================== USER SERVICE (para compatibilidad) ====================

export const userService = {
  register,
  login,
  logout,
  getMe,
  getAllUsers,
  getUserById,
  updateUser,
  updatePassword,
  deactivateUser,
  deleteUser
};

// ==================== OTROS SERVICIOS (placeholders temporales) ====================
// Estos servicios se implementarán según se necesiten

export const pigService = {
  // Métodos relacionados con cerdos/cerdas
  getAllSows: async () => {
    const response = await api.get('/sows');
    return response.data.data || [];
  },
  
  getSowById: async (id) => {
    const response = await api.get(`/sows/${id}`);
    return response.data.data;
  },
  
  getSowByEarTag: async (earTag) => {
    const response = await api.get(`/sows/ear-tag/${earTag}`);
    return response.data.data;
  },
  
  createSow: async (sowData) => {
    const response = await api.post('/sows', sowData);
    return response.data;
  },
  
  updateSow: async (id, sowData) => {
    const response = await api.put(`/sows/${id}`, sowData);
    return response.data.data;
  },
  
  partialUpdateSow: async (id, sowData) => {
    const response = await api.patch(`/sows/${id}`, sowData);
    return response.data;
  },
  
  deleteSow: async (id) => {
    const response = await api.delete(`/sows/${id}`);
    return response.data;
  },
  
  getSowStats: async () => {
    const response = await api.get('/sows/stats');
    return response.data.data;
  },
  
  // Métodos relacionados con verracos
  getAllBoars: async () => {
    const response = await api.get('/boars');
    return response.data.data || [];
  },
  
  getBoarById: async (id) => {
    const response = await api.get(`/boars/${id}`);
    return response.data.data;
  },
  
  getBoarByEarTag: async (earTag) => {
    const response = await api.get(`/boars/ear-tag/${earTag}`);
    return response.data.data;
  },
  
  createBoar: async (boarData) => {
    const response = await api.post('/boars', boarData);
    return response.data;
  },
  
  updateBoar: async (id, boarData) => {
    const response = await api.put(`/boars/${id}`, boarData);
    return response.data.data;
  },
  
  partialUpdateBoar: async (id, boarData) => {
    const response = await api.patch(`/boars/${id}`, boarData);
    return response.data;
  },
  
  deleteBoar: async (id) => {
    const response = await api.delete(`/boars/${id}`);
    return response.data;
  },
  
  getBoarStats: async () => {
    const response = await api.get('/boars/stats');
    return response.data.data;
  },
  
  // Subir foto (funciona para cerdas y verracos)
  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await api.post('/sows/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    // Retornar solo la URL de la foto
    return response.data.data.photo_url;
  }
};

export const supplierService = {
  // Métodos relacionados con proveedores
};

export const productService = {
  // Métodos relacionados con productos
};

export const productOutputService = {
  // Métodos relacionados con salidas de productos
};

export const reproductiveDataService = {
  // Métodos relacionados con datos reproductivos
};

export default api;
