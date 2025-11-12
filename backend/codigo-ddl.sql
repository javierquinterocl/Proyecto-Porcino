
-- ============================================================================
-- SISTEMA DE GESTIÓN REPRODUCTIVA PORCINA
-- Base de datos: porcime
-- ============================================================================

-- Crear base de datos porcime
CREATE DATABASE porcime;

-- ============================================================================
-- TABLAS PRINCIPALES (Entidades Independientes)
-- ============================================================================

-- Tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  -- Datos personales
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) CHECK (phone ~ '^[0-9+\- ]*$'),
  email VARCHAR(100) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),

  -- Autenticación
  password TEXT NOT NULL,   
  
  -- Estado del usuario
  is_active BOOLEAN DEFAULT TRUE,

  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de cerdas
CREATE TABLE sows (
  id SERIAL PRIMARY KEY,

  -- Identificación básica
  ear_tag VARCHAR(30) UNIQUE NOT NULL,
  id_type VARCHAR(20) NOT NULL CHECK (id_type IN ('arete','tatuaje','rfid','crotal')),
  alias TEXT,

  -- Raza y genética
  breed VARCHAR(40) NOT NULL CHECK (breed IN (
    'Large White','Landrace','Duroc','Pietrain','Hampshire','Yorkshire','F1','F2','Otro'
  )),
  genetic_line VARCHAR(40),
  generation SMALLINT CHECK (generation >= 0),
  sire_tag VARCHAR(30),
  dam_tag VARCHAR(30),

  -- Fechas
  birth_date DATE NOT NULL,
  entry_date DATE NOT NULL CHECK (entry_date >= birth_date),

  -- Origen
  origin VARCHAR(30) NOT NULL CHECK (origin IN ('propia','comprada','intercambio genetico','otro')) DEFAULT 'propia',

  -- Estado y ubicación
  status VARCHAR(20) NOT NULL CHECK (status IN ('activa','descartada','muerta','vendida')) DEFAULT 'activa',
  location TEXT,
  farm_name TEXT NOT NULL,

  -- Datos físicos y corporales
  current_weight NUMERIC(6,2) NOT NULL CHECK (current_weight >= 0),
  min_service_weight NUMERIC(6,2) DEFAULT 120.00 CHECK (min_service_weight >= 0),
  body_condition NUMERIC(3,2) NOT NULL CHECK (body_condition BETWEEN 1 AND 5),
  last_weight_date DATE,

  -- Datos productivos
  parity_count SMALLINT DEFAULT 0 CHECK (parity_count >= 0),
  total_piglets_born INTEGER DEFAULT 0 CHECK (total_piglets_born >= 0),
  total_piglets_alive INTEGER DEFAULT 0 CHECK (total_piglets_alive >= 0),
  total_piglets_dead INTEGER DEFAULT 0 CHECK (total_piglets_dead >= 0),
  total_abortions INTEGER DEFAULT 0 CHECK (total_abortions >= 0),
  avg_piglets_alive NUMERIC(4,2),

  -- Condición reproductiva
  reproductive_status VARCHAR(25) DEFAULT 'vacia' CHECK (reproductive_status IN (
    'vacia','gestante','en celo','lactante','en servicio','abortada'
  )),
  last_service_date DATE,
  last_parturition_date DATE,
  expected_farrowing_date DATE,
  last_weaning_date DATE,

  -- Foto
  photo_url TEXT,

  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  updated_by TEXT,

  -- Checks lógicos
  CHECK (birth_date <= current_date)
);

