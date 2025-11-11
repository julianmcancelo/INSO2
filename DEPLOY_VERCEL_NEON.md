# 🚀 Despliegue Completo: Vercel + Neon

## Arquitectura Simple

```
┌─────────────────────────┐      ┌─────────────┐
│       Vercel            │ ───> │    Neon     │
│  Frontend + Backend API │      │ PostgreSQL  │
└─────────────────────────┘      └─────────────┘
```

**Todo en un solo lugar** - Vercel maneja frontend y backend juntos.

---

## ✅ Paso 1: Ya tienes Neon configurado

Tu base de datos está lista:
```
DATABASE_URL=postgresql://neondb_owner:npg_rsp0hYgDP9uU@ep-delicate-brook-ahuc3vqf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## 📋 Paso 2: Preparar para Vercel

### 2.1 Generar JWT Secret

```powershell
node generate-jwt-secret.js
```

Copia el resultado, lo necesitarás para Vercel.

### 2.2 Subir a GitHub

```bash
git add .
git commit -m "Configurado para Vercel + Neon"
git push origin main
```

---

## 📋 Paso 3: Desplegar en Vercel

### 3.1 Ir a Vercel

1. Ve a https://vercel.com/new
2. Importa tu repositorio de GitHub
3. Selecciona el proyecto `INSO2`

### 3.2 Configurar Proyecto

- **Project Name**: `cartita`
- **Framework Preset**: `Other` (porque tenemos frontend + backend)
- **Root Directory**: Dejar vacío (usará la raíz)
- **Build Command**: Dejar por defecto
- **Output Directory**: Dejar por defecto

### 3.3 Configurar Variables de Entorno

Click en "Environment Variables" y agrega:

```env
# Base de Datos Neon
DATABASE_URL=postgresql://neondb_owner:npg_rsp0hYgDP9uU@ep-delicate-brook-ahuc3vqf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# JWT Secret (el que generaste)
JWT_SECRET=tu-secret-generado-aqui

# Node Environment
NODE_ENV=production

# Frontend URL (la URL de Vercel, la obtendrás después del deploy)
FRONTEND_URL=https://tu-app.vercel.app

# React App URLs (apuntan a la misma app de Vercel)
REACT_APP_API_URL=https://tu-app.vercel.app
REACT_APP_SOCKET_URL=https://tu-app.vercel.app
```

**Nota**: Primero pon URLs temporales, las actualizarás después del primer deploy.

### 3.4 Deploy

Click en **"Deploy"** y espera (3-5 minutos).

---

## 📋 Paso 4: Actualizar URLs

### 4.1 Obtener URL de Vercel

Después del deploy, Vercel te dará una URL como:
```
https://cartita-abc123.vercel.app
```

### 4.2 Actualizar Variables de Entorno

1. Ve a Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
2. Actualiza estas variables con tu URL real:

```env
FRONTEND_URL=https://cartita-abc123.vercel.app
REACT_APP_API_URL=https://cartita-abc123.vercel.app
REACT_APP_SOCKET_URL=https://cartita-abc123.vercel.app
```

3. Click en "Redeploy" para aplicar los cambios

---

## 📋 Paso 5: Crear Usuario Superadmin

### Opción 1: Desde Neon Dashboard

1. Ve a https://console.neon.tech
2. Selecciona tu proyecto
3. Ve a "SQL Editor"
4. Ejecuta:

```sql
-- Primero genera un hash de password en: https://bcrypt-generator.com/
-- Password sugerido: admin123
-- Rounds: 10

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
  '$2b$10$ejemplo-hash-aqui',
  'superadmin',
  NULL,
  true,
  NOW(),
  NOW()
);
```

### Opción 2: Usar endpoint de setup

Si tu app tiene el endpoint de setup:

```bash
curl -X POST https://tu-app.vercel.app/api/setup \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin",
    "email": "admin@cartita.com",
    "password": "admin123"
  }'
```

---

## ✅ Verificación Final

### Checklist

- [ ] Código subido a GitHub
- [ ] Proyecto desplegado en Vercel
- [ ] Variables de entorno configuradas
- [ ] URLs actualizadas
- [ ] Usuario superadmin creado
- [ ] Login funciona

### Probar la Aplicación

1. Ve a `https://tu-app.vercel.app`
2. Deberías ver la landing page
3. Ve a `https://tu-app.vercel.app/admin/login`
4. Login con:
   - Email: `admin@cartita.com`
   - Password: `admin123`
5. Deberías ver el dashboard

---

## 🎉 ¡Listo!

Tu aplicación está completamente en producción con:

- ✅ **Frontend**: React en Vercel
- ✅ **Backend**: API Serverless en Vercel
- ✅ **Base de Datos**: PostgreSQL en Neon
- ✅ **SSL**: Gratis automático
- ✅ **CDN**: Global de Vercel
- ✅ **Escalado**: Automático

### Tu URL Final

```
https://tu-app.vercel.app
```

---

## 💡 Ventajas de Vercel + Neon

1. **Todo en un lugar**: Un solo deploy para frontend y backend
2. **Serverless**: Solo pagas por uso real
3. **Global**: CDN en todo el mundo
4. **Cero configuración**: Vercel detecta todo automáticamente
5. **CI/CD**: Deploy automático con cada push a GitHub
6. **Gratis**: Plan hobby de Vercel + plan gratuito de Neon

---

## 🔧 Comandos Útiles

```bash
# Ver deployments
vercel ls

# Ver logs
vercel logs

# Deploy manual
vercel --prod

# Conectar a Neon
psql postgresql://neondb_owner:npg_rsp0hYgDP9uU@ep-delicate-brook-ahuc3vqf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## 🐛 Troubleshooting

### "Build Failed"

Revisa los logs en Vercel Dashboard → Deployments → Build Logs

### "API calls failing"

1. Verifica que `REACT_APP_API_URL` apunte a tu dominio de Vercel
2. Verifica que `DATABASE_URL` esté correcta
3. Revisa los logs de funciones en Vercel

### "Database connection error"

1. Verifica que `DATABASE_URL` tenga `?sslmode=require` al final
2. Verifica que la URL sea la versión con `-pooler` (mejor rendimiento)

---

## 📞 Próximos Pasos

1. **Dominio Personalizado**: Settings → Domains en Vercel
2. **Monitoreo**: Habilita Analytics en Vercel
3. **Backups**: Neon hace backups automáticos
4. **Escalado**: Automático, no necesitas hacer nada

¡Tu aplicación está lista para recibir usuarios! 🎊
