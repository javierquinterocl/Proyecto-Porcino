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
  specific_cause TEXT,
  
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