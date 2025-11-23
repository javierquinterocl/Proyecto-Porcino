# 📋 Migraciones de Base de Datos

Este directorio contiene todas las migraciones necesarias para configurar la base de datos del sistema.

## 🚀 Ejecución Rápida

### Opción 1: Script Automático (Windows PowerShell)

```powershell
cd backend/migrations
.\run_migrations.ps1
```

### Opción 2: Manual con psql (Linux/Mac/Windows con psql)

```bash
cd backend/migrations
psql -U postgres -d porcicultura -f create_users_table.sql
psql -U postgres -d porcicultura -f create_password_reset_tokens.sql
psql -U postgres -d porcicultura -f create_notifications_table.sql
psql -U postgres -d porcicultura -f alter_calendar_events_add_time.sql
psql -U postgres -d porcicultura -f add_birth_date_check.sql
```

### Opción 3: Desde pgAdmin o DBeaver

1. Abre pgAdmin o DBeaver
2. Conecta a tu base de datos `porcicultura`
3. Ejecuta los archivos **EN ESTE ORDEN**:
   - ✅ `create_users_table.sql`
   - ✅ `create_password_reset_tokens.sql`
   - ✅ `create_notifications_table.sql`
   - ✅ `alter_calendar_events_add_time.sql`
   - ✅ `add_birth_date_check.sql`

## 📁 Archivos de Migración

| Archivo | Descripción | Dependencias |
|---------|-------------|--------------|
| `create_users_table.sql` | Crea la tabla de usuarios | Ninguna |
| `create_password_reset_tokens.sql` | Tokens para recuperación de contraseña | `users` |
| `create_notifications_table.sql` | Sistema de notificaciones | `users` |
| `alter_calendar_events_add_time.sql` | Añade columna de hora a eventos | `calendar_events` |
| `add_birth_date_check.sql` | Validación de fechas de parto | `births` |

## ⚠️ IMPORTANTE: Orden de Ejecución

**DEBES ejecutar las migraciones en el orden especificado** porque algunas tablas dependen de otras (claves foráneas).

## 🔧 Solución de Problemas

### Error: "no existe la relación «users»"

**Causa**: Intentaste crear una tabla que depende de `users` antes de crearla.

**Solución**:
1. Ejecuta primero `create_users_table.sql`
2. Luego ejecuta las demás migraciones

### Error: "la relación ya existe"

**Causa**: La tabla ya fue creada anteriormente.

**Solución**: Esto es normal, puedes ignorar el error o usar `CREATE TABLE IF NOT EXISTS`.

### Error de autenticación

**Causa**: Credenciales incorrectas de PostgreSQL.

**Solución**: 
- Verifica tu usuario y contraseña
- Verifica que PostgreSQL esté corriendo
- Verifica el nombre de la base de datos

## 📝 Notas

- Todas las migraciones usan `CREATE TABLE IF NOT EXISTS` para evitar errores si ya existen
- Los índices también usan `IF NOT EXISTS`
- Es seguro ejecutar las migraciones múltiples veces

## 🎯 Después de Ejecutar

Una vez completadas las migraciones:

1. Reinicia el servidor backend:
   ```bash
   cd backend
   npm run dev
   ```

2. El sistema de notificaciones se activará automáticamente

3. Verifica en la consola que aparezcan estos mensajes:
   ```
   ✅ Job de notificaciones activado (se ejecuta cada 6 horas)
   🔔 === Iniciando generación de notificaciones ===
   ```

## 📞 Soporte

Si encuentras problemas, verifica:
- PostgreSQL está corriendo
- La base de datos `porcicultura` existe
- Tienes permisos suficientes
- Ejecutaste las migraciones en orden

