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

// ==================== SOW SERVICE ====================

export const sowService = {
  getAllSows: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const queryString = params.toString();
    const url = queryString ? `/sows?${queryString}` : '/sows';
    const response = await api.get(url);
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
  
  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await api.post('/sows/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data.photo_url;
  }
};

// ==================== BOAR SERVICE ====================

export const boarService = {
  getAllBoars: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const queryString = params.toString();
    const url = queryString ? `/boars?${queryString}` : '/boars';
    const response = await api.get(url);
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
  }
};

// ==================== PIG SERVICE (Legacy - mantener compatibilidad) ====================

export const pigService = {
  ...sowService,
  ...boarService
};

// ==================== HEAT SERVICE ====================

export const heatService = {
  // Obtener todos los celos
  getAllHeats: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const queryString = params.toString();
    const url = queryString ? `/heats?${queryString}` : '/heats';
    const response = await api.get(url);
    return response.data.data || [];
  },
  
  // Obtener celo por ID
  getHeatById: async (id) => {
    const response = await api.get(`/heats/${id}`);
    return response.data.data;
  },
  
  // Obtener celos de una cerda
  getHeatsBySowId: async (sowId) => {
    const response = await api.get(`/heats/sow/${sowId}`);
    return response.data.data || [];
  },
  
  // Obtener último celo de una cerda
  getLastHeatBySowId: async (sowId) => {
    const response = await api.get(`/heats/sow/${sowId}/last`);
    return response.data.data;
  },
  
  // Obtener celos pendientes de servicio
  getPendingHeats: async () => {
    const response = await api.get('/heats/pending');
    return response.data.data || [];
  },
  
  // Obtener estadísticas de celos
  getHeatStats: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const queryString = params.toString();
    const url = queryString ? `/heats/stats?${queryString}` : '/heats/stats';
    const response = await api.get(url);
    return response.data.data;
  },
  
  // Crear nuevo celo
  createHeat: async (heatData) => {
    const response = await api.post('/heats', heatData);
    return response.data;
  },
  
  // Actualizar celo completo
  updateHeat: async (id, heatData) => {
    const response = await api.put(`/heats/${id}`, heatData);
    return response.data.data;
  },
  
  // Actualizar campos específicos del celo
  partialUpdateHeat: async (id, heatData) => {
    const response = await api.patch(`/heats/${id}`, heatData);
    return response.data;
  },
  
  // Actualizar solo el estado del celo
  updateHeatStatus: async (id, status, notes = null) => {
    const response = await api.patch(`/heats/${id}/status`, { status, notes });
    return response.data;
  },
  
  // Eliminar celo
  deleteHeat: async (id) => {
    const response = await api.delete(`/heats/${id}`);
    return response.data;
  }
};

// ==================== SERVICE SERVICE ====================

export const serviceService = {
  // Obtener todos los servicios
  getAllServices: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const queryString = params.toString();
    const url = queryString ? `/services?${queryString}` : '/services';
    const response = await api.get(url);
    return response.data.data || [];
  },
  
  // Obtener un servicio por ID
  getServiceById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data.data;
  },
  
  // Obtener servicios de una cerda
  getServicesBySow: async (sowId) => {
    const response = await api.get(`/services/sow/${sowId}`);
    return response.data.data || [];
  },
  
  // Obtener servicios de un celo
  getServicesByHeat: async (heatId) => {
    const response = await api.get(`/services/heat/${heatId}`);
    return response.data.data || [];
  },
  
  // Obtener estadísticas de servicios
  getServiceStats: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const queryString = params.toString();
    const url = queryString ? `/services/stats?${queryString}` : '/services/stats';
    const response = await api.get(url);
    return response.data.data;
  },
  
  // Crear nuevo servicio
  createService: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },
  
  // Actualizar servicio
  updateService: async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data.data;
  },
  
  // Eliminar servicio
  deleteService: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  }
};

// ==================== PREGNANCY SERVICE ====================