-- Tabla de verracos
CREATE TABLE boars (
  id SERIAL PRIMARY KEY,
  
  -- Identificación
  ear_tag VARCHAR(30) UNIQUE NOT NULL,
  id_type VARCHAR(20) NOT NULL CHECK (id_type IN ('arete','tatuaje','rfid','crotal','virtual')),
  name VARCHAR(100),
  
  -- Genética
  breed VARCHAR(40) NOT NULL CHECK (breed IN (
    'Large White','Landrace','Duroc','Pietrain','Hampshire','Yorkshire','F1','Otro'
  )),
  genetic_line VARCHAR(50),
  generation SMALLINT CHECK (generation >= 0),
  
  -- Genealogía (opcional)
  sire_ear_tag VARCHAR(30),
  dam_ear_tag VARCHAR(30),
  
  -- Datos básicos
  birth_date DATE,
  entry_date DATE,
  origin VARCHAR(30) CHECK (origin IN ('propio','comprado','centro genetico')) DEFAULT 'propio',
  
  -- Tipo de verraco (físico o semen comprado)
  boar_type VARCHAR(20) NOT NULL CHECK (boar_type IN ('fisico','semen comprado')) DEFAULT 'fisico',
  
  -- Estado (solo para verracos físicos)
  status VARCHAR(20) CHECK (status IN ('activo','descanso','descartado','muerto','vendido')) DEFAULT 'activo',
  location TEXT,
  farm_name TEXT,
  
  -- Datos físicos
  current_weight NUMERIC(6,2) CHECK (current_weight >= 0),
  
  -- Uso reproductivo (actualizado automáticamente)
  total_services INTEGER DEFAULT 0 CHECK (total_services >= 0),
  last_service_date DATE,
  
  -- Proveedor (para semen comprado)
  supplier_name TEXT,
  supplier_code VARCHAR(50),
  
  -- Observaciones
  notes TEXT,
  photo_url TEXT,
  
  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  updated_by TEXT,
  
  -- Validaciones
  CHECK (
    (boar_type = 'fisico' AND birth_date IS NOT NULL AND entry_date IS NOT NULL AND farm_name IS NOT NULL) OR
    (boar_type = 'semen comprado' AND supplier_name IS NOT NULL)
  ),
  CHECK (birth_date IS NULL OR birth_date <= CURRENT_DATE),
  CHECK (entry_date IS NULL OR birth_date IS NULL OR entry_date >= birth_date)
);

-- ============================================================================
-- TABLAS DE EVENTOS REPRODUCTIVOS (Relacionadas con cerdas)
-- ============================================================================

-- Tabla de celos/estros
CREATE TABLE heats (
  id SERIAL PRIMARY KEY,
  sow_id INTEGER NOT NULL REFERENCES sows(id) ON DELETE RESTRICT,
  
  -- Datos del celo
  heat_date DATE NOT NULL, -- Día de inicio del celo
  heat_end_date DATE, -- Día de fin del celo (calculado automáticamente)
  detection_time TIME,
  intensity VARCHAR(20) CHECK (intensity IN ('debil','medio','fuerte')) DEFAULT 'medio',
  duration_hours NUMERIC(4,1) CHECK (duration_hours > 0),
  
  -- Tipo de celo (natural o inducido)
  heat_type VARCHAR(20) CHECK (heat_type IN ('natural','inducido')) DEFAULT 'natural',
  induction_protocol TEXT, -- Protocolo hormonal usado (PG600, altrenogest, eCG, etc.)
  induction_date DATE, -- Fecha de aplicación del inductor
  
  -- Celo franco (momento óptimo de servicio)
  peak_estrus_date DATE, -- Día de máxima receptividad
  peak_estrus_time TIME, -- Hora estimada de celo franco
  
  -- Método de detección
  detection_method VARCHAR(30) CHECK (detection_method IN ('verraco detector','prueba inmovilidad','visual','marcador','detector electronico','otro')) DEFAULT 'verraco detector',
  boar_detector_id INTEGER REFERENCES boars(id) ON DELETE SET NULL,
  
  -- Signos clínicos de celo (observaciones durante detección)
  standing_reflex BOOLEAN, -- Reflejo de inmovilidad (lordosis)
  vulva_swelling BOOLEAN, -- Hinchazón de la vulva
  vulva_discharge BOOLEAN, -- Descarga vaginal
  mounting_behavior BOOLEAN, -- Intenta montar a otras cerdas
  restlessness BOOLEAN, -- Inquietud o agitación
  loss_of_appetite BOOLEAN, -- Pérdida de apetito
  vocalization BOOLEAN, -- Vocalización aumentada
  ear_erection BOOLEAN, -- Orejas erectas/alertas
  tail_deviation BOOLEAN, -- Cola desviada hacia un lado
  frequent_urination BOOLEAN, -- Micción frecuente
  sniffing_genital BOOLEAN, -- Olfateo de genitales de otras cerdas
  back_arching BOOLEAN, -- Arqueamiento del lomo
  
  -- Estado del celo
  status VARCHAR(20) CHECK (status IN ('detectado','servido','no servido','cancelado')) DEFAULT 'detectado',
  
  -- Observaciones
  notes TEXT,
  
  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  
  -- Validaciones
  CHECK (heat_date <= CURRENT_DATE),
  CHECK (heat_end_date IS NULL OR heat_end_date >= heat_date),
  CHECK (peak_estrus_date IS NULL OR (peak_estrus_date >= heat_date AND peak_estrus_date <= heat_end_date)),
  CHECK (induction_date IS NULL OR induction_date <= heat_date),
  CHECK (heat_type = 'inducido' AND induction_protocol IS NOT NULL AND induction_date IS NOT NULL OR heat_type = 'natural')
);

