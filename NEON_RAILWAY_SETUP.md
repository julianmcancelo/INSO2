# 🚀 Configuración Rápida: Neon + Railway

## ✅ Ya tienes Neon configurado

Tu base de datos Neon está lista en:
- **Host**: `ep-delicate-brook-ahuc3vqf-pooler.c-3.us-east-1.aws.neon.tech`
- **Database**: `neondb`
- **User**: `neondb_owner`

---

## 📋 Paso 1: Configurar Variables en Railway

### 1.1 Ir a Railway

1. Ve a https://railway.app
2. Crea un nuevo proyecto
3. Conecta tu repositorio de GitHub

### 1.2 Agregar Variables de Entorno

En Railway → Tu Proyecto → Variables, agrega:

```env
# Base de Datos Neon (USA ESTA - Con Pooler)
DATABASE_URL=postgresql://neondb_owner:npg_rsp0hYgDP9uU@ep-delicate-brook-ahuc3vqf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# Node
NODE_ENV=production
PORT=5000

# JWT (Genera uno seguro con: node generate-jwt-secret.js)
JWT_SECRET=GENERA_UNO_NUEVO_AQUI

# Frontend (Actualizar después con URL de Vercel)
FRONTEND_URL=https://tu-app.vercel.app
```

### 1.3 Configurar Build

- **Root Directory**: `backend`
- **Start Command**: `npm start`

---

## 📋 Paso 2: Probar Localmente con Neon

### 2.1 Copiar archivo de configuración

```powershell
# En la carpeta backend
cp .env.neon .env
```

### 2.2 Generar JWT Secret

```powershell
node ../generate-jwt-secret.js
```

Copia el resultado y actualízalo en `.env`

### 2.3 Iniciar Backend

```powershell
cd backend
npm run dev
```

Deberías ver:
```
✅ Conexión a PostgreSQL establecida correctamente
✅ Modelos sincronizados con la base de datos
🚀 Servidor corriendo en http://localhost:5000
```

### 2.4 Verificar Conexión

```powershell
curl http://localhost:5000/health
```

---

## 📋 Paso 3: Inicializar Base de Datos

### 3.1 Crear Primer Usuario Superadmin

El backend creará las tablas automáticamente con Sequelize. Para crear tu primer usuario:

**Opción 1: Usar endpoint de setup** (si está disponible)

```powershell
curl -X POST http://localhost:5000/api/setup `
  -H "Content-Type: application/json" `
  -d '{
    "nombre": "Admin",
    "email": "admin@cartita.com",
    "password": "admin123"
  }'
```

**Opción 2: Desde Neon Dashboard**

1. Ve a https://console.neon.tech
2. Selecciona tu proyecto
3. Ve a "SQL Editor"
4. Ejecuta:

```sql
-- Primero genera un hash de password
-- Usa: https://bcrypt-generator.com/ con rounds=10
-- Password: admin123

INSERT INTO usuarios (
  nombre, 
  email, 
  password, 
  rol, 
  "localId", 
  activo, 
  "createdAt", 
  "updatedAt"
) VALUES (
  'Admin Principal',
  'admin@cartita.com',
  '$2b$10$rGfJ8K9yLZvXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx',
  'superadmin',
  NULL,
  true,
  NOW(),
  NOW()
);
```

---

## 📋 Paso 4: Desplegar en Railway

### 4.1 Push a GitHub

```bash
git add .
git commit -m "Configurado para Neon PostgreSQL"
git push
```

### 4.2 Railway Auto-Deploy

Railway detectará el push y desplegará automáticamente.

### 4.3 Verificar Logs

En Railway Dashboard → Logs, deberías ver:
```
✅ Conexión a PostgreSQL establecida correctamente
✅ Modelos sincronizados
🚀 Servidor corriendo
```

### 4.4 Generar Dominio

1. Railway → Settings → Networking
2. Click "Generate Domain"
3. Anota la URL: `https://tu-backend.up.railway.app`

---

## 📋 Paso 5: Desplegar Frontend en Vercel

### 5.1 Ir a Vercel

1. Ve a https://vercel.com/new
2. Importa tu repositorio
3. Configura:
   - **Root Directory**: `frontend`
   - **Framework**: Create React App

### 5.2 Variables de Entorno en Vercel

```env
REACT_APP_API_URL=https://tu-backend.up.railway.app
REACT_APP_SOCKET_URL=https://tu-backend.up.railway.app
```

### 5.3 Deploy

Click "Deploy" y espera.

---

## 📋 Paso 6: Actualizar CORS

### 6.1 En Railway

Actualiza la variable `FRONTEND_URL` con la URL de Vercel:

```env
FRONTEND_URL=https://tu-app.vercel.app
```

Railway se redesplegaráautomáticamente.

---

## ✅ Verificación Final

### Checklist

- [ ] Backend desplegado en Railway
- [ ] Conectado a Neon PostgreSQL
- [ ] Dominio de Railway generado
- [ ] Frontend desplegado en Vercel
- [ ] Variables de entorno configuradas
- [ ] CORS actualizado
- [ ] Usuario superadmin creado
- [ ] Login funciona

### Probar

1. Ve a `https://tu-app.vercel.app/admin/login`
2. Login con tus credenciales
3. Deberías ver el dashboard

---

## 🎉 ¡Listo!

Tu aplicación está en producción con:
- ✅ Frontend en Vercel (CDN global)
- ✅ Backend en Railway (serverless)
- ✅ Base de datos en Neon (PostgreSQL serverless)

### URLs Importantes

```
Frontend: https://_____.vercel.app
Backend:  https://_____.up.railway.app
Database: Neon Dashboard - https://console.neon.tech
```

---

## 💡 Ventajas de esta Arquitectura

1. **Escalado Automático**: Todo escala según demanda
2. **Costo Eficiente**: Solo pagas por lo que usas
3. **Global**: CDN de Vercel en todo el mundo
4. **Backups**: Neon hace backups automáticos
5. **SSL**: Gratis en todo
6. **CI/CD**: Deploy automático con cada push

---

## 🔧 Comandos Útiles

```bash
# Ver logs de Railway
railway logs

# Conectar a Neon desde CLI
psql postgresql://neondb_owner:npg_rsp0hYgDP9uU@ep-delicate-brook-ahuc3vqf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# Ver deployments de Vercel
vercel ls

# Generar nuevo JWT secret
node generate-jwt-secret.js
```
