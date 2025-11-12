-- Migración: Actualizar campos Base64 de TEXT a LONGTEXT
-- Fecha: 2025-11-11
-- Descripción: Aumentar el tamaño de los campos que almacenan imágenes en Base64
--              para soportar imágenes más grandes (de ~65KB a ~4GB)

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

-- Verificación
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM 
    INFORMATION_SCHEMA.COLUMNS
WHERE 
    TABLE_SCHEMA = 'menu_digital'
    AND COLUMN_NAME IN ('imagenBase64', 'logoBase64', 'iconoBase64', 'comprobanteTransferencia')
ORDER BY 
    TABLE_NAME, COLUMN_NAME;