-- Tabla de servicios (SUPERTIPO: monta natural, inseminación artificial)
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  sow_id INTEGER NOT NULL REFERENCES sows(id) ON DELETE RESTRICT,
  boar_id INTEGER REFERENCES boars(id) ON DELETE RESTRICT, -- Puede ser NULL si es IA con semen comprado
  heat_id INTEGER NOT NULL REFERENCES heats(id) ON DELETE RESTRICT, -- Todo servicio debe estar asociado a un celo detectado
  
  -- Datos del servicio
  service_date DATE NOT NULL,
  service_time TIME,
  service_type VARCHAR(30) NOT NULL CHECK (service_type IN ('monta natural','inseminacion artificial')),
  service_number SMALLINT DEFAULT 1 CHECK (service_number > 0), -- 1°, 2°, 3° servicio del mismo celo
  
  -- Campos comunes
  technician_name VARCHAR(100), -- Persona que realizó el servicio
  
  -- Campos específicos de Monta Natural
  mating_duration_minutes INTEGER CHECK (mating_duration_minutes > 0),
  mating_quality VARCHAR(20) CHECK (mating_quality IN ('excelente','buena','regular','mala')),
  
  -- Campos específicos de Inseminación Artificial
  ia_type VARCHAR(30) CHECK (ia_type IN ('cervical','post-cervical','intrauterina')),
  semen_dose_code VARCHAR(50), -- Código de la dosis de semen
  semen_volume_ml NUMERIC(5,1) CHECK (semen_volume_ml > 0),
  semen_concentration NUMERIC(8,2), -- millones/ml
  
  -- Resultado general
  success BOOLEAN,
  notes TEXT,
  
  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  
  -- Validaciones
  CHECK (service_date <= CURRENT_DATE),
  CHECK (
    (service_type = 'monta natural' AND boar_id IS NOT NULL AND ia_type IS NULL AND semen_dose_code IS NULL AND semen_volume_ml IS NULL AND semen_concentration IS NULL) OR
    (service_type = 'inseminacion artificial' AND mating_duration_minutes IS NULL AND mating_quality IS NULL)
  )
);

