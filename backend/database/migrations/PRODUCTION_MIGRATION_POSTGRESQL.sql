-- ========================================
-- MIGRACIONES PARA PRODUCCIÓN (POSTGRESQL/NEON)
-- Fecha: 2025-11-11
-- ========================================

-- IMPORTANTE: Ejecutar estas migraciones en el orden indicado
-- en la base de datos de producción (Neon/PostgreSQL en Render.com)

-- ========================================
-- MIGRACIÓN 1: Actualizar campos Base64 a TEXT (PostgreSQL no tiene LONGTEXT)
-- ========================================

-- En PostgreSQL, TEXT no tiene límite de tamaño, así que no necesitamos cambiar nada
-- Pero verificamos que los campos existan y sean TEXT

-- Si los campos son VARCHAR, cambiarlos a TEXT:

-- Tabla: productos
ALTER TABLE productos 
ALTER COLUMN "imagenBase64" TYPE TEXT;

-- Tabla: locales
ALTER TABLE locales 
ALTER COLUMN "logoBase64" TYPE TEXT;

-- Tabla: categorias
ALTER TABLE categorias 
ALTER COLUMN "iconoBase64" TYPE TEXT;

-- Tabla: pedidos
ALTER TABLE pedidos 
ALTER COLUMN "comprobanteTransferencia" TYPE TEXT;

-- ========================================
-- MIGRACIÓN 2: Agregar campo datosBancarios
-- ========================================

-- Verificar si la columna ya existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'locales' 
        AND column_name = 'datosBancarios'
    ) THEN
        ALTER TABLE locales 
        ADD COLUMN "datosBancarios" JSONB NULL;
        
        COMMENT ON COLUMN locales."datosBancarios" IS 'Datos bancarios para transferencias (CBU, Alias, Titular, Banco)';
    END IF;
END $$;

-- ========================================
-- VERIFICACIÓN
-- ========================================

-- Verificar campos TEXT
SELECT 
    table_name,
    column_name,
    data_type,
    character_maximum_length
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND column_name IN ('imagenBase64', 'logoBase64', 'iconoBase64', 'comprobanteTransferencia')
ORDER BY 
    table_name, column_name;

-- Verificar campo datosBancarios
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'locales'
    AND column_name = 'datosBancarios';

-- Ver estructura completa de la tabla locales
\d locales;

-- ========================================
-- NOTAS IMPORTANTES PARA POSTGRESQL/NEON
-- ========================================

/*
1. PostgreSQL usa JSONB en lugar de JSON (más eficiente)
2. Los nombres de columnas en PostgreSQL son case-sensitive si están entre comillas
3. TEXT en PostgreSQL no tiene límite de tamaño (equivalente a LONGTEXT de MySQL)
4. Hacer backup antes de ejecutar
5. Ejecutar desde psql o desde el dashboard de Neon
6. Reiniciar el servicio de backend en Render.com después de aplicar las migraciones

CÓMO EJECUTAR EN NEON:
1. Ve a https://console.neon.tech/
2. Selecciona tu proyecto
3. Ve a "SQL Editor"
4. Copia y pega este script
5. Ejecuta

ALTERNATIVA - Desde terminal:
psql "postgresql://[user]:[password]@[host]/[database]?sslmode=require" -f PRODUCTION_MIGRATION_POSTGRESQL.sql
*/
