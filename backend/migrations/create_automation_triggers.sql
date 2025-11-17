-- ============================================================================
-- MIGRACIÓN: Crear/Actualizar Triggers de Automatización
-- Descripción: Asegura que todos los triggers de actualización automática
--              de estados reproductivos estén correctamente implementados
-- Fecha: 2025-11-17
-- ============================================================================

-- ============================================================================
-- 1. TRIGGER: Calcular días de gestación en parto
-- ============================================================================
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

DROP TRIGGER IF EXISTS trigger_calculate_gestation_days ON births;
CREATE TRIGGER trigger_calculate_gestation_days
BEFORE INSERT ON births
FOR EACH ROW
EXECUTE FUNCTION calculate_gestation_days();

-- ============================================================================
-- 2. TRIGGER: Actualizar estadísticas de cerda al registrar parto
-- ============================================================================
CREATE OR REPLACE FUNCTION update_sow_stats_on_birth()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar contadores y estado de la cerda
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
  
  -- Finalizar gestación asociada (CRÍTICO)
  UPDATE pregnancies
  SET status = 'finalizada parto'
  WHERE id = NEW.pregnancy_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_sow_stats_on_birth ON births;
CREATE TRIGGER trigger_update_sow_stats_on_birth
AFTER INSERT ON births
FOR EACH ROW
EXECUTE FUNCTION update_sow_stats_on_birth();

-- ============================================================================
-- 3. TRIGGER: Actualizar estado reproductivo al crear servicio
-- ============================================================================
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

DROP TRIGGER IF EXISTS trigger_update_sow_status_on_service ON services;
CREATE TRIGGER trigger_update_sow_status_on_service
AFTER INSERT ON services
FOR EACH ROW
EXECUTE FUNCTION update_sow_reproductive_status_on_service();

-- ============================================================================
-- 4. TRIGGER: Actualizar estado del celo a 'servido'
-- ============================================================================
CREATE OR REPLACE FUNCTION update_heat_status_on_service()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar el celo asociado al servicio a estado 'servido'
  UPDATE heats 
  SET status = 'servido'
  WHERE id = NEW.heat_id AND status = 'detectado';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_heat_status_on_service ON services;
CREATE TRIGGER trigger_update_heat_status_on_service
AFTER INSERT ON services
FOR EACH ROW
EXECUTE FUNCTION update_heat_status_on_service();

-- ============================================================================
-- 5. TRIGGER: Actualizar estado reproductivo al confirmar gestación
-- ============================================================================
CREATE OR REPLACE FUNCTION update_sow_status_on_pregnancy()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmed = TRUE AND (OLD.confirmed = FALSE OR OLD.confirmed IS NULL) THEN
    UPDATE sows 
    SET 
      reproductive_status = 'gestante',
      expected_farrowing_date = NEW.expected_farrowing_date
    WHERE id = NEW.sow_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_sow_status_on_pregnancy ON pregnancies;
CREATE TRIGGER trigger_update_sow_status_on_pregnancy
AFTER UPDATE ON pregnancies
FOR EACH ROW
EXECUTE FUNCTION update_sow_status_on_pregnancy();

-- ============================================================================
-- 6. TRIGGER: Calcular fecha esperada de parto al crear gestación
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_expected_farrowing()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expected_farrowing_date IS NULL THEN
    NEW.expected_farrowing_date := NEW.conception_date + INTERVAL '114 days';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calculate_expected_farrowing ON pregnancies;
CREATE TRIGGER trigger_calculate_expected_farrowing
BEFORE INSERT ON pregnancies
FOR EACH ROW
EXECUTE FUNCTION calculate_expected_farrowing();

-- ============================================================================
-- 7. TRIGGER: Actualizar contador de abortos
-- ============================================================================
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

DROP TRIGGER IF EXISTS trigger_update_sow_abortion_count ON abortions;
CREATE TRIGGER trigger_update_sow_abortion_count
AFTER INSERT ON abortions
FOR EACH ROW
EXECUTE FUNCTION update_sow_abortion_count();

-- ============================================================================
-- 8. TRIGGER: Calcular fecha de fin del celo
-- ============================================================================
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

DROP TRIGGER IF EXISTS trigger_calculate_heat_end_date ON heats;
CREATE TRIGGER trigger_calculate_heat_end_date
BEFORE INSERT OR UPDATE ON heats
FOR EACH ROW
EXECUTE FUNCTION calculate_heat_end_date();

-- ============================================================================
-- VERIFICACIÓN: Mostrar triggers creados
-- ============================================================================
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