-- Tabla de gestaciones/preñeces
CREATE TABLE pregnancies (
  id SERIAL PRIMARY KEY,
  sow_id INTEGER NOT NULL REFERENCES sows(id) ON DELETE RESTRICT,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  
  -- Datos de la gestación
  conception_date DATE NOT NULL, -- Fecha de la última inseminación/monta
  expected_farrowing_date DATE NOT NULL, -- Calculado: conception_date + 114 días
  
  -- Confirmación de preñez
  confirmed BOOLEAN DEFAULT FALSE,
  confirmation_date DATE,
  confirmation_method VARCHAR(30) CHECK (confirmation_method IN ('ultrasonido','no repeticion celo','palpacion','otro')),
  
  -- Estado de la gestación
  status VARCHAR(20) NOT NULL CHECK (status IN ('en curso','finalizada parto','finalizada aborto','no confirmada')) DEFAULT 'en curso',
  
  -- Seguimiento
  ultrasound_count SMALLINT DEFAULT 0,
  last_ultrasound_date DATE,
  estimated_piglets SMALLINT CHECK (estimated_piglets > 0),
  
  -- Observaciones
  notes TEXT,
  
  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  updated_by TEXT,
  
  -- Validaciones
  CHECK (conception_date <= CURRENT_DATE),
  CHECK (expected_farrowing_date > conception_date),
  CHECK (confirmation_date IS NULL OR confirmation_date >= conception_date),
  
  -- Solo una gestación activa por cerda
  UNIQUE (sow_id, status) WHERE (status = 'en curso')
);

-- Tabla de partos
CREATE TABLE births (
  id SERIAL PRIMARY KEY,
  sow_id INTEGER NOT NULL REFERENCES sows(id) ON DELETE RESTRICT,
  pregnancy_id INTEGER NOT NULL REFERENCES pregnancies(id) ON DELETE RESTRICT,
  boar_id INTEGER NOT NULL REFERENCES boars(id) ON DELETE RESTRICT, -- Padre de la camada
  
  -- Datos del parto
  birth_date DATE NOT NULL,
  birth_start_time TIME,
  birth_end_time TIME,
  gestation_days INTEGER NOT NULL CHECK (gestation_days BETWEEN 110 AND 120), -- Calculado automáticamente
  
  -- Tipo y asistencia
  birth_type VARCHAR(20) CHECK (birth_type IN ('normal','asistido','distocico','cesarea')) DEFAULT 'normal',
  assistance_required BOOLEAN DEFAULT FALSE,
  veterinarian_name VARCHAR(100),
  
  -- Estadísticas de la camada
  total_born INTEGER NOT NULL CHECK (total_born >= 0),
  born_alive INTEGER NOT NULL CHECK (born_alive >= 0),
  born_dead INTEGER NOT NULL CHECK (born_dead >= 0),
  mummified INTEGER DEFAULT 0 CHECK (mummified >= 0),
  malformed INTEGER DEFAULT 0 CHECK (malformed >= 0),
  
  -- Pesos
  total_litter_weight NUMERIC(6,2) CHECK (total_litter_weight >= 0),
  avg_piglet_weight NUMERIC(5,2) CHECK (avg_piglet_weight >= 0),
  
  -- Estado de la cerda post-parto
  sow_condition VARCHAR(20) CHECK (sow_condition IN ('excelente','buena','regular','mala','critica')),
  sow_temperature NUMERIC(4,2) CHECK (sow_temperature BETWEEN 35 AND 42),
  
  -- Tratamientos aplicados
  oxytocin_applied BOOLEAN DEFAULT FALSE,
  antibiotics_applied BOOLEAN DEFAULT FALSE,
  treatment_notes TEXT,
  
  -- Lactancia
  lactation_start_date DATE,
  expected_weaning_date DATE, -- Calculado: birth_date + 21-28 días
  
  -- Observaciones
  notes TEXT,
  
  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  updated_by TEXT,
  
  -- Validaciones
  CHECK (birth_date <= CURRENT_DATE),
  CHECK (total_born = born_alive + born_dead + mummified),
  CHECK (birth_end_time IS NULL OR birth_start_time IS NULL OR birth_end_time >= birth_start_time),
  CHECK (lactation_start_date IS NULL OR lactation_start_date >= birth_date),
  CHECK (expected_weaning_date IS NULL OR lactation_start_date IS NULL OR expected_weaning_date > lactation_start_date)
);

