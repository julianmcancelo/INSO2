# 🔒 Guía de Seguridad - Cartita

## Resumen de Mejoras Implementadas

Esta aplicación ha sido fortificada con múltiples capas de seguridad para proteger contra ataques comunes.

---

## ✅ Protecciones Implementadas

### 1. **Autenticación y Autorización**

#### JWT Seguro
- ✅ `JWT_SECRET` obligatorio (sin fallback inseguro)
- ✅ Algoritmo HS256 especificado explícitamente
- ✅ Validación de estructura del token
- ✅ Validación de longitud del token (máx 500 caracteres)
- ✅ Expiración de 7 días con validación automática
- ✅ Manejo de errores sin exponer información sensible

#### Rate Limiting
- ✅ Login: 5 intentos por minuto por IP
- ✅ Header `Retry-After` en respuestas 429
- ✅ Protección contra ataques de fuerza bruta

#### Protección contra Timing Attacks
- ✅ Hash dummy cuando el email no existe
- ✅ Tiempo de respuesta consistente

### 2. **CORS (Cross-Origin Resource Sharing)**

- ✅ Lista blanca de orígenes permitidos:
  - `https://cartita.digital`
  - `https://www.cartita.digital`
  - `http://localhost:3000` (desarrollo)
  - `http://localhost:3001` (desarrollo)
- ✅ No más wildcard (`*`)
- ✅ Credentials permitidos solo para orígenes confiables

### 3. **Headers de Seguridad**

Implementados en `src/middleware.js` y `next.config.js`:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: [política restrictiva]
```

#### Content Security Policy (CSP)
- ✅ Scripts solo desde el mismo origen
- ✅ Estilos solo desde el mismo origen
- ✅ Imágenes desde origen propio, data: y HTTPS
- ✅ Conexiones permitidas a dominios específicos

### 4. **Validación de Entrada**

#### Validaciones Implementadas
- ✅ Email: formato y longitud (máx 255 caracteres)
- ✅ Password: longitud 6-100 caracteres
- ✅ Slug: solo minúsculas, números y guiones
- ✅ Teléfono: formato flexible, 8-20 caracteres
- ✅ Números: validación de enteros y decimales positivos
- ✅ Imágenes Base64: formato y tamaño (máx 5MB)
- ✅ Strings: longitud máxima y sanitización

#### Sanitización
- ✅ Escape de caracteres HTML peligrosos
- ✅ Prevención de XSS (Cross-Site Scripting)
- ✅ Filtrado de propiedades de objetos

### 5. **Multi-tenancy Security**

- ✅ Validación de `localId` en todas las operaciones CRUD
- ✅ Usuarios solo pueden acceder a datos de su local
- ✅ Verificación en productos, categorías, pedidos
- ✅ Respuesta 403 (Forbidden) para accesos no autorizados

### 6. **Manejo de Errores y Logs**

- ✅ No se exponen detalles internos en producción
- ✅ **Todos los console.log/error/warn eliminados de archivos API**
- ✅ Sistema de logging seguro (`src/lib/logger.js`)
- ✅ Logs solo en desarrollo, silenciados en producción
- ✅ Mensajes genéricos para el usuario
- ✅ Stack traces solo en desarrollo
- ✅ Script automático para limpiar logs: `npm run clean:logs`

### 7. **Passwords**

- ✅ Hashing con bcrypt (10 rounds)
- ✅ No se almacenan passwords en texto plano
- ✅ Validación de fortaleza en frontend y backend
- ✅ Tokens de recuperación con expiración

---

## 🔐 Variables de Entorno Críticas

### Obligatorias

```bash
# CRÍTICO: Debe ser una clave fuerte y única
JWT_SECRET="[clave-de-al-menos-64-caracteres]"

# Base de datos
DATABASE_URL="mysql://usuario:password@host:puerto/database"

