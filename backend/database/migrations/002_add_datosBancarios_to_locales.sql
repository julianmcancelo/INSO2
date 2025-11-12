-- Migración: Agregar campo datosBancarios a la tabla locales
-- Fecha: 2025-11-11
-- Descripción: Agregar campo JSON para almacenar datos bancarios del local
--              (CBU, Alias, Titular, Banco, Tipo de Cuenta, CUIT)

-- Agregar columna datosBancarios
ALTER TABLE locales 
ADD COLUMN datosBancarios JSON NULL 
COMMENT 'Datos bancarios para transferencias (CBU, Alias, Titular, Banco)';

-- Verificación
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_COMMENT
FROM 
    INFORMATION_SCHEMA.COLUMNS
WHERE 
    TABLE_SCHEMA = 'menu_digital'
    AND TABLE_NAME = 'locales'
    AND COLUMN_NAME = 'datosBancarios';
