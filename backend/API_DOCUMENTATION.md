# 📚 API Documentation - Porcime Backend

## 🔐 Autenticación

Todas las rutas (excepto registro y login) requieren autenticación mediante JWT.

**Header requerido:**
```
Authorization: Bearer <tu_token_jwt>
```

---

## 👤 Endpoints de Usuarios

### 1. Registrar Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "phone": "+57 300 1234567",
  "email": "juan@example.com",
  "password": "password123",
  "role": "usuario"  // opcional: usuario, tecnico, admin
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@example.com",
      "role": "usuario",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Iniciar Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

### 3. Obtener Usuario Actual
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### 4. Listar Todos los Usuarios (Admin)
```http
GET /api/users
Authorization: Bearer <token>
```

### 5. Obtener Usuario por ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

### 6. Actualizar Usuario (Admin)
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "Juan Carlos",
  "last_name": "Pérez López",
  "phone": "+57 300 7654321",
  "email": "juancarlos@example.com",
  "role": "tecnico",
  "is_active": true
}
```

### 7. Cambiar Contraseña
```http
PUT /api/users/:id/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

### 8. Desactivar Usuario (Admin)
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

### 9. Eliminar Usuario Permanentemente (Admin)
```http
DELETE /api/users/:id/permanent
Authorization: Bearer <token>
```

---

## 🐷 Endpoints de Cerdas (Sows)

### 1. Listar Todas las Cerdas
```http
GET /api/sows
Authorization: Bearer <token>

# Con filtros opcionales
GET /api/sows?status=activa&breed=Yorkshire&reproductive_status=gestante&farm_name=Granja1
```

**Respuesta:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "uuid",
      "ear_tag": "A001",
      "breed": "Yorkshire",
      "status": "activa",
      "reproductive_status": "gestante",
      ...
    }
  ]
}
```

### 2. Obtener Estadísticas
```http
GET /api/sows/stats
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total_cerdas": "50",
    "activas": "45",
    "gestantes": "15",
    "lactantes": "10",
    "vacias": "20",
    "peso_promedio": "180.50",
    "condicion_corporal_promedio": "3.25",
    "total_lechones_nacidos": "500",
    "total_lechones_vivos": "475"
  }
}
```

### 3. Obtener Cerda por ID
```http
GET /api/sows/:id
Authorization: Bearer <token>
```

### 4. Obtener Cerda por Arete
```http
GET /api/sows/ear-tag/:ear_tag
Authorization: Bearer <token>

# Ejemplo
GET /api/sows/ear-tag/A001
```

### 5. Crear Nueva Cerda (Admin/Técnico)
```http
POST /api/sows
Authorization: Bearer <token>
Content-Type: application/json

{
  "ear_tag": "A001",
  "id_type": "arete",
  "alias": "La Rubia",
  "breed": "Yorkshire",
  "genetic_line": "Línea Premium",
  "generation": 2,
  "sire_tag": "P001",
  "dam_tag": "M001",
  "birth_date": "2023-01-15",
  "entry_date": "2023-03-01",
  "origin": "propia",
  "status": "activa",
  "location": "Corral 5",
  "farm_name": "Granja Principal",
  "current_weight": 180.5,
  "min_service_weight": 120.0,
  "body_condition": 3.5,
  "last_weight_date": "2024-01-01",
  "parity_count": 2,
  "total_piglets_born": 24,
  "total_piglets_alive": 22,
  "total_piglets_dead": 2,
  "total_abortions": 0,
  "avg_piglets_alive": 11.0,
  "reproductive_status": "gestante",
  "last_service_date": "2023-12-01",
  "expected_farrowing_date": "2024-04-01",
  "photo_url": "https://example.com/photo.jpg"
}
```

**Campos obligatorios:**
- ear_tag
- id_type
- breed
- birth_date
- entry_date
- farm_name
- current_weight
- body_condition

### 6. Actualizar Cerda Completamente (Admin/Técnico)
```http
PUT /api/sows/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "ear_tag": "A001",
  "id_type": "arete",
  ...todos los campos
}
```

### 7. Actualizar Campos Específicos (Admin/Técnico)
```http
PATCH /api/sows/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_weight": 185.0,
  "body_condition": 3.8,
  "reproductive_status": "lactante"
}
```

### 8. Descartar Cerda (Admin/Técnico)
```http
DELETE /api/sows/:id
Authorization: Bearer <token>
```
*Cambia el status a "descartada" sin eliminar el registro*

### 9. Eliminar Cerda Permanentemente (Admin)
```http
DELETE /api/sows/:id/permanent
Authorization: Bearer <token>
```

---

## 📋 Valores Permitidos

### Roles de Usuario
- `admin`: Acceso completo
- `tecnico`: Crear y modificar cerdas
- `usuario`: Solo lectura

### Tipo de Identificación (id_type)
- `arete`
- `tatuaje`
- `rfid`
- `crotal`

### Razas (breed)
- `Large White`
- `Landrace`
- `Duroc`
- `Pietrain`
- `Hampshire`
- `Yorkshire`
- `F1`
- `F2`
- `Otro`

### Origen
- `propia`
- `comprada`
- `intercambio genetico`
- `otro`

### Status
- `activa`
- `descartada`
- `muerta`
- `vendida`

### Estado Reproductivo
- `vacia`
- `gestante`
- `en celo`
- `lactante`
- `en servicio`
- `abortada`

---

## 🔒 Permisos por Rol

| Endpoint | Usuario | Técnico | Admin |
|----------|---------|---------|-------|
| Listar cerdas | ✅ | ✅ | ✅ |
| Ver estadísticas | ✅ | ✅ | ✅ |
| Ver cerda individual | ✅ | ✅ | ✅ |
| Crear cerda | ❌ | ✅ | ✅ |
| Actualizar cerda | ❌ | ✅ | ✅ |
| Descartar cerda | ❌ | ✅ | ✅ |
| Eliminar cerda | ❌ | ❌ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ |

---

## 🧪 Ejemplos para Frontend (React)

### Configurar Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

### Login
```javascript
const handleLogin = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    console.error('Error de login:', error.response?.data);
    throw error;
  }
};
```

### Obtener Cerdas
```javascript
const fetchSows = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/sows?${params}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener cerdas:', error);
    throw error;
  }
};
```

### Crear Cerda
```javascript
const createSow = async (sowData) => {
  try {
    const response = await api.post('/sows', sowData);
    return response.data.data;
  } catch (error) {
    console.error('Error al crear cerda:', error.response?.data);
    throw error;
  }
};
```

### Actualizar Cerda
```javascript
const updateSow = async (id, sowData) => {
  try {
    const response = await api.patch(`/sows/${id}`, sowData);
    return response.data.data;
  } catch (error) {
    console.error('Error al actualizar cerda:', error);
    throw error;
  }
};
```

---

## ⚠️ Códigos de Error

- `400`: Bad Request - Datos inválidos o faltantes
- `401`: Unauthorized - Token inválido o expirado
- `403`: Forbidden - No tienes permisos
- `404`: Not Found - Recurso no encontrado
- `409`: Conflict - Recurso duplicado (ej: email o ear_tag ya existe)
- `500`: Internal Server Error - Error del servidor

---

## 🔄 Flujo de Autenticación

1. Usuario se registra o hace login
2. Backend responde con token JWT
3. Frontend guarda el token en localStorage
4. Frontend incluye el token en cada petición
5. Backend verifica el token y permisos
6. Backend responde con los datos solicitados
