# 🚂 Guía de Despliegue en Railway - Backend + Base de Datos

## 📋 Requisitos Previos

1. Cuenta en [Railway](https://railway.app)
2. Código en GitHub (recomendado para auto-deploy)
3. Tarjeta de crédito (Railway requiere verificación, pero tiene plan gratuito)

---

## 🎯 Paso 1: Crear Proyecto en Railway

### 1.1 Accede a Railway

1. Ve a https://railway.app
2. Click en **"Start a New Project"**
3. Conecta tu cuenta de GitHub

### 1.2 Crear Base de Datos con Neon

1. Ve a https://neon.tech y crea una cuenta
2. Click en **"Create Project"**
3. Selecciona región (preferiblemente cerca de tu ubicación)
4. Copia la **Connection String** que te da Neon
5. Guárdala, la necesitarás para Railway

---

## 🎯 Paso 2: Desplegar Backend

### 2.1 Agregar Servicio desde GitHub

1. Click en **"+ New"** → **"GitHub Repo"**
2. Selecciona tu repositorio `INSO2`
3. Railway detectará automáticamente el Dockerfile

### 2.2 Configurar Variables de Entorno

En Railway Dashboard → Backend Service → Variables, agrega:

```env
# Node
NODE_ENV=production
PORT=5000

# Base de Datos (Neon PostgreSQL)
# Opción 1: Usar DATABASE_URL (Recomendado)
DATABASE_URL=postgresql://usuario:password@host.neon.tech/dbname?sslmode=require

# Opción 2: Variables individuales
DB_DIALECT=postgres
DB_HOST=tu-proyecto.neon.tech
DB_PORT=5432
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_NAME=neondb

# JWT
JWT_SECRET=tu-secreto-super-seguro-cambiame-en-produccion-12345

# Frontend (lo configuraremos después)
FRONTEND_URL=https://tu-app.vercel.app
```

### 2.3 Configurar Root Directory

1. Ve a **Settings** → **Build**
2. En **Root Directory** pon: `backend`
3. En **Start Command** pon: `npm start`

### 2.4 Deploy

Railway desplegará automáticamente. Espera a que termine (2-5 minutos).

---

## 🎯 Paso 3: Configurar Dominio del Backend

1. Ve a **Settings** → **Networking**
2. Click en **"Generate Domain"**
3. Railway te dará una URL como: `https://tu-backend.up.railway.app`
4. **Guarda esta URL** - la necesitarás para Vercel

---

## 🎯 Paso 4: Inicializar Base de Datos

### 4.1 Conectarse a la Base de Datos

Desde Railway Dashboard → MySQL → Connect:

```bash
# Opción 1: Desde Railway CLI
railway connect MySQL

# Opción 2: MySQL Workbench o cualquier cliente
Host: containers-us-west-xxx.railway.app
Port: xxxx
User: root
Password: [ver en Variables]
Database: railway
```

### 4.2 Ejecutar Script de Inicialización

El backend debería crear las tablas automáticamente con Sequelize, pero si necesitas ejecutar el script manualmente:

```sql
-- El archivo está en backend/database/init.sql
-- Cópialo y ejecútalo en tu cliente MySQL
```

---

## 🎯 Paso 5: Verificar que Funciona

### 5.1 Probar Health Check

```bash
curl https://tu-backend.up.railway.app/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2025-11-11T...",
  "service": "Menu Digital API"
}
```

### 5.2 Ver Logs

En Railway Dashboard → Backend → Logs

---

## 🎯 Paso 6: Desplegar Frontend en Vercel

Ahora que el backend está funcionando, despliega el frontend:

### 6.1 Ir a Vercel

1. Ve a https://vercel.com/new
2. Importa tu repositorio de GitHub
3. Configura:
   - **Project Name**: `cartita`
   - **Framework**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 6.2 Configurar Variables de Entorno en Vercel

```env
REACT_APP_API_URL=https://tu-backend.up.railway.app
REACT_APP_SOCKET_URL=https://tu-backend.up.railway.app
```

### 6.3 Deploy

Click en **Deploy** y espera (2-3 minutos).

---

## 🎯 Paso 7: Actualizar CORS en Backend

### 7.1 Agregar Dominio de Vercel

En Railway → Backend → Variables, actualiza `FRONTEND_URL`:

```env
FRONTEND_URL=https://tu-app.vercel.app
```

### 7.2 Verificar Código CORS

El backend ya debería tener configurado CORS dinámico en `backend/src/server.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

## ✅ Verificación Final

### Checklist

- [ ] Backend desplegado en Railway
- [ ] Base de datos MySQL funcionando
- [ ] Variables de entorno configuradas
- [ ] Dominio del backend generado
- [ ] Frontend desplegado en Vercel
- [ ] Variables de entorno en Vercel configuradas
- [ ] CORS actualizado
- [ ] Login funciona
- [ ] Pedidos funcionan
- [ ] Socket.IO conecta correctamente

### Probar la Aplicación

1. **Frontend**: https://tu-app.vercel.app
2. **Login**: Usa las credenciales del superadmin
3. **Crear Pedido**: Prueba el flujo completo

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to database"

```bash
# Verifica las variables en Railway
railway variables

# Verifica logs
railway logs
```

### Error: "CORS policy"

Asegúrate de que `FRONTEND_URL` en Railway tenga la URL exacta de Vercel (sin barra final).

### Error: "Socket.IO not connecting"

Verifica que `REACT_APP_SOCKET_URL` en Vercel apunte al backend de Railway.

---

## 💰 Costos

### Railway (Plan Gratuito)
- $5 USD de crédito gratis al mes
- Suficiente para desarrollo y pruebas
- Plan Pro: $20/mes para producción

### Vercel (Plan Hobby)
- Gratis para proyectos personales
- 100 GB bandwidth
- Unlimited deployments

---

## 🚀 Próximos Pasos

1. **Dominio Personalizado**: Configura tu dominio en Vercel y Railway
2. **Monitoreo**: Configura alertas en Railway
3. **Backups**: Configura backups automáticos de la BD
4. **CI/CD**: Ya está configurado con GitHub auto-deploy
5. **SSL**: Automático en Railway y Vercel

---

## 📞 Recursos

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [MySQL en Railway](https://docs.railway.app/databases/mysql)

¡Listo! Tu aplicación está en producción 🎉
