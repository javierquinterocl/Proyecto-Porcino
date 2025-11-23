-- Migración para agregar soporte de hora en eventos del calendario
-- Cambiar event_date de DATE a TIMESTAMP WITH TIME ZONE

-- 1. Alterar el tipo de columna
ALTER TABLE calendar_events 
  ALTER COLUMN event_date TYPE TIMESTAMP WITH TIME ZONE 
  USING event_date::TIMESTAMP WITH TIME ZONE;

-- 2. Actualizar el comentario de la columna
COMMENT ON COLUMN calendar_events.event_date IS 'Fecha y hora del evento';

-- 3. Actualizar la validación (permitir fechas pasadas con más flexibilidad)
ALTER TABLE calendar_events 
  DROP CONSTRAINT IF EXISTS calendar_events_event_date_check;

ALTER TABLE calendar_events 
  ADD CONSTRAINT calendar_events_event_date_check 
  CHECK (event_date >= (CURRENT_DATE - INTERVAL '1 year')::TIMESTAMP WITH TIME ZONE);