-- Tabla de lechones
CREATE TABLE piglets (
  id SERIAL PRIMARY KEY,
  birth_id INTEGER NOT NULL REFERENCES births(id) ON DELETE RESTRICT,
  sow_id INTEGER NOT NULL REFERENCES sows(id) ON DELETE RESTRICT, -- Madre
  sire_id INTEGER NOT NULL REFERENCES boars(id) ON DELETE RESTRICT, -- Padre
  
  -- Identificación
  ear_tag VARCHAR(30) UNIQUE, -- Puede ser NULL hasta que se identifique
  temporary_id VARCHAR(20), -- ID temporal (número de camada, posición)
  
  -- Datos al nacimiento
  birth_order SMALLINT CHECK (birth_order > 0),
  sex VARCHAR(10) NOT NULL CHECK (sex IN ('macho','hembra','indefinido')),
  birth_weight NUMERIC(4,2) CHECK (birth_weight >= 0),
  birth_status VARCHAR(20) NOT NULL CHECK (birth_status IN ('vivo','muerto','momificado')) DEFAULT 'vivo',
  
  -- Estado actual
  current_status VARCHAR(20) NOT NULL CHECK (current_status IN ('lactante','destetado','vendido','muerto','transferido')) DEFAULT 'lactante',
  
  -- Adopción/transferencia
  adoptive_sow_id INTEGER REFERENCES sows(id) ON DELETE SET NULL, -- Si fue adoptado por otra cerda
  adoption_date DATE,
  adoption_reason VARCHAR(50) CHECK (adoption_reason IN ('exceso camada','baja produccion leche','muerte madre','bajo peso','otro')),
  
  -- Destete
  weaning_date DATE,
  weaning_weight NUMERIC(5,2) CHECK (weaning_weight >= 0),
  weaning_age_days INTEGER CHECK (weaning_age_days > 0),
  
  -- Muerte (si aplica)
  death_date DATE,
  death_age_days INTEGER CHECK (death_age_days >= 0),
  death_cause VARCHAR(100),
  
  -- Observaciones
  special_care BOOLEAN DEFAULT FALSE,
  notes TEXT,
  
  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  updated_by TEXT,
  
  -- Validaciones
  CHECK (adoption_date IS NULL OR adoption_date > (SELECT birth_date FROM births WHERE id = birth_id)),
  CHECK (weaning_date IS NULL OR weaning_date > (SELECT birth_date FROM births WHERE id = birth_id)),
  CHECK (death_date IS NULL OR death_date >= (SELECT birth_date FROM births WHERE id = birth_id))
);

-- Tabla de abortos
CREATE TABLE abortions (
  id SERIAL PRIMARY KEY,
  sow_id INTEGER NOT NULL REFERENCES sows(id) ON DELETE RESTRICT,
  pregnancy_id INTEGER NOT NULL REFERENCES pregnancies(id) ON DELETE RESTRICT,
  
  -- Datos del aborto
  abortion_date DATE NOT NULL,
  gestation_days INTEGER NOT NULL CHECK (gestation_days > 0 AND gestation_days < 114),
  
  -- Detalles del aborto
  fetuses_expelled INTEGER DEFAULT 0 CHECK (fetuses_expelled >= 0),
  fetus_condition VARCHAR(30) CHECK (fetus_condition IN ('fresco','autolisis','momificado','mixto')),
  
  -- Síntomas previos
  symptoms TEXT,
  fever BOOLEAN DEFAULT FALSE,
  vaginal_discharge BOOLEAN DEFAULT FALSE,
  anorexia BOOLEAN DEFAULT FALSE,
  
  -- Causa probable
  probable_cause VARCHAR(50) CHECK (probable_cause IN (
    'infecciosa','nutricional','toxica','traumatica','termica','genetica','hormonal','desconocida'
  )),
  specific_cause TEXT, -- Detalles específicos (ej: "PRRS", "micotoxinas")
  
  -- Diagnóstico
  laboratory_test BOOLEAN DEFAULT FALSE,
  test_results TEXT,
  
  -- Acciones tomadas
  treatment_applied TEXT,
  isolation_required BOOLEAN DEFAULT FALSE,
  
  -- Seguimiento
  return_to_service_date DATE,
  recovery_status VARCHAR(20) CHECK (recovery_status IN ('completa','parcial','descarte recomendado')),
  
  -- Observaciones
  notes TEXT,
  
  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  updated_by TEXT,
  
  -- Validaciones
  CHECK (abortion_date <= CURRENT_DATE),
  CHECK (return_to_service_date IS NULL OR return_to_service_date > abortion_date)
);


