# Validaciones Reproductivas del Sistema

Este documento describe las validaciones implementadas para controlar el ciclo reproductivo de las cerdas y garantizar la integridad de los datos.

## Períodos de Tiempo Configurados

```javascript
HEAT_CYCLE_DAYS: 21           // Ciclo estral normal (celo cada 21 días)
MIN_HEAT_INTERVAL: 18          // Mínimo entre celos (18-24 días es normal)
POST_PARTURITION_RECOVERY: 21  // Recuperación post-parto (21-28 días)
POST_ABORTION_RECOVERY: 14     // Recuperación post-aborto (14-21 días)
SERVICE_WINDOW: 3              // Ventana para múltiples servicios en mismo celo (3 días)
GESTATION_PERIOD: 114          // Duración gestación (114 días promedio)
```

## Validaciones por Tipo de Registro

### 1. Registro de Celo

**Endpoint:** `POST /api/heats`

**Validaciones implementadas:**

#### ❌ Errores que impiden el registro:

1. **Cerda no activa**
   - La cerda debe tener estado "activa"
   - Ejemplo de error: `"La cerda no está activa (Estado actual: descartada)"`

2. **Gestación activa confirmada**
   - No se puede registrar celo si la cerda tiene gestación confirmada
   - Ejemplo: `"La cerda tiene una gestación activa confirmada. Fecha esperada de parto: 15/12/2024"`

3. **Período de lactancia**
   - No se puede registrar celo si la cerda está amamantando (parto sin destete)
   - Ejemplo: `"La cerda está en período de lactancia (Parto: 01/11/2024). Debe registrar el destete antes de registrar un nuevo celo."`

4. **Intervalo muy corto desde último celo**
   - Debe haber al menos 18 días desde el último celo
   - Ejemplo: `"Intervalo muy corto desde el último celo (12 días). El intervalo normal es de 18-24 días."`

5. **Recuperación post-parto insuficiente**
   - Deben pasar al menos 21 días desde el parto/destete
   - Ejemplo: `"La cerda está en período de recuperación post-destete (15 días transcurridos, mínimo recomendado: 21 días)."`

6. **Recuperación post-aborto insuficiente**
   - Deben pasar al menos 14 días desde el aborto
   - Ejemplo: `"La cerda está en período de recuperación post-aborto (10 días transcurridos, mínimo recomendado: 14 días)."`

#### ⚠️ Advertencias (permiten el registro):

1. **Intervalo menor al ciclo normal**
   - Si el intervalo es 18-21 días (menor al ciclo normal de 21 días)
   - Ejemplo: `"Intervalo menor al ciclo estral normal (19 días vs 21 días esperados). Verifique que sea correcto."`

#### Celos Inducidos

Para celos inducidos (`heat_type: "inducido"`):
- Se aplican validaciones más flexibles en cuanto a intervalos
- Los errores de "Intervalo muy corto" se convierten en advertencias
- Se requiere obligatoriamente:
  - `induction_protocol`: Protocolo utilizado
  - `induction_date`: Fecha de inducción

---

### 2. Registro de Servicio

**Endpoint:** `POST /api/services`

**Validaciones implementadas:**

#### ❌ Errores que impiden el registro:

1. **Cerda no activa**
   - La cerda debe tener estado "activa"

2. **Celo no encontrado o no corresponde a la cerda**
   - El celo debe existir y pertenecer a la cerda seleccionada

3. **Celo ya servido fuera de ventana**
   - Si el celo ya fue servido hace más de 3 días
   - Ejemplo: `"El celo ya fue servido hace 5 días. Para múltiples servicios, deben estar dentro de 3 días del celo."`

4. **Gestación activa confirmada**
   - No se puede servir una cerda gestante
   - Ejemplo: `"La cerda ya tiene una gestación activa confirmada. No se puede registrar un servicio."`

5. **Período de lactancia**
   - No se puede servir una cerda lactante
   - Ejemplo: `"La cerda está en período de lactancia. Debe registrar el destete primero."`

#### ⚠️ Advertencias (permiten el registro):

1. **Servicio adicional en mismo celo**
   - Cuando se registra un segundo o tercer servicio dentro de los 3 días
   - Ejemplo: `"Este es un servicio adicional para el mismo celo (Servicio #2)."`

2. **Celo con estado "no servido" o "cancelado"**
   - Alerta cuando se intenta servir un celo con estos estados
   - Ejemplo: `"El celo tiene estado 'no servido'. Verifique si es correcto registrar un servicio."`

---

### 3. Registro de Gestación

**Endpoint:** `POST /api/pregnancies`

**Validaciones implementadas:**

#### ❌ Errores que impiden el registro:

1. **Cerda no activa**
   - La cerda debe tener estado "activa"