# Email (usar App Password de Gmail)
EMAIL_USER="tu-email@gmail.com"
EMAIL_PASSWORD="[app-password-de-16-caracteres]"
```

### Recomendaciones

1. **JWT_SECRET**:
   - Mínimo 64 caracteres
   - Usar caracteres aleatorios
   - Nunca reutilizar entre ambientes
   - Rotar periódicamente

2. **DATABASE_URL**:
   - Usar contraseñas fuertes
   - Restringir acceso por IP
   - Usar SSL/TLS

3. **EMAIL_PASSWORD**:
   - Usar App Password, no contraseña real
   - Activar 2FA en la cuenta

---

## 🚨 Vulnerabilidades Mitigadas

| Vulnerabilidad | Estado | Protección |
|----------------|--------|------------|
| SQL Injection | ✅ Protegido | Prisma ORM con queries parametrizadas |
| XSS (Cross-Site Scripting) | ✅ Protegido | Sanitización de entrada + CSP |
| CSRF (Cross-Site Request Forgery) | ⚠️ Parcial | SameSite cookies + validación de origen |
| Brute Force | ✅ Protegido | Rate limiting |
| JWT Attacks | ✅ Protegido | Algoritmo fijo + validación estricta |
| Timing Attacks | ✅ Protegido | Respuestas con tiempo consistente |
| Clickjacking | ✅ Protegido | X-Frame-Options: DENY |
| MIME Sniffing | ✅ Protegido | X-Content-Type-Options: nosniff |
| Information Disclosure | ✅ Protegido | Errores genéricos |
| Insecure Direct Object References | ✅ Protegido | Validación de localId |

---

## 📋 Checklist de Seguridad

### Antes de Deploy

- [ ] `JWT_SECRET` configurado y fuerte
- [ ] `DATABASE_URL` con credenciales seguras
- [ ] Variables de entorno en Vercel/servidor
- [ ] CORS configurado para dominio de producción
- [ ] CSP ajustado para recursos externos necesarios
- [ ] Rate limiting configurado
- [ ] Logs sin información sensible
- [ ] HTTPS habilitado

### Mantenimiento Regular

- [ ] Actualizar dependencias mensualmente
- [ ] Revisar logs de seguridad
- [ ] Rotar JWT_SECRET cada 6 meses
- [ ] Auditar accesos sospechosos
- [ ] Backup de base de datos
- [ ] Revisar permisos de usuarios

---

## 🛡️ Mejores Prácticas

### Para Desarrolladores

1. **Nunca** commitear secrets en Git
2. **Siempre** validar entrada del usuario
3. **Usar** Prisma para queries (no SQL raw)
4. **Sanitizar** datos antes de mostrar
5. **Loguear** sin exponer información sensible
6. **Actualizar** dependencias regularmente

### Para Administradores

1. **Usar** contraseñas fuertes (mín 12 caracteres)
2. **Activar** 2FA cuando sea posible
3. **Revisar** usuarios y permisos regularmente
4. **Monitorear** logs de acceso
5. **Reportar** actividad sospechosa
6. **Hacer** backups periódicos

---

## 🔍 Auditoría de Código

### Archivos Críticos Revisados

- ✅ `src/lib/middleware.js` - Autenticación JWT
- ✅ `src/middleware.js` - Headers de seguridad
- ✅ `src/app/api/auth/login/route.js` - Login seguro
- ✅ `src/app/api/productos/route.js` - Validación de entrada
- ✅ `src/app/api/categorias/route.js` - Validación de localId
- ✅ `next.config.js` - Configuración de seguridad
- ✅ `src/lib/security.js` - Utilidades de seguridad

---

## 📞 Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad:

1. **NO** la hagas pública
2. Envía un email a: `cartita.digitalok@gmail.com`
3. Incluye:
   - Descripción detallada
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencias de mitigación (opcional)

---

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Última actualización**: 2024-11-14
**Versión**: 1.0.0