-- ============================================================================
-- TRIGGERS PARA AUTOMATIZACIÓN
-- ============================================================================

-- Trigger: Calcular fecha de fin del celo basándose en duration_hours
CREATE OR REPLACE FUNCTION calculate_heat_end_date()
RETURNS TRIGGER AS $$
BEGIN
  -- Si se proporciona duration_hours y no hay heat_end_date, calcularlo
  IF NEW.duration_hours IS NOT NULL AND NEW.heat_end_date IS NULL THEN
    NEW.heat_end_date := NEW.heat_date + (NEW.duration_hours || ' hours')::INTERVAL;
  END IF;
  
  -- Si hay heat_end_date pero no duration_hours, calcular duration_hours
  IF NEW.heat_end_date IS NOT NULL AND NEW.duration_hours IS NULL THEN
    NEW.duration_hours := EXTRACT(EPOCH FROM (NEW.heat_end_date - NEW.heat_date)) / 3600;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_heat_end_date
BEFORE INSERT OR UPDATE ON heats
FOR EACH ROW
EXECUTE FUNCTION calculate_heat_end_date();

-- Trigger: Actualizar contador de servicios del verraco
CREATE OR REPLACE FUNCTION update_boar_service_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE boars 
    SET 
      total_services = total_services + 1,
      last_service_date = NEW.service_date
    WHERE id = NEW.boar_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_boar_service_count
AFTER INSERT ON services
FOR EACH ROW
EXECUTE FUNCTION update_boar_service_count();

-- Trigger: Calcular fecha esperada de parto al crear gestación
CREATE OR REPLACE FUNCTION calculate_expected_farrowing()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expected_farrowing_date IS NULL THEN
    NEW.expected_farrowing_date := NEW.conception_date + INTERVAL '114 days';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_expected_farrowing
BEFORE INSERT ON pregnancies
FOR EACH ROW
EXECUTE FUNCTION calculate_expected_farrowing();

-- Trigger: Actualizar estado reproductivo de cerda al crear servicio
CREATE OR REPLACE FUNCTION update_sow_reproductive_status_on_service()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.service_type IN ('monta natural', 'inseminacion artificial') THEN
    UPDATE sows 
    SET 
      reproductive_status = 'en servicio',
      last_service_date = NEW.service_date
    WHERE id = NEW.sow_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sow_status_on_service
AFTER INSERT ON services
FOR EACH ROW
EXECUTE FUNCTION update_sow_reproductive_status_on_service();

-- Trigger: Actualizar estado reproductivo de cerda al confirmar gestación
CREATE OR REPLACE FUNCTION update_sow_status_on_pregnancy()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmed = TRUE AND OLD.confirmed = FALSE THEN
    UPDATE sows 
    SET 
      reproductive_status = 'gestante',
      expected_farrowing_date = NEW.expected_farrowing_date
    WHERE id = NEW.sow_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sow_status_on_pregnancy
AFTER UPDATE ON pregnancies
FOR EACH ROW
EXECUTE FUNCTION update_sow_status_on_pregnancy();