2. **Gestación activa existente**
   - Una cerda solo puede tener una gestación activa a la vez
   - Ejemplo: `"La cerda ya tiene una gestación activa. Confirmada - Fecha esperada de parto: 20/12/2024"`

3. **Período de lactancia**
   - No se puede registrar gestación si está amamantando
   - Ejemplo: `"La cerda está en período de lactancia (Parto: 05/11/2024). Debe registrar el destete antes de registrar una gestación."`

4. **Servicio no encontrado o no corresponde a la cerda**
   - El servicio debe existir y pertenecer a la cerda

#### ⚠️ Advertencias (permiten el registro):

1. **Servicio ya tiene gestación registrada**
   - Cuando se intenta registrar otra gestación para el mismo servicio
   - Ejemplo: `"Este servicio ya tiene una gestación registrada."`

2. **Gestación después de aborto reciente**
   - Si han pasado menos de 14 días desde un aborto
   - Ejemplo: `"Gestación registrada poco después de un aborto (10 días, recomendado: 14+ días)."`

---

## Respuestas de la API

### Respuesta de Error (Validación no pasada)

```json
{
  "success": false,
  "message": "No se puede registrar el celo",
  "errors": [
    "La cerda tiene una gestación activa confirmada. Fecha esperada de parto: 15/12/2024",
    "La cerda está en período de lactancia (Parto: 01/11/2024). Debe registrar el destete antes de registrar un nuevo celo."
  ],
  "warnings": []
}
```

**Status Code:** `400 Bad Request`

### Respuesta Exitosa con Advertencias

```json
{
  "success": true,
  "message": "Celo registrado exitosamente",
  "data": { /* datos del celo */ },
  "warnings": [
    "Intervalo menor al ciclo estral normal (19 días vs 21 días esperados). Verifique que sea correcto."
  ]
}
```

**Status Code:** `201 Created`

---

## Endpoint de Consulta de Estado Reproductivo

**Endpoint:** `GET /api/sows/:id/reproductive-status`

Este endpoint devuelve el estado reproductivo completo de una cerda:

```json
{
  "success": true,
  "data": {
    "sow": { /* datos de la cerda */ },
    "lastHeat": { /* último celo registrado */ },
    "lastService": { /* último servicio registrado */ },
    "activePregnancy": { /* gestación activa o null */ },
    "lastBirth": { /* último parto o null */ },
    "lastAbortion": { /* último aborto o null */ },
    "isLactating": true,
    "currentStatus": "lactante"
  }
}
```

---

## Flujo Reproductivo Normal

```
1. CERDA VACÍA
   ↓
2. CELO DETECTADO (natural o inducido)
   ↓ (puede haber múltiples servicios en 3 días)
3. SERVICIO(S) REALIZADO(S)
   ↓
4. GESTACIÓN REGISTRADA
   ↓ (confirmación a los 21-28 días)
5. GESTACIÓN CONFIRMADA
   ↓ (114 días después)
6. PARTO REGISTRADO
   ↓
7. PERÍODO DE LACTANCIA
   ↓ (21-28 días después)
8. DESTETE REGISTRADO
   ↓ (período de recuperación 21+ días)
9. VUELTA A CERDA VACÍA → Paso 2
```

---

## Casos Especiales

### Aborto
- Cuando ocurre un aborto:
  - La gestación cambia a estado "finalizada aborto"
  - Se requiere período de recuperación de 14+ días
  - Después del período, puede volver a entrar en celo

### Celo Inducido
- Para inducir un celo:
  - Usar `heat_type: "inducido"`
  - Validaciones más flexibles en intervalos
  - Obligatorio: `induction_protocol` y `induction_date`

### Múltiples Servicios
- Se pueden registrar múltiples servicios para el mismo celo
- Deben estar dentro de una ventana de 3 días
- Común en protocolos de monta natural o IA repetida

---

## Notas Importantes

1. **Todas las validaciones son del lado del servidor** - No depender únicamente de validaciones del frontend
2. **Los períodos son configurables** - Pueden ajustarse en `/backend/src/utils/reproductiveValidations.js`
3. **Las advertencias NO impiden el registro** - Solo informan situaciones inusuales
4. **Los errores SÍ impiden el registro** - Garantizan la integridad de los datos
5. **Estado reproductivo automático** - Los triggers de BD actualizan automáticamente el estado de las cerdas

---

## Mantenimiento

Para modificar los períodos de validación, editar el archivo:
`/backend/src/utils/reproductiveValidations.js`

```javascript
const PERIODS = {
  HEAT_CYCLE_DAYS: 21,           // Modificar aquí
  MIN_HEAT_INTERVAL: 18,         // Modificar aquí
  POST_PARTURITION_RECOVERY: 21, // Modificar aquí
  POST_ABORTION_RECOVERY: 14,    // Modificar aquí
  SERVICE_WINDOW: 3,             // Modificar aquí
  GESTATION_PERIOD: 114          // Modificar aquí
};
```

