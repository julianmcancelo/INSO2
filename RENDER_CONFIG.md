# Configuración de Variables de Entorno en Render

## 📧 Variables necesarias para el envío de emails

Debes configurar estas variables de entorno en tu servicio de Render:

### 1. Variables de Email (REQUERIDAS)

```
EMAIL_USER=cartita.digitalok@gmail.com
EMAIL_PASSWORD=xybfxjsaguavbzea
SUPERADMIN_EMAIL=cartita.digitalok@gmail.com
```

### 2. Variables de Frontend

```
FRONTEND_URL=https://cartita.digital
NODE_ENV=production
```

### 3. Variables de Base de Datos (ya deberías tenerlas)

```
DB_DIALECT=mysql
DB_HOST=167.250.5.55
DB_PORT=3306
DB_NAME=transpo1_cartita
DB_USER=transpo1_cartita
DB_PASSWORD=feelthesky1
```

### 4. Variables de JWT (ya deberías tenerlas)

```
JWT_SECRET=ac09fc636029fd5d86ea9a835a5e5a7799e165a6c1c8989b60986f8d32f13da3abb176b74924a2b46f076403451252d2a4b84b63935cd05012bc520da4a144ec
JWT_EXPIRE=7d
```

## 🚀 Cómo configurar en Render

1. Ve a tu dashboard de Render: https://dashboard.render.com
2. Selecciona tu servicio de backend
3. Ve a la pestaña **Environment**
4. Haz click en **Add Environment Variable**
5. Agrega cada variable una por una
6. Haz click en **Save Changes**
7. Render automáticamente reiniciará el servicio

## ✅ Verificación

Después de configurar las variables:

1. Espera a que el servicio se reinicie (tarda ~2-3 minutos)
2. Ve a https://cartita.digital/admin/forgot-password
3. Ingresa el email de un usuario registrado (ejemplo: tu email de admin)
4. Deberías recibir un email de recuperación

## 📝 Notas importantes

- El email se envía **desde** `cartita.digitalok@gmail.com`
- El email se envía **al** usuario que solicita la recuperación (cualquier email registrado en tu BD)
- El link en el email apunta a `https://cartita.digital/reset-password/{token}`
- El token expira en 1 hora

## 🔍 Troubleshooting

Si no recibes el email:

1. Revisa la carpeta de spam
2. Verifica que el email esté registrado en la base de datos
3. Revisa los logs de Render para ver si hay errores
4. Verifica que todas las variables estén configuradas correctamente

### ⚠️ Problema común: Connection Timeout

Si ves este error en los logs:
```
❌ Error al enviar email: Error: Connection timeout
code: 'ETIMEDOUT'
```

**Causa:** Render bloquea el puerto 587 (SMTP estándar) por seguridad.

**Solución:** El código ya está configurado para usar el puerto 465 con SSL, que Render permite.

### 🔧 Configuración técnica del email

El sistema usa:
- **Host:** smtp.gmail.com
- **Puerto:** 465 (SSL)
- **Secure:** true
- **Autenticación:** Gmail App Password

Esta configuración evita los bloqueos de firewall de Render.