-- Trigger: Actualizar contadores de cerda al registrar parto
CREATE OR REPLACE FUNCTION update_sow_stats_on_birth()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sows 
  SET 
    parity_count = parity_count + 1,
    total_piglets_born = total_piglets_born + NEW.total_born,
    total_piglets_alive = total_piglets_alive + NEW.born_alive,
    total_piglets_dead = total_piglets_dead + NEW.born_dead,
    last_parturition_date = NEW.birth_date,
    reproductive_status = 'lactante'
  WHERE id = NEW.sow_id;
  
  -- Calcular promedio de lechones vivos
  UPDATE sows
  SET avg_piglets_alive = total_piglets_alive::NUMERIC / NULLIF(parity_count, 0)
  WHERE id = NEW.sow_id;
  
  -- Finalizar gestación
  UPDATE pregnancies
  SET status = 'finalizada parto'
  WHERE id = NEW.pregnancy_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sow_stats_on_birth
AFTER INSERT ON births
FOR EACH ROW
EXECUTE FUNCTION update_sow_stats_on_birth();

-- Trigger: Calcular días de gestación en parto
CREATE OR REPLACE FUNCTION calculate_gestation_days()
RETURNS TRIGGER AS $$
DECLARE
  conception_date_val DATE;
BEGIN
  SELECT conception_date INTO conception_date_val
  FROM pregnancies
  WHERE id = NEW.pregnancy_id;
  
  NEW.gestation_days := NEW.birth_date - conception_date_val;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_gestation_days
BEFORE INSERT ON births
FOR EACH ROW
EXECUTE FUNCTION calculate_gestation_days();

-- Trigger: Actualizar contador de abortos de cerda
CREATE OR REPLACE FUNCTION update_sow_abortion_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sows 
  SET 
    total_abortions = total_abortions + 1,
    reproductive_status = 'abortada'
  WHERE id = NEW.sow_id;
  
  -- Finalizar gestación
  UPDATE pregnancies
  SET status = 'finalizada aborto'
  WHERE id = NEW.pregnancy_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sow_abortion_count
AFTER INSERT ON abortions
FOR EACH ROW
EXECUTE FUNCTION update_sow_abortion_count();

-- Trigger: Calcular edad al destete/muerte de lechón
CREATE OR REPLACE FUNCTION calculate_piglet_age()
RETURNS TRIGGER AS $$
DECLARE
  birth_date_val DATE;
BEGIN
  SELECT birth_date INTO birth_date_val
  FROM births
  WHERE id = NEW.birth_id;
  
  IF NEW.weaning_date IS NOT NULL AND NEW.weaning_age_days IS NULL THEN
    NEW.weaning_age_days := NEW.weaning_date - birth_date_val;
  END IF;
  
  IF NEW.death_date IS NOT NULL AND NEW.death_age_days IS NULL THEN
    NEW.death_age_days := NEW.death_date - birth_date_val;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_piglet_age
BEFORE INSERT OR UPDATE ON piglets
FOR EACH ROW
EXECUTE FUNCTION calculate_piglet_age();

-- Trigger: Crear evento automático de parto esperado al confirmar gestación
CREATE OR REPLACE FUNCTION create_farrowing_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmed = TRUE AND OLD.confirmed = FALSE THEN
    INSERT INTO events (
      sow_id, pregnancy_id, event_type, event_date, title, description, priority, notification_days_before
    ) VALUES (
      NEW.sow_id,
      NEW.id,
      'parto esperado',
      NEW.expected_farrowing_date,
      'Parto esperado - Cerda ' || (SELECT ear_tag FROM sows WHERE id = NEW.sow_id),
      'Fecha probable de parto. Trasladar a maternidad 7 días antes.',
      'alta',
      7
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_farrowing_event
AFTER UPDATE ON pregnancies
FOR EACH ROW
EXECUTE FUNCTION create_farrowing_event();


