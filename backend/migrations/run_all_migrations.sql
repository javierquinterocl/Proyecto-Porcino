-- ============================================================================
-- EJECUTAR TODAS LAS MIGRACIONES EN ORDEN
-- ============================================================================
-- Este script ejecuta todas las migraciones en el orden correcto
-- para asegurar que las dependencias se cumplan.
--
-- IMPORTANTE: Ejecutar este script en tu base de datos PostgreSQL
-- ============================================================================

\echo '🚀 Iniciando migraciones...'
\echo ''

-- 1. Crear tabla de usuarios (requerida por otras tablas)
\echo '📝 Creando tabla users...'
\i create_users_table.sql
\echo '✅ Tabla users creada'
\echo ''

-- 2. Crear tabla de tokens de recuperación de contraseña
\echo '📝 Creando tabla password_reset_tokens...'
\i create_password_reset_tokens.sql
\echo '✅ Tabla password_reset_tokens creada'
\echo ''

-- 3. Crear tabla de notificaciones
\echo '📝 Creando tabla notifications...'
\i create_notifications_table.sql
\echo '✅ Tabla notifications creada'
\echo ''

-- 4. Agregar columna de hora a eventos del calendario
\echo '📝 Alterando tabla calendar_events...'
\i alter_calendar_events_add_time.sql
\echo '✅ Tabla calendar_events alterada'
\echo ''

-- 5. Agregar check de fecha de nacimiento
\echo '📝 Agregando check a births...'
\i add_birth_date_check.sql
\echo '✅ Check agregado a births'
\echo ''

\echo '🎉 ¡Todas las migraciones se ejecutaron exitosamente!'

