# 🔒 Seguridad - Cartita Digital

## Características de Seguridad Implementadas

### 1. Autenticación y Autorización

#### JWT (JSON Web Tokens)
- ✅ Tokens con expiración configurable (7 días por defecto)
- ✅ Verificación automática en middleware
- ✅ Payload incluye: userId, localId, rol
- ✅ Secret key configurable vía variables de entorno

#### Roles y Permisos
- **Superadmin**: Acceso total al sistema
- **Admin**: Gestión de su local
- **Staff**: Operaciones básicas

### 2. Protección de Contraseñas

- ✅ **Bcrypt** con salt de 10 rounds
- ✅ Hash automático en creación y actualización
- ✅ Comparación segura con método dedicado
- ✅ Nunca se devuelven contraseñas en respuestas API

### 3. Headers de Seguridad (Helmet)

Implementado con `helmet` para proteger contra vulnerabilidades comunes:
- ✅ X-Content-Type-Options
- ✅ X-Frame-Options
- ✅ X-XSS-Protection
- ✅ Strict-Transport-Security (HSTS)
- ✅ Content-Security-Policy (configurado para imágenes Base64)

### 4. Rate Limiting

#### Límites Generales
- 100 requests por 15 minutos por IP

#### Límites de Autenticación
- 5 intentos de login por 15 minutos
- No cuenta requests exitosos

#### Límites de Creación
- 50 creaciones por hora

#### API Pública
- 30 requests por minuto

### 5. Validación de Entrada

Implementado con `express-validator`:
- ✅ Validación de emails
- ✅ Sanitización de inputs
- ✅ Validación de tipos de datos
- ✅ Límites de longitud
- ✅ Escape de caracteres especiales

### 6. Logging de Seguridad

Sistema de logs en `backend/logs/security.log`:
- ✅ Intentos de login fallidos
- ✅ Logins exitosos
- ✅ Accesos no autorizados
- ✅ Cambios de contraseña
- ✅ Creación/eliminación de usuarios
- ✅ Tokens inválidos
- ✅ Rate limits excedidos

### 7. CORS (Cross-Origin Resource Sharing)

- ✅ Lista blanca de orígenes permitidos
- ✅ Configuración específica por ambiente
- ✅ Credentials habilitados para cookies

## Configuración de Producción

### Variables de Entorno Críticas

```env
# NUNCA usar valores por defecto en producción
JWT_SECRET=<generar_clave_segura_64_caracteres>
DB_PASSWORD=<contraseña_fuerte>
NODE_ENV=production
```

### Generar JWT Secret Seguro

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Checklist de Despliegue

- [ ] Cambiar JWT_SECRET a valor único y fuerte
- [ ] Usar contraseñas fuertes para base de datos
- [ ] Configurar HTTPS/SSL
- [ ] Actualizar CORS con dominios de producción
- [ ] Configurar variables de entorno en servidor
- [ ] Revisar logs de seguridad regularmente
- [ ] Implementar backups automáticos
- [ ] Configurar monitoreo de errores
- [ ] Habilitar logs de auditoría

## Mejores Prácticas

### Para Desarrolladores

1. **Nunca** commitear archivos `.env`
2. **Siempre** validar inputs del usuario
3. **Usar** prepared statements (Sequelize lo hace automáticamente)
4. **Revisar** logs de seguridad regularmente
5. **Actualizar** dependencias periódicamente

### Para Administradores

1. **Rotar** JWT_SECRET cada 3-6 meses
2. **Monitorear** intentos de login fallidos
3. **Revisar** usuarios activos regularmente
4. **Mantener** backups actualizados
5. **Auditar** logs de seguridad semanalmente

## Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, por favor:

1. **NO** abras un issue público
2. Contacta directamente al equipo de desarrollo
3. Proporciona detalles técnicos
4. Espera confirmación antes de divulgar

## Actualizaciones de Seguridad

### Versión 1.0.0 (2025-01-11)
- ✅ Implementación inicial de seguridad
- ✅ Helmet para headers HTTP
- ✅ Rate limiting
- ✅ Validación de entrada
- ✅ Logging de seguridad
- ✅ Bcrypt para contraseñas
- ✅ JWT con expiración

## Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)

## Dependencias de Seguridad

```json
{
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "express-validator": "^7.0.1",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2"
}
```

## Monitoreo

### Logs a Revisar

1. `backend/logs/security.log` - Eventos de seguridad
2. Logs de aplicación - Errores y warnings
3. Logs de base de datos - Queries sospechosas

### Alertas Recomendadas

- Más de 10 intentos de login fallidos en 1 hora
- Creación de usuarios superadmin
- Eliminación de usuarios
- Accesos no autorizados repetidos
- Rate limits excedidos frecuentemente

---

**Última actualización**: 2025-01-11
**Versión**: 1.0.0
