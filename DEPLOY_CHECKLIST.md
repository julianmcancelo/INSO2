# ✅ Checklist de Despliegue - Cartita

## 📦 Preparación

- [ ] Código subido a GitHub
- [ ] Cuenta en Railway creada
- [ ] Cuenta en Vercel creada
- [ ] Tarjeta de crédito agregada en Railway (para verificación)

---

## 🚂 Railway - Backend + Base de Datos

### Base de Datos MySQL

- [ ] Crear proyecto en Railway
- [ ] Agregar servicio MySQL
- [ ] Anotar credenciales de la base de datos
- [ ] Verificar que la BD esté corriendo

### Backend (Node.js)

- [ ] Conectar repositorio de GitHub
- [ ] Configurar Root Directory: `backend`
- [ ] Configurar Start Command: `npm start`
- [ ] Agregar variables de entorno:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
  - [ ] `DB_DIALECT=mysql`
  - [ ] `DB_HOST=${{MySQL.MYSQL_HOST}}`
  - [ ] `DB_PORT=${{MySQL.MYSQL_PORT}}`
  - [ ] `DB_USER=${{MySQL.MYSQL_USER}}`
  - [ ] `DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}`
  - [ ] `DB_NAME=${{MySQL.MYSQL_DATABASE}}`
  - [ ] `JWT_SECRET=[generar secreto seguro]`
  - [ ] `FRONTEND_URL=[se configurará después]`
- [ ] Esperar a que el deploy termine
- [ ] Generar dominio público
- [ ] Anotar URL del backend: `https://_____.up.railway.app`
- [ ] Probar health check: `curl https://_____.up.railway.app/health`
- [ ] Verificar logs (sin errores)

---

## ☁️ Vercel - Frontend

### Configuración del Proyecto

- [ ] Ir a https://vercel.com/new
- [ ] Importar repositorio de GitHub
- [ ] Configurar proyecto:
  - [ ] Project Name: `cartita`
  - [ ] Framework Preset: `Create React App`
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `build`

### Variables de Entorno

- [ ] Agregar `REACT_APP_API_URL=[URL de Railway]`
- [ ] Agregar `REACT_APP_SOCKET_URL=[URL de Railway]`

### Deploy

- [ ] Click en "Deploy"
- [ ] Esperar a que termine (2-3 min)
- [ ] Anotar URL de Vercel: `https://_____.vercel.app`
- [ ] Verificar que la app carga

---

## 🔄 Configuración Post-Despliegue

### Actualizar CORS

- [ ] En Railway → Backend → Variables
- [ ] Actualizar `FRONTEND_URL` con la URL de Vercel
- [ ] Esperar a que el backend se redeploy automáticamente

### Verificar Conectividad

- [ ] Abrir la app en Vercel
- [ ] Abrir DevTools (F12) → Console
- [ ] No debe haber errores de CORS
- [ ] Verificar que Socket.IO conecta

---

## 🧪 Pruebas Funcionales

### Login

- [ ] Ir a `/admin/login`
- [ ] Intentar login con credenciales
- [ ] Verificar que redirige a `/admin`
- [ ] Verificar que el token se guarda

### Crear Usuario Superadmin

Si no tienes usuario, créalo desde Railway:

```bash
# Conectar a la BD desde Railway CLI
railway connect MySQL

# Ejecutar:
INSERT INTO usuarios (nombre, email, password, rol, activo, createdAt, updatedAt)
VALUES ('Admin', 'admin@cartita.com', '$2b$10$...', 'superadmin', 1, NOW(), NOW());
```

O usa el endpoint de setup si está disponible.

### Funcionalidades

- [ ] Login funciona
- [ ] Dashboard carga
- [ ] Crear categoría funciona
- [ ] Crear producto funciona
- [ ] Ver menú público funciona
- [ ] Crear pedido funciona
- [ ] Notificaciones en tiempo real funcionan
- [ ] Modo mantenimiento funciona

---

## 🎨 Configuración Opcional

### Dominio Personalizado

#### Vercel
- [ ] Ir a Settings → Domains
- [ ] Agregar dominio personalizado
- [ ] Configurar DNS según instrucciones

#### Railway
- [ ] Ir a Settings → Networking → Custom Domain
- [ ] Agregar dominio
- [ ] Configurar DNS

### Monitoreo

- [ ] Configurar alertas en Railway
- [ ] Habilitar Analytics en Vercel
- [ ] Configurar Sentry (opcional)

### Backups

- [ ] Configurar backups automáticos de MySQL en Railway
- [ ] Exportar datos importantes regularmente

---

## 📊 URLs Finales

Anota aquí tus URLs de producción:

```
Frontend (Vercel): https://_____________________.vercel.app
Backend (Railway):  https://_____________________.up.railway.app
Base de Datos:      [ver en Railway Variables]

Dominio Custom (opcional):
Frontend: https://_____________________
Backend:  https://_____________________
```

---

## 🐛 Troubleshooting

### Si algo falla:

1. **Revisar logs en Railway**: Railway Dashboard → Logs
2. **Revisar logs en Vercel**: Vercel Dashboard → Deployments → Logs
3. **Revisar consola del navegador**: F12 → Console
4. **Verificar variables de entorno**: Asegúrate de que estén bien configuradas
5. **Verificar CORS**: El error más común

### Comandos Útiles

```bash
# Ver logs de Railway
railway logs

# Ver variables de Railway
railway variables

# Redeploy en Railway
railway up

# Ver deployments de Vercel
vercel ls

# Ver logs de Vercel
vercel logs [deployment-url]
```

---

## ✨ ¡Listo!

Una vez completado este checklist, tu aplicación estará en producción y lista para usar.

**Próximos pasos:**
1. Crear tu primer local
2. Configurar productos y categorías
3. Generar código QR
4. ¡Empezar a recibir pedidos!

🎉 **¡Felicitaciones por tu despliegue!**
