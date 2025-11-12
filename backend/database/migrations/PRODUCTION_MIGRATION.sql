-- ========================================
-- MIGRACIONES PARA PRODUCCIÓN
-- Fecha: 2025-11-11
-- ========================================

-- IMPORTANTE: Ejecutar estas migraciones en el orden indicado
-- en la base de datos de producción (Render.com)

-- ========================================
-- MIGRACIÓN 1: Actualizar campos Base64 a LONGTEXT
-- ========================================

-- Tabla: productos
ALTER TABLE productos 
MODIFY COLUMN imagenBase64 LONGTEXT 
COMMENT 'Imagen del producto en Base64';

-- Tabla: locales
ALTER TABLE locales 
MODIFY COLUMN logoBase64 LONGTEXT 
COMMENT 'Logo en formato Base64';

-- Tabla: categorias
ALTER TABLE categorias 
MODIFY COLUMN iconoBase64 LONGTEXT 
COMMENT 'Icono de la categoría en Base64';

-- Tabla: pedidos
ALTER TABLE pedidos 
MODIFY COLUMN comprobanteTransferencia LONGTEXT 
COMMENT 'Imagen del comprobante de transferencia en Base64';

-- ========================================
-- MIGRACIÓN 2: Agregar campo datosBancarios
-- ========================================

-- Verificar si la columna ya existe antes de agregarla
-- Si ya existe, esta línea dará error pero no afectará el resto

ALTER TABLE locales 
ADD COLUMN IF NOT EXISTS datosBancarios JSON NULL 
COMMENT 'Datos bancarios para transferencias (CBU, Alias, Titular, Banco)';

-- Si tu versión de MySQL no soporta "IF NOT EXISTS", usa este código alternativo:
-- ALTER TABLE locales ADD COLUMN datosBancarios JSON NULL COMMENT 'Datos bancarios para transferencias';

-- ========================================
-- VERIFICACIÓN
-- ========================================

-- Verificar campos LONGTEXT
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM 
    INFORMATION_SCHEMA.COLUMNS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND COLUMN_NAME IN ('imagenBase64', 'logoBase64', 'iconoBase64', 'comprobanteTransferencia')
ORDER BY 
    TABLE_NAME, COLUMN_NAME;

-- Verificar campo datosBancarios
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_COMMENT
FROM 
    INFORMATION_SCHEMA.COLUMNS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'locales'
    AND COLUMN_NAME = 'datosBancarios';

-- ========================================
-- NOTAS IMPORTANTES
-- ========================================

/*
1. Ejecutar estas migraciones en la base de datos de producción
2. Hacer backup antes de ejecutar
3. Si alguna columna ya existe, comentar esa línea
4. Verificar que todas las migraciones se ejecutaron correctamente
5. Reiniciar el servicio de backend en Render.com después de aplicar las migraciones
*/
