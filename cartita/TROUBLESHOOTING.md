# Guía de Solución de Problemas

## Errores de Consola Comunes

### 1. "Tracking Prevention blocked access to storage"

**Causa:** El navegador (Edge/Chrome) está bloqueando el acceso a localStorage/sessionStorage debido a políticas de privacidad estrictas.

**Soluciones:**

#### Opción A: Desactivar Tracking Prevention para localhost (Recomendado para desarrollo)

**En Microsoft Edge:**
1. Abre `edge://settings/privacy`
2. En "Prevención de seguimiento", selecciona "Básico" en lugar de "Estricto"
3. O agrega `localhost` a las excepciones

**En Google Chrome:**
1. Abre `chrome://settings/cookies`
2. En "Configuración de cookies", asegúrate de permitir cookies para localhost
3. O desactiva "Bloquear cookies de terceros"

#### Opción B: Usar HTTPS en desarrollo
Los navegadores son más permisivos con sitios HTTPS. Considera usar `mkcert` para certificados locales.

#### Opción C: Ignorar warnings (No afecta funcionalidad)
Estos warnings no rompen la aplicación ya que implementamos manejo de errores seguro en:
- `src/lib/storage.js`
- `src/context/CartContext.jsx`
- `src/context/AuthContext.jsx`

### 2. "Permissions policy violation: Geolocation access has been blocked"

**Causa:** La política de permisos del navegador está bloqueando la geolocalización.

**Soluciones:**

#### Paso 1: Reiniciar el servidor de desarrollo
Los cambios en `next.config.js` requieren reinicio completo:
```bash
# Detener el servidor (Ctrl+C)
npm run dev
```

#### Paso 2: Permitir geolocalización en el navegador
1. Haz clic en el ícono de candado/información en la barra de direcciones
2. Busca "Ubicación" o "Location"
3. Cambia a "Permitir" o "Allow"
4. Recarga la página

#### Paso 3: Verificar que estés usando HTTP o HTTPS (no file://)
La geolocalización solo funciona en:
- `http://localhost:3000`
- `https://localhost:3000`
- NO funciona con `file:///`

### 3. "Download the React DevTools"

**Causa:** Mensaje informativo de React en modo desarrollo.

**Solución:** Instalar React DevTools (opcional):
- [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Edge Extension](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

O simplemente ignorar el mensaje - no afecta la funcionalidad.

## Verificar que todo funciona

### Test de localStorage:
1. Abre la consola del navegador (F12)
2. Ejecuta: `localStorage.setItem('test', 'ok')`
3. Ejecuta: `localStorage.getItem('test')`
4. Deberías ver: `"ok"`

### Test de geolocalización:
1. Abre la consola del navegador (F12)
2. Ejecuta:
```javascript
navigator.geolocation.getCurrentPosition(
  pos => console.log('✅ Geolocalización OK:', pos.coords),
  err => console.error('❌ Error:', err)
)
```
3. Permite el acceso cuando el navegador lo solicite
4. Deberías ver tus coordenadas en la consola

## Configuración Actual

La aplicación ya tiene implementado:
- ✅ Manejo seguro de localStorage con try-catch
- ✅ Política de permisos configurada en `next.config.js`
- ✅ Funciones helper en `src/lib/storage.js`
- ✅ Fallbacks cuando storage no está disponible

## Contacto

Si los problemas persisten después de seguir estos pasos, verifica:
1. Que el servidor esté corriendo en `http://localhost:3000`
2. Que no haya extensiones del navegador interfiriendo
3. Que estés usando una versión actualizada del navegador
