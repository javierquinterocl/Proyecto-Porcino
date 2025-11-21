-- Migración: ELIMINAR restricción de birth_date para permitir fechas futuras
-- Los partos pueden ser planificados con base en la fecha esperada de la gestación
-- Por lo tanto, DEBEN permitir fechas futuras

-- Eliminar la restricción que impedía fechas futuras
DO $$ 
BEGIN
  -- Eliminar constraint si existe
  ALTER TABLE births DROP CONSTRAINT IF EXISTS births_birth_date_check;
    
  RAISE NOTICE 'Restricción births_birth_date_check eliminada exitosamente - ahora se permiten fechas futuras';
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error al eliminar restricción: %', SQLERRM;
END $$;

