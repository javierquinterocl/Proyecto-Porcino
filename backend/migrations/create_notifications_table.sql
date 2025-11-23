-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'calendar', 'heat', 'birth', 'pregnancy', 'service', 'system'
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  is_read BOOLEAN DEFAULT FALSE,
  reference_type VARCHAR(50), -- 'calendar_event', 'heat', 'birth', 'pregnancy', 'service', 'sow', 'boar'
  reference_id INTEGER, -- ID del registro relacionado
  action_url VARCHAR(500), -- URL para ir al detalle
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP,
  expires_at TIMESTAMP -- Para notificaciones temporales
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_reference ON notifications(reference_type, reference_id);

-- Comentarios de la tabla
COMMENT ON TABLE notifications IS 'Almacena las notificaciones del sistema para los usuarios';
COMMENT ON COLUMN notifications.type IS 'Tipo de notificación: calendar, heat, birth, pregnancy, service, system';
COMMENT ON COLUMN notifications.priority IS 'Prioridad: low, normal, high, urgent';
COMMENT ON COLUMN notifications.reference_type IS 'Tipo de entidad relacionada';
COMMENT ON COLUMN notifications.reference_id IS 'ID de la entidad relacionada';
COMMENT ON COLUMN notifications.action_url IS 'URL relativa para navegar al detalle';
COMMENT ON COLUMN notifications.expires_at IS 'Fecha de expiración para notificaciones temporales';

