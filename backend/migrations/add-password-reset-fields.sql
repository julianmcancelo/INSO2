-- Agregar campos para recuperación de contraseña a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS "resetPasswordToken" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "resetPasswordExpires" TIMESTAMP WITH TIME ZONE;

-- Crear índice para mejorar búsquedas por token
CREATE INDEX IF NOT EXISTS idx_usuarios_reset_token ON usuarios("resetPasswordToken");
