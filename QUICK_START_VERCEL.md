# 🚀 Guía Rápida: Desplegar Cartita en Vercel

## Opción 1: Despliegue Automático (Recomendado)

### 1. Sube tu código a GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/cartita.git
git push -u origin main
```

### 2. Conecta con Vercel

1. Ve a https://vercel.com/new
2. Importa tu repositorio de GitHub
3. Configura el proyecto:
   - **Project Name**: `cartita`
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3. Configura Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables, agrega:

```
REACT_APP_API_URL=https://tu-backend-url.com
REACT_APP_SOCKET_URL=https://tu-backend-url.com
```

### 4. Deploy

Click en **Deploy** y espera a que termine.

---

## Opción 2: Despliegue desde CLI

### 1. Instala Vercel CLI

```powershell
npm install -g vercel
```

### 2. Login

```powershell
vercel login
```

### 3. Ejecuta el Script

```powershell
.\deploy-vercel.ps1
```

O manualmente:

```powershell
cd frontend
npm install
npm run build
cd ..
vercel --prod
```

---

## ⚠️ IMPORTANTE: Antes de Desplegar

### 1. Backend Desplegado

El frontend necesita un backend funcionando. Opciones:

- **Railway** (Recomendado): https://railway.app
  - Soporta Docker
  - Base de datos MySQL incluida
  - Fácil de configurar

- **Render**: https://render.com
  - Plan gratuito disponible
  - Soporta Docker

### 2. Base de Datos en la Nube

No puedes usar la base de datos local de Docker. Opciones:

- **PlanetScale** (Recomendado): https://planetscale.com
  - MySQL compatible
  - Plan gratuito generoso
  
- **Railway MySQL**: Incluido en Railway
- **AWS RDS**: Para producción seria

### 3. Actualizar CORS en Backend

En tu backend, actualiza la configuración de CORS para permitir tu dominio de Vercel:

```javascript
// backend/src/server.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://tu-app.vercel.app',
    'https://cartita.digital'  // Si tienes dominio personalizado
  ],
  credentials: true
}));
```

---

## 📋 Checklist Pre-Despliegue

- [ ] Backend desplegado y funcionando
- [ ] Base de datos en la nube configurada
- [ ] Variables de entorno configuradas en Vercel
- [ ] CORS actualizado en el backend
- [ ] Build local exitoso (`npm run build`)
- [ ] Código subido a GitHub (para auto-deploy)

---

## 🔧 Solución de Problemas

### "Build Failed"
```powershell
# Prueba el build localmente
cd frontend
npm install
npm run build
```

### "API calls failing"
- Verifica que `REACT_APP_API_URL` esté correcta
- Verifica que el backend esté corriendo
- Revisa la configuración de CORS

### "Page not found on refresh"
- Ya está configurado en `vercel.json` con rewrites
- Si persiste, verifica que el archivo esté en la raíz del proyecto

---

## 🎯 Próximos Pasos

Después del despliegue:

1. **Dominio Personalizado**: Vercel → Settings → Domains
2. **SSL**: Automático con Vercel
3. **Analytics**: Vercel → Analytics
4. **Monitoring**: Configura alertas en Vercel

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel Dashboard
2. Verifica la consola del navegador (F12)
3. Revisa los logs del backend

¡Buena suerte con tu despliegue! 🚀
