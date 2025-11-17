-- ============================================================================
-- TRIGGERS DE CAMBIOS DE ESTADO AUTOMÁTICOS
-- Sistema de Gestión Reproductiva Porcina
-- ============================================================================
-- Este archivo contiene todos los triggers que gestionan el efecto dominó
-- de cambios de estado entre las diferentes tablas del sistema.
-- ============================================================================

-- ============================================================================
-- 1. FLUJO: CELO → SERVICIO
-- ============================================================================
-- Cuando se registra un SERVICIO:
-- ✓ Actualiza el estado del CELO a 'servido'
-- ✓ Actualiza el estado reproductivo de la CERDA a 'en servicio'
-- ✓ Actualiza last_service_date de la CERDA
-- ✓ Incrementa contador de servicios del VERRACO
-- ============================================================================

-- TRIGGER YA EXISTE EN DDL (línea 566)
-- Actualizar estado del celo cuando se registra un servicio
CREATE OR REPLACE FUNCTION update_heat_status_on_service()
RETURNS TRIGGER AS $$
BEGIN
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

-- TRIGGER YA EXISTE EN DDL (línea 550)
-- Actualizar estado reproductivo de cerda al crear servicio
CREATE OR REPLACE FUNCTION update_sow_reproductive_status_on_service()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sows 
  SET 
    reproductive_status = 'en servicio',
    last_service_date = NEW.service_date
  WHERE id = NEW.sow_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_sow_status_on_service ON services;
CREATE TRIGGER trigger_update_sow_status_on_service
AFTER INSERT ON services
FOR EACH ROW
EXECUTE FUNCTION update_sow_reproductive_status_on_service();

-- TRIGGER NUEVO
-- Incrementar contador de servicios del verraco
CREATE OR REPLACE FUNCTION update_boar_service_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo actualizar si hay verraco asociado (no aplica para IA con semen comprado sin verraco)
  IF NEW.boar_id IS NOT NULL THEN
    UPDATE boars 
    SET 
      total_services = total_services + 1,
      last_service_date = NEW.service_date
    WHERE id = NEW.boar_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_boar_service_count ON services;
CREATE TRIGGER trigger_update_boar_service_count
AFTER INSERT ON services
FOR EACH ROW
EXECUTE FUNCTION update_boar_service_count();


-- ============================================================================
-- 2. FLUJO: SERVICIO → PREÑEZ (GESTACIÓN)
-- ============================================================================
-- Cuando se crea una PREÑEZ:
-- ✓ Calcula expected_farrowing_date automáticamente
-- ============================================================================

-- TRIGGER YA EXISTE EN DDL (línea 537)
-- Calcular fecha esperada de parto al crear gestación
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
-- 3. FLUJO: PREÑEZ → CONFIRMACIÓN DE GESTACIÓN
-- ============================================================================
-- Cuando se CONFIRMA una PREÑEZ (confirmed = TRUE):
-- ✓ Actualiza estado reproductivo de la CERDA a 'gestante'
-- ✓ Actualiza expected_farrowing_date de la CERDA
-- ============================================================================

-- TRIGGER YA EXISTE EN DDL (línea 580)
-- Actualizar estado reproductivo al confirmar gestación
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
-- 4. FLUJO: PREÑEZ → PARTO
-- ============================================================================
-- Cuando se registra un PARTO:
-- ✓ Calcula gestation_days automáticamente
-- ✓ Actualiza estado de la PREÑEZ a 'finalizada parto'
-- ✓ Incrementa parity_count de la CERDA
-- ✓ Actualiza contadores de lechones (total_born, alive, dead) de la CERDA
-- ✓ Calcula promedio de lechones vivos (avg_piglets_alive) de la CERDA
-- ✓ Actualiza estado reproductivo de la CERDA a 'lactante'
-- ✓ Actualiza last_parturition_date de la CERDA
-- ============================================================================

-- TRIGGER YA EXISTE EN DDL (línea 610)
-- Calcular días de gestación en parto
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

-- TRIGGER YA EXISTE EN DDL (línea 596)
-- Actualizar estadísticas de cerda al registrar parto
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
  
  -- Finalizar gestación asociada
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
-- 5. FLUJO: PREÑEZ → ABORTO
-- ============================================================================
-- Cuando se registra un ABORTO:
-- ✓ Incrementa contador de abortos de la CERDA
-- ✓ Actualiza estado reproductivo de la CERDA a 'abortada'
-- ✓ Actualiza estado de la PREÑEZ a 'finalizada aborto'
-- ============================================================================

-- TRIGGER YA EXISTE EN DDL (línea 626)
-- Actualizar contador de abortos
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
-- 6. FLUJO: PARTO → LECHONES (PIGLETS)
-- ============================================================================
-- Cuando se registra/actualiza un LECHÓN:
-- ✓ Calcula edad al destete (weaning_age_days) si se proporciona weaning_date
-- ✓ Calcula edad a la muerte (death_age_days) si se proporciona death_date
-- ============================================================================

-- TRIGGER YA EXISTE EN DDL (línea 641)
-- Calcular edad al destete/muerte de lechón
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

DROP TRIGGER IF EXISTS trigger_calculate_piglet_age ON piglets;
CREATE TRIGGER trigger_calculate_piglet_age
BEFORE INSERT OR UPDATE ON piglets
FOR EACH ROW
EXECUTE FUNCTION calculate_piglet_age();