export const pregnancyService = {
  // Obtener todas las gestaciones
  getAllPregnancies: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const queryString = params.toString();
    const url = queryString ? `/pregnancies?${queryString}` : '/pregnancies';
    const response = await api.get(url);
    return response.data.data || [];
  },
  
  // Obtener gestación por ID
  getPregnancyById: async (id) => {
    const response = await api.get(`/pregnancies/${id}`);
    return response.data.data;
  },
  
  // Obtener gestaciones de una cerda
  getPregnanciesBySowId: async (sowId) => {
    const response = await api.get(`/pregnancies/sow/${sowId}`);
    return response.data.data || [];
  },
  
  // Obtener gestación activa de una cerda
  getActivePregnancyBySowId: async (sowId) => {
    const response = await api.get(`/pregnancies/sow/${sowId}/active`);
    return response.data.data;
  },
  
  // Obtener gestaciones próximas a parto
  getUpcomingPregnancies: async (daysAhead = 7) => {
    const response = await api.get(`/pregnancies/upcoming?days=${daysAhead}`);
    return response.data.data || [];
  },
  
  // Obtener gestaciones vencidas
  getOverduePregnancies: async () => {
    const response = await api.get('/pregnancies/overdue');
    return response.data.data || [];
  },
  
  // Obtener gestaciones pendientes de confirmación
  getPendingConfirmation: async () => {
    const response = await api.get('/pregnancies/pending-confirmation');
    return response.data.data || [];
  },
  
  // Obtener estadísticas de gestaciones
  getPregnancyStats: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const queryString = params.toString();
    const url = queryString ? `/pregnancies/stats?${queryString}` : '/pregnancies/stats';
    const response = await api.get(url);
    return response.data.data;
  },
  
  // Crear nueva gestación
  createPregnancy: async (pregnancyData) => {
    const response = await api.post('/pregnancies', pregnancyData);
    return response.data;
  },
  
  // Actualizar gestación completa
  updatePregnancy: async (id, pregnancyData) => {
    const response = await api.put(`/pregnancies/${id}`, pregnancyData);
    return response.data.data;
  },
  
  // Actualizar campos específicos de la gestación
  partialUpdatePregnancy: async (id, pregnancyData) => {
    const response = await api.patch(`/pregnancies/${id}`, pregnancyData);
    return response.data;
  },
  
  // Actualizar solo el estado de la gestación
  updatePregnancyStatus: async (id, status, notes = null) => {
    const response = await api.patch(`/pregnancies/${id}/status`, { status, notes });
    return response.data;
  },
  
  // Confirmar gestación
  confirmPregnancy: async (id, confirmationData) => {
    const response = await api.patch(`/pregnancies/${id}/confirm`, confirmationData);
    return response.data;
  },
  
  // Eliminar gestación
  deletePregnancy: async (id) => {
    const response = await api.delete(`/pregnancies/${id}`);
    return response.data;
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

// ==================== BIRTH SERVICE ====================

export const birthService = {
  // Obtener todos los partos
  getAllBirths: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const queryString = params.toString();
    const url = queryString ? `/births?${queryString}` : '/births';
    const response = await api.get(url);
    return response.data.data || [];
  },
  
  // Obtener parto por ID
  getBirthById: async (id) => {
    const response = await api.get(`/births/${id}`);
    return response.data.data;
  },
  
  // Obtener partos de una cerda
  getBirthsBySowId: async (sowId) => {
    const response = await api.get(`/births/sow/${sowId}`);
    return response.data.data || [];
  },
  
  // Obtener último parto de una cerda
  getLastBirthBySowId: async (sowId) => {
    const response = await api.get(`/births/sow/${sowId}/last`);
    return response.data.data;
  },
  
  // Obtener partos recientes
  getRecentBirths: async (days = 30) => {
    const response = await api.get(`/births/recent?days=${days}`);
    return response.data.data || [];
  },
  
  // Obtener partos problemáticos
  getProblematicBirths: async () => {
    const response = await api.get('/births/problematic');
    return response.data.data || [];
  },
  
  // Obtener estadísticas de partos
  getBirthStats: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const queryString = params.toString();
    const url = queryString ? `/births/stats?${queryString}` : '/births/stats';
    const response = await api.get(url);
    return response.data.data;
  },
  
  // Crear nuevo parto
  createBirth: async (birthData) => {
    const response = await api.post('/births', birthData);
    return response.data;
  },
  
  // Actualizar parto completo
  updateBirth: async (id, birthData) => {
    const response = await api.put(`/births/${id}`, birthData);
    return response.data.data;
  },
  
  // Actualizar campos específicos del parto
  partialUpdateBirth: async (id, birthData) => {
    const response = await api.patch(`/births/${id}`, birthData);
    return response.data;
  },
  
  // Eliminar parto
  deleteBirth: async (id) => {
    const response = await api.delete(`/births/${id}`);
    return response.data;
  }
};

export default api;
