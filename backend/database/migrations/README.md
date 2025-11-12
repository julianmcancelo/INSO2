# 📋 Migraciones de Base de Datos

## 🚨 Error en Producción

Si estás viendo el error `Unknown column 'local.datosBancarios'` en producción, necesitas ejecutar las migraciones pendientes.

## 📝 Migraciones Disponibles

### 001 - Actualizar campos Base64 a LONGTEXT
- **Archivo**: `001_update_base64_fields_to_longtext.sql`
- **Descripción**: Cambia los campos de imágenes Base64 de TEXT a LONGTEXT para soportar imágenes más grandes
- **Tablas afectadas**: `productos`, `locales`, `categorias`, `pedidos`

### 002 - Agregar campo datosBancarios
- **Archivo**: `002_add_datosBancarios_to_locales.sql`
- **Descripción**: Agrega el campo JSON `datosBancarios` a la tabla `locales`
- **Tablas afectadas**: `locales`

## 🚀 Cómo Aplicar Migraciones en Producción

### ⚠️ IMPORTANTE: Base de Datos en Producción

**Producción usa Neon (PostgreSQL)**, no MySQL. Usa el archivo correcto:
- ✅ **Para Producción (Neon/PostgreSQL)**: `PRODUCTION_MIGRATION_POSTGRESQL.sql`
- ❌ **Para Desarrollo (MySQL)**: `PRODUCTION_MIGRATION.sql`

### Opción 1: Desde Neon Dashboard (RECOMENDADO)

1. **Acceder a Neon Console**
   - Ve a https://console.neon.tech/
   - Inicia sesión con tu cuenta
   - Selecciona tu proyecto

2. **Abrir SQL Editor**
   - Click en "SQL Editor" en el menú lateral
   - O ve directamente a la pestaña "SQL Editor"

3. **Ejecutar las migraciones**
   - Copia el contenido completo de `PRODUCTION_MIGRATION_POSTGRESQL.sql`
   - Pégalo en el editor
   - Click en "Run" o presiona Ctrl+Enter
   - Espera a que se ejecute completamente

### Opción 2: Desde terminal con psql

1. **Obtener la connection string de Neon**
   - En Neon Dashboard → "Connection Details"
   - Copia la "Connection string"

2. **Conectar y ejecutar**
   ```bash
   psql "postgresql://[user]:[password]@[host]/[database]?sslmode=require" -f PRODUCTION_MIGRATION_POSTGRESQL.sql
   ```

### Opción 3: Desde Render Dashboard

1. Ve a tu servicio de base de datos en Render
2. Si tienes acceso a Shell/Console PostgreSQL
3. Copia y pega el contenido de `PRODUCTION_MIGRATION_POSTGRESQL.sql`
4. Ejecuta

### Opción 2: Ejecutar migraciones individuales

Ejecutar en orden:
```sql
-- 1. Actualizar campos Base64
source 001_update_base64_fields_to_longtext.sql;

-- 2. Agregar datosBancarios
source 002_add_datosBancarios_to_locales.sql;
```

### Opción 3: Desde Render Dashboard

1. Ve a tu servicio de base de datos en Render
2. Click en "Shell" o "Console"
3. Copia y pega el contenido de `PRODUCTION_MIGRATION.sql`
4. Ejecuta

## ✅ Verificación

Después de ejecutar las migraciones, verifica que se aplicaron correctamente:

### Para PostgreSQL (Producción):
```sql
-- Ver estructura de tablas
\d productos
\d locales
\d categorias
\d pedidos

-- Verificar datosBancarios específicamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'locales' AND column_name = 'datosBancarios';
```

### Para MySQL (Desarrollo):
```sql
-- Verificar campos LONGTEXT
DESCRIBE productos;
DESCRIBE locales;
DESCRIBE categorias;
DESCRIBE pedidos;

-- Verificar datosBancarios
SHOW COLUMNS FROM locales LIKE 'datosBancarios';
```

## 🔄 Después de Aplicar Migraciones

1. **Reiniciar el backend en Render.com**
   - Ve a tu servicio de backend
   - Click en "Manual Deploy" → "Deploy latest commit"
   - O simplemente espera a que se reinicie automáticamente

2. **Verificar que funciona**
   - Intenta hacer login en https://www.cartita.digital/admin
   - Si funciona, las migraciones se aplicaron correctamente ✅

## 📞 Soporte

Si tienes problemas:
1. Verifica que estás conectado a la base de datos correcta
2. Asegúrate de tener permisos de ALTER TABLE
3. Revisa los logs de error de MySQL
4. Si una columna ya existe, comenta esa línea en el script

## 🔒 Seguridad

- ⚠️ **SIEMPRE haz backup antes de ejecutar migraciones en producción**
- ⚠️ **No compartas las credenciales de la base de datos**
- ⚠️ **Ejecuta las migraciones en horarios de bajo tráfico**

## 📚 Historial de Migraciones

| # | Fecha | Descripción | Estado |
|---|-------|-------------|--------|
| 001 | 2025-11-11 | Campos Base64 a LONGTEXT | ✅ Aplicada |
| 002 | 2025-11-11 | Campo datosBancarios | ⏳ Pendiente en producción |
