-- Tabla para eventos personalizados del calendario
CREATE TABLE IF NOT EXISTS calendar_events (
  id SERIAL PRIMARY KEY,
  
  -- Datos del evento
  title VARCHAR(200) NOT NULL,
  event_date DATE NOT NULL,
  event_type VARCHAR(50) DEFAULT 'custom' CHECK (event_type IN ('custom', 'vaccination', 'maintenance', 'inspection', 'other')),
  
  -- Detalles
  description TEXT,
  notes TEXT,
  
  -- Estado
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  
  -- Recordatorio
  reminder_days INTEGER DEFAULT 0 CHECK (reminder_days >= 0),
  
  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  updated_by TEXT,
  
  -- Validaciones
  CHECK (event_date >= CURRENT_DATE - INTERVAL '1 year')
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_calendar_events_date ON calendar_events(event_date);
CREATE INDEX idx_calendar_events_status ON calendar_events(status);
CREATE INDEX idx_calendar_events_type ON calendar_events(event_type);

-- Comentarios
COMMENT ON TABLE calendar_events IS 'Eventos personalizados del calendario de la granja';
COMMENT ON COLUMN calendar_events.title IS 'Título del evento';
COMMENT ON COLUMN calendar_events.event_date IS 'Fecha del evento';
COMMENT ON COLUMN calendar_events.event_type IS 'Tipo de evento: custom, vaccination, maintenance, inspection, other';
COMMENT ON COLUMN calendar_events.status IS 'Estado del evento: pending, completed, cancelled';

