# ============================================================================
# SCRIPT DE MIGRACIONES PARA WINDOWS POWERSHELL
# ============================================================================
# Este script ejecuta todas las migraciones en orden
# Uso: .\run_migrations.ps1
# ============================================================================

Write-Host "🚀 Iniciando migraciones..." -ForegroundColor Green
Write-Host ""

# Configuración de la base de datos
$DB_USER = "postgres"
$DB_NAME = "porcicultura"
$DB_HOST = "localhost"
$DB_PORT = "5432"

Write-Host "Configuración:" -ForegroundColor Yellow
Write-Host "  Usuario: $DB_USER"
Write-Host "  Base de datos: $DB_NAME"
Write-Host "  Host: $DB_HOST"
Write-Host "  Puerto: $DB_PORT"
Write-Host ""

# Función para ejecutar un archivo SQL
function Execute-SqlFile {
    param (
        [string]$FilePath,
        [string]$Description
    )
    
    Write-Host "📝 $Description..." -ForegroundColor Cyan
    
    try {
        $env:PGPASSWORD = Read-Host "Ingresa la contraseña de PostgreSQL" -AsSecureString
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:PGPASSWORD)
        $PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
        $env:PGPASSWORD = $PlainPassword
        
        psql -U $DB_USER -d $DB_NAME -h $DB_HOST -p $DB_PORT -f $FilePath
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $Description completado" -ForegroundColor Green
            Write-Host ""
            return $true
        } else {
            Write-Host "❌ Error en $Description" -ForegroundColor Red
            Write-Host ""
            return $false
        }
    }
    catch {
        Write-Host "❌ Error ejecutando $FilePath : $_" -ForegroundColor Red
        return $false
    }
}

# Preguntar contraseña una sola vez
Write-Host "Se te pedirá la contraseña de PostgreSQL una vez..." -ForegroundColor Yellow
$SecurePassword = Read-Host "Contraseña" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword)
$env:PGPASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "  EJECUTANDO MIGRACIONES" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow
Write-Host ""

# Array de migraciones en orden
$migrations = @(
    @{File="create_users_table.sql"; Desc="Creando tabla users"},
    @{File="create_password_reset_tokens.sql"; Desc="Creando tabla password_reset_tokens"},
    @{File="create_notifications_table.sql"; Desc="Creando tabla notifications"},
    @{File="alter_calendar_events_add_time.sql"; Desc="Alterando tabla calendar_events"},
    @{File="add_birth_date_check.sql"; Desc="Agregando check a births"}
)

$success = $true

foreach ($migration in $migrations) {
    $result = Execute-SqlFile -FilePath $migration.File -Description $migration.Desc
    if (-not $result) {
        $success = $false
        Write-Host "⚠️  Continuando con las siguientes migraciones..." -ForegroundColor Yellow
        Write-Host ""
    }
}

# Limpiar variable de entorno
Remove-Item Env:\PGPASSWORD

Write-Host "============================================" -ForegroundColor Yellow
if ($success) {
    Write-Host "🎉 ¡Todas las migraciones completadas!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Algunas migraciones fallaron" -ForegroundColor Yellow
    Write-Host "   Revisa los errores arriba" -ForegroundColor Yellow
}
Write-Host "============================================" -ForegroundColor Yellow

# Pausa para que el usuario pueda ver los resultados
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

