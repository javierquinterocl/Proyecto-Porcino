-- =====================================================
-- Migración: Agregar columna current_weight a piglets
-- Descripción: Agrega la columna current_weight para rastrear el peso actual de cada lechón
-- Fecha: 2025-11-23
-- =====================================================

-- Agregar columna current_weight a la tabla piglets
ALTER TABLE piglets 
ADD COLUMN IF NOT EXISTS current_weight NUMERIC(6,2) CHECK (current_weight >= 0);

-- Comentario en la columna
COMMENT ON COLUMN piglets.current_weight IS 'Peso actual del lechón en kg';

-- Inicializar current_weight con birth_weight para los registros existentes que no lo tengan
UPDATE piglets 
SET current_weight = birth_weight 
WHERE current_weight IS NULL AND birth_weight IS NOT NULL;

PRINT 'Columna current_weight agregada exitosamente a la tabla piglets';

