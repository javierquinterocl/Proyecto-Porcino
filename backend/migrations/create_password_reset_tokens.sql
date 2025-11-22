-- Tabla para almacenar tokens de recuperación de contraseña
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índice para búsquedas rápidas por token
CREATE INDEX IF NOT EXISTS idx_password_reset_token ON password_reset_tokens(token);

-- Índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_password_reset_user_id ON password_reset_tokens(user_id);

-- Índice para limpiar tokens expirados
CREATE INDEX IF NOT EXISTS idx_password_reset_expires ON password_reset_tokens(expires_at);

-- Comentarios
COMMENT ON TABLE password_reset_tokens IS 'Tabla para almacenar tokens de recuperación de contraseña';
COMMENT ON COLUMN password_reset_tokens.user_id IS 'ID del usuario que solicita recuperación';
COMMENT ON COLUMN password_reset_tokens.token IS 'Token único de recuperación (hash)';
COMMENT ON COLUMN password_reset_tokens.expires_at IS 'Fecha de expiración del token (típicamente 1 hora)';
COMMENT ON COLUMN password_reset_tokens.used_at IS 'Fecha en que se usó el token (NULL si no se ha usado)';