-- ============================================================================
-- 7. FLUJO: DESTETE (WEANING)
-- ============================================================================
-- Cuando se DESTETAN lechones (actualización masiva):
-- ✓ Actualiza estado reproductivo de la CERDA a 'vacia'
-- ✓ Actualiza last_weaning_date de la CERDA
-- ============================================================================

-- TRIGGER NUEVO
-- Actualizar estado de cerda cuando se destetan lechones
CREATE OR REPLACE FUNCTION update_sow_status_on_weaning()
RETURNS TRIGGER AS $$
DECLARE
  all_weaned BOOLEAN;
  birth_sow_id INTEGER;
BEGIN
  -- Solo ejecutar si se está actualizando el weaning_date
  IF NEW.weaning_date IS NOT NULL AND (OLD.weaning_date IS NULL OR OLD.weaning_date != NEW.weaning_date) THEN
    
    -- Obtener el sow_id del birth asociado
    SELECT sow_id INTO birth_sow_id
    FROM births
    WHERE id = NEW.birth_id;
    
    -- Verificar si todos los lechones vivos de este parto ya fueron destetados
    SELECT NOT EXISTS (
      SELECT 1 
      FROM piglets p
      INNER JOIN births b ON p.birth_id = b.id
      WHERE b.sow_id = birth_sow_id
        AND b.id = NEW.birth_id
        AND p.birth_status = 'vivo'
        AND p.current_status = 'lactante'
        AND p.weaning_date IS NULL
    ) INTO all_weaned;
    
    -- Si todos fueron destetados, actualizar estado de la cerda
    IF all_weaned THEN
      UPDATE sows 
      SET 
        reproductive_status = 'vacia',
        last_weaning_date = NEW.weaning_date
      WHERE id = birth_sow_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_sow_status_on_weaning ON piglets;
CREATE TRIGGER trigger_update_sow_status_on_weaning
AFTER UPDATE ON piglets
FOR EACH ROW
EXECUTE FUNCTION update_sow_status_on_weaning();


-- ============================================================================
-- 8. FLUJO: CÁLCULOS AUTOMÁTICOS (CELO)
-- ============================================================================
-- Cuando se registra un CELO:
-- ✓ Calcula heat_end_date si se proporciona duration_hours
-- ✓ Calcula duration_hours si se proporciona heat_end_date
-- ============================================================================

-- TRIGGER YA EXISTE EN DDL (línea 520)
-- Calcular fecha de fin del celo
CREATE OR REPLACE FUNCTION calculate_heat_end_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.duration_hours IS NOT NULL AND NEW.heat_end_date IS NULL THEN
    NEW.heat_end_date := NEW.heat_date + (NEW.duration_hours || ' hours')::INTERVAL;
  END IF;
  
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
-- RESUMEN DEL FLUJO COMPLETO DE ESTADOS
-- ============================================================================
/*
FLUJO REPRODUCTIVO NORMAL:

1. CELO detectado (heats)
   └─> Estado cerda: 'en celo'

2. SERVICIO registrado (services)
   └─> Celo: 'servido'
   └─> Estado cerda: 'en servicio'
   └─> Verraco: total_services++

3. PREÑEZ creada (pregnancies)
   └─> Estado: 'en curso'
   └─> Calcula: expected_farrowing_date

4. PREÑEZ confirmada (pregnancies.confirmed = TRUE)
   └─> Estado cerda: 'gestante'
   └─> Actualiza: expected_farrowing_date en sow

5. PARTO registrado (births)
   └─> Preñez: 'finalizada parto'
   └─> Estado cerda: 'lactante'
   └─> Actualiza: parity_count++, total_piglets_born, avg_piglets_alive
   └─> Calcula: gestation_days

6. DESTETE de lechones (piglets.weaning_date)
   └─> Si todos destetados → Estado cerda: 'vacia'
   └─> Calcula: weaning_age_days

FLUJO ALTERNATIVO (ABORTO):

3. PREÑEZ en curso (pregnancies)
   └─> ABORTO registrado (abortions)
       └─> Preñez: 'finalizada aborto'
       └─> Estado cerda: 'abortada'
       └─> total_abortions++

TABLAS AFECTADAS POR CADA OPERACIÓN:

INSERT birth:
  - births (nueva fila)
  - pregnancies (status = 'finalizada parto')
  - sows (parity_count++, totales, reproductive_status = 'lactante')

INSERT abortion:
  - abortions (nueva fila)
  - pregnancies (status = 'finalizada aborto')
  - sows (total_abortions++, reproductive_status = 'abortada')

INSERT service:
  - services (nueva fila)
  - heats (status = 'servido')
  - sows (reproductive_status = 'en servicio', last_service_date)
  - boars (total_services++, last_service_date)

UPDATE pregnancy (confirmed):
  - pregnancies (confirmed = TRUE)
  - sows (reproductive_status = 'gestante', expected_farrowing_date)

UPDATE piglet (weaning):
  - piglets (weaning_date, weaning_age_days)
  - sows (si todos destetados: reproductive_status = 'vacia', last_weaning_date)
*/

-- ============================================================================
-- FIN DEL ARCHIVO
-- ============================================================================
