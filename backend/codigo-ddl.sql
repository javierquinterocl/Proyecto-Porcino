
-- Crear base de datos porcime
CREATE DATABASE porcime;

--Crear tabla sows

CREATE TABLE sows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

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

-- Tabla users

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE
);
