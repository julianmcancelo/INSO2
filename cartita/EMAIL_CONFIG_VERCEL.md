# 📧 Configurar Email en Vercel

## ⚠️ Problema Actual

Los emails **NO se están enviando** porque faltan las variables de entorno en Vercel.

Logs muestran:
```
✅ Servidor de email listo
```

Pero NO aparecen logs de:
```
✅ Email de confirmación enviado a: ...
✅ Email de invitación enviado a: ...
```

Esto significa que el servidor está configurado pero **falta EMAIL_USER y EMAIL_PASSWORD**.

---

## 🔧 Solución: Configurar Gmail App Password

### Paso 1: Crear App Password de Gmail

1. **Ve a tu cuenta de Gmail**
   - https://myaccount.google.com/

2. **Habilita verificación en 2 pasos** (si no la tienes)
   - Seguridad → Verificación en 2 pasos
   - Sigue los pasos

3. **Genera un App Password**
   - Seguridad → Verificación en 2 pasos → App Passwords
   - O directo: https://myaccount.google.com/apppasswords
   
4. **Selecciona:**
   - App: "Mail"
   - Dispositivo: "Other" → Escribe "Cartita Vercel"
   
5. **Copia el password de 16 caracteres**
   - Ejemplo: `abcd efgh ijkl mnop`
   - **Guárdalo** (sin espacios): `abcdefghijklmnop`

---

### Paso 2: Configurar en Vercel

1. **Ve a tu proyecto en Vercel**
   - https://vercel.com/dashboard
   - Selecciona tu proyecto "cartita"

2. **Settings → Environment Variables**

3. **Agrega estas 2 variables:**

#### Variable 1: EMAIL_USER
```
Name: EMAIL_USER
Value: tu-email@gmail.com
Environment: Production (y Preview si quieres)
```

#### Variable 2: EMAIL_PASSWORD
```
Name: EMAIL_PASSWORD
Value: abcdefghijklmnop (el app password de 16 chars)
Environment: Production (y Preview si quieres)
```

4. **Guarda los cambios**

5. **Redeploy tu aplicación**
   - Deployments → Último deploy → ⋯ (tres puntos) → Redeploy

---

### Paso 3: Verificar que Funciona

Después del redeploy, prueba:

1. **Crear una solicitud** desde la landing page
2. **Revisa los logs en Vercel**
   - Deberías ver: `✅ Email de confirmación enviado a: email@example.com`

3. **Aceptar una solicitud** desde el admin
   - Deberías ver: `✅ Email de invitación enviado a: email@example.com`

4. **Revisa tu bandeja de entrada**
   - Deberías recibir los emails con el nuevo diseño minimalista

---

## 🔍 Debugging

Si después de configurar sigues sin recibir emails, revisa:

### En Vercel Logs:

#### ✅ **Si ves esto, está funcionando:**
```
✅ Servidor de email listo
✅ Email de confirmación enviado a: test@example.com
```

#### ❌ **Si ves esto, hay un error:**
```
❌ Error configuración email: Invalid login
⚠️  Los emails no se enviarán. Verifica EMAIL_USER y EMAIL_PASSWORD
```

**Solución:** Verifica que el App Password sea correcto (16 caracteres, sin espacios)

#### ⚠️ **Si ves esto, el email no se envió:**
```
⚠️  No se pudo enviar email de confirmación: Connection timeout
```

**Solución:** Puede ser un problema temporal de Gmail. Intenta de nuevo.

---

## 📋 Checklist de Configuración

- [ ] Verificación en 2 pasos habilitada en Gmail
- [ ] App Password generado (16 caracteres)
- [ ] EMAIL_USER configurado en Vercel
- [ ] EMAIL_PASSWORD configurado en Vercel
- [ ] Aplicación redeployada
- [ ] Logs muestran "✅ Email enviado"
- [ ] Email recibido en bandeja de entrada

---

## 🎯 Variables de Entorno Completas

Para referencia, estas son **TODAS** las variables que deberías tener en Vercel:

```bash
# JWT (CRÍTICO)
JWT_SECRET="[128 caracteres del archivo JWT_PRODUCCION.txt]"

# Base de Datos (CRÍTICO)
DATABASE_URL="mysql://usuario:password@host:3306/database"

# Email (OPCIONAL pero recomendado)
EMAIL_USER="tu-email@gmail.com"
EMAIL_PASSWORD="abcdefghijklmnop"

# URL Pública (OPCIONAL)
NEXT_PUBLIC_API_URL="https://cartita.digital"

# Ambiente
NODE_ENV="production"
```

---

## 💡 Notas Importantes

1. **App Password vs Password Normal:**
   - ❌ NO uses tu password normal de Gmail
   - ✅ USA el App Password de 16 caracteres

2. **Seguridad:**
   - El App Password solo funciona para esta app
   - Puedes revocarlo en cualquier momento
   - No da acceso completo a tu cuenta

3. **Límites de Gmail:**
   - Gmail tiene límite de ~500 emails/día
   - Para más volumen, considera SendGrid o AWS SES

4. **Emails en Spam:**
   - Los primeros emails pueden ir a spam
   - Marca como "No es spam" para futuros emails

---

## 🚀 Después de Configurar

Una vez configurado, los emails se enviarán automáticamente en:

1. **Nueva solicitud** → Email de confirmación al cliente
2. **Solicitud aceptada** → Email de invitación con link de registro
3. **Regenerar invitación** → Nuevo email con link actualizado
4. **Recuperar contraseña** → Email con link de reset

---

**Última actualización:** 2024-11-14
