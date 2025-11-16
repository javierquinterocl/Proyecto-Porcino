const cron = require('node-cron');
const pool = require('../config/db');

/**
 * Job que se ejecuta diariamente para actualizar el estado de celos no servidos
 * Se ejecuta todos los días a las 2:00 AM
 */
const heatStatusJob = cron.schedule('0 2 * * *', async () => {
  try {
    console.log('🔄 Ejecutando job: Actualización de estados de celos...');
    
    const result = await pool.query('SELECT * FROM mark_unserved_heats()');
    
    if (result.rows.length > 0) {
      console.log(`✅ Se actualizaron ${result.rows.length} celos a estado "no servido":`);
      result.rows.forEach(row => {
        console.log(`   - Celo ID ${row.heat_id}: Cerda ${row.sow_ear_tag}, Fecha: ${row.heat_date} - ${row.heat_end_date}`);
      });
    } else {
      console.log('✅ No hay celos pendientes de actualizar.');
    }
  } catch (error) {
    console.error('❌ Error en job de actualización de celos:', error);
  }
}, {
  scheduled: false, // No iniciar automáticamente
  timezone: "America/Santiago" // Ajusta a tu zona horaria
});

/**
 * Función para ejecutar manualmente el job (útil para pruebas)
 */
const runNow = async () => {
  try {
    console.log('🔄 Ejecutando manualmente: Actualización de estados de celos...');
    
    const result = await pool.query('SELECT * FROM mark_unserved_heats()');
    
    if (result.rows.length > 0) {
      console.log(`✅ Se actualizaron ${result.rows.length} celos a estado "no servido":`);
      result.rows.forEach(row => {
        console.log(`   - Celo ID ${row.heat_id}: Cerda ${row.sow_ear_tag}, Fecha: ${row.heat_date} - ${row.heat_end_date}`);
      });
      return { success: true, updated: result.rows.length, heats: result.rows };
    } else {
      console.log('✅ No hay celos pendientes de actualizar.');
      return { success: true, updated: 0, heats: [] };
    }
  } catch (error) {
    console.error('❌ Error en job de actualización de celos:', error);
    throw error;
  }
};

module.exports = {
  heatStatusJob,
  runNow
};
