# Guía de Despliegue en Vercel

## Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Backend desplegado (Railway, Render, Heroku, etc.)
3. Base de datos MySQL en la nube (PlanetScale, Railway, etc.)

## Pasos para Desplegar

### 1. Preparar el Backend

Antes de desplegar el frontend, necesitas tener el backend funcionando en un servidor. Opciones recomendadas:

- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku**: https://heroku.com
- **DigitalOcean**: https://digitalocean.com

### 2. Configurar Variables de Entorno en Vercel

Una vez que tengas el backend desplegado, necesitarás configurar estas variables:

```
REACT_APP_API_URL=https://tu-backend.railway.app
REACT_APP_SOCKET_URL=https://tu-backend.railway.app
```

### 3. Desplegar en Vercel

#### Opción A: Desde la CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Navegar al directorio del proyecto
cd "c:\Users\Julian Cancelo\Documents\Proyectos\INSO2"

# Hacer login en Vercel
vercel login

# Desplegar
vercel --prod
```

#### Opción B: Desde la Web

1. Ve a https://vercel.com/new
2. Conecta tu repositorio de GitHub/GitLab/Bitbucket
3. Selecciona el proyecto
4. Configura:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Agrega las variables de entorno
6. Click en "Deploy"

### 4. Configuración Post-Despliegue

Después del despliegue:

1. **Actualizar CORS en el Backend**: Agrega el dominio de Vercel a la configuración de CORS
2. **Configurar Dominio Personalizado** (opcional): En Vercel > Settings > Domains
3. **Verificar Variables de Entorno**: Asegúrate de que apunten al backend correcto

## Estructura del Proyecto para Vercel

```
INSO2/
├── frontend/              # Solo esto se despliega en Vercel
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/              # Desplegar por separado
├── vercel.json          # Configuración de Vercel
└── .vercelignore        # Archivos a ignorar
```

## Solución de Problemas

### Error: "Module not found"
- Asegúrate de que todas las dependencias estén en `package.json`
- Ejecuta `npm install` localmente primero

### Error: "API calls failing"
- Verifica que `REACT_APP_API_URL` esté configurada correctamente
- Verifica que el backend permita CORS desde tu dominio de Vercel

### Error: "Build failed"
- Revisa los logs de build en Vercel
- Asegúrate de que el proyecto compile localmente con `npm run build`

## Comandos Útiles

```bash
# Build local para probar
cd frontend
npm run build

# Servir build localmente
npx serve -s build

# Ver logs de Vercel
vercel logs

# Listar deployments
vercel ls
```

## Notas Importantes

⚠️ **El backend NO se despliega en Vercel** - Solo el frontend (React)
⚠️ **Necesitas un backend separado** - Usa Railway, Render, etc.
⚠️ **Base de datos** - Debe estar en la nube (no Docker local)
⚠️ **Variables de entorno** - Deben configurarse en Vercel Dashboard

## Alternativa: Despliegue Full-Stack

Si quieres desplegar todo junto, considera:

- **Railway**: Soporta Docker Compose
- **DigitalOcean App Platform**: Soporta múltiples servicios
- **AWS/GCP/Azure**: Soluciones completas pero más complejas
