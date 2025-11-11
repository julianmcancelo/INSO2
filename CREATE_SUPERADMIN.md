# 👤 Crear Usuario Superadmin en Producción

Después de desplegar el backend en Railway, necesitas crear tu primer usuario superadmin.

## 🎯 Opción 1: Usar el Endpoint de Setup (Recomendado)

Si tu aplicación tiene el endpoint de setup habilitado:

### 1. Verificar si Setup está disponible

```bash
curl https://tu-backend.railway.app/api/setup/check
```

Si responde `{"setupNeeded": true}`, puedes usar el setup.

### 2. Crear Superadmin vía Setup

```bash
curl -X POST https://tu-backend.railway.app/api/setup \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Tu Nombre",
    "email": "tu-email@ejemplo.com",
    "password": "tu-password-seguro"
  }'
```

---

## 🎯 Opción 2: Desde Railway CLI

### 1. Instalar Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login en Railway

```bash
railway login
```

### 3. Conectar a tu Proyecto

```bash
railway link
```

### 4. Conectar a MySQL

```bash
railway connect MySQL
```

### 5. Crear Usuario

```sql
-- Primero, genera un hash de password
-- Usa bcrypt con 10 rounds
-- Password: "admin123" → Hash: $2b$10$rGfJ8K9...

INSERT INTO usuarios (
  nombre, 
  email, 
  password, 
  rol, 
  localId, 
  activo, 
  createdAt, 
  updatedAt
) VALUES (
  'Admin Principal',
  'admin@cartita.com',
  '$2b$10$rGfJ8K9yLZvXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx',
  'superadmin',
  NULL,
  1,
  NOW(),
  NOW()
);
```

---

## 🎯 Opción 3: Script Node.js

### 1. Crear archivo `create-admin.js`

```javascript
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'tu-password-aqui';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash generado:');
  console.log(hash);
}

generateHash();
```

### 2. Ejecutar

```bash
node create-admin.js
```

### 3. Usar el hash en SQL

Copia el hash generado y úsalo en la query de INSERT de la Opción 2.

---

## 🎯 Opción 4: Desde Railway Dashboard

### 1. Abrir Railway Dashboard

1. Ve a tu proyecto en Railway
2. Click en el servicio MySQL
3. Click en "Data" tab

### 2. Ejecutar Query

```sql
INSERT INTO usuarios (
  nombre, 
  email, 
  password, 
  rol, 
  localId, 
  activo, 
  createdAt, 
  updatedAt
) VALUES (
  'Admin',
  'admin@cartita.com',
  -- Usa un hash bcrypt válido aquí
  '$2b$10$ejemplo...',
  'superadmin',
  NULL,
  1,
  NOW(),
  NOW()
);
```

---

## 🔐 Generar Hash de Password

### Opción A: Online (NO recomendado para producción)

https://bcrypt-generator.com/
- Rounds: 10
- Password: tu-password

### Opción B: Node.js (Recomendado)

```javascript
// En tu terminal local
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('tu-password', 10).then(console.log)"
```

### Opción C: Desde el Backend

Agrega temporalmente este endpoint en tu backend:

```javascript
// backend/src/routes/temp.js
router.post('/generate-hash', async (req, res) => {
  const { password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  res.json({ hash });
});
```

Luego:
```bash
curl -X POST https://tu-backend.railway.app/api/temp/generate-hash \
  -H "Content-Type: application/json" \
  -d '{"password": "tu-password"}'
```

**⚠️ IMPORTANTE**: Elimina este endpoint después de usarlo.

---

## ✅ Verificar que Funciona

### 1. Intentar Login

Ve a: `https://tu-app.vercel.app/admin/login`

Usa las credenciales que creaste:
- Email: `admin@cartita.com`
- Password: `tu-password`

### 2. Verificar en la Base de Datos

```sql
SELECT id, nombre, email, rol, activo 
FROM usuarios 
WHERE rol = 'superadmin';
```

---

## 🎉 ¡Listo!

Ahora tienes tu usuario superadmin y puedes:

1. Iniciar sesión en el panel de admin
2. Crear locales
3. Invitar otros administradores
4. Configurar tu menú

---

## 🐛 Troubleshooting

### "Invalid credentials"

- Verifica que el hash de password sea correcto
- Verifica que el email sea exactamente el mismo
- Verifica que `activo = 1`

### "User not found"

- Verifica que el usuario se insertó correctamente
- Ejecuta: `SELECT * FROM usuarios;`

### "Cannot connect to database"

- Verifica que las variables de entorno en Railway estén correctas
- Revisa los logs del backend
