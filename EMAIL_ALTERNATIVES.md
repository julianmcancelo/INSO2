# Alternativas de Email para Render

## ⚠️ Problema con Gmail SMTP en Render

Render puede bloquear conexiones SMTP salientes (puertos 25, 587, 465) por seguridad.

## ✅ Soluciones Alternativas Recomendadas

### 1. **SendGrid** (Recomendado) ⭐

**Ventajas:**
- ✅ API HTTP (no SMTP bloqueado)
- ✅ 100 emails gratis por día
- ✅ Muy confiable
- ✅ Fácil integración

**Instalación:**
```bash
npm install @sendgrid/mail
```

**Código:**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: email,
  from: 'cartita.digitalok@gmail.com',
  subject: 'Recuperación de Contraseña - Cartita',
  html: '...'
};

await sgMail.send(msg);
```

**Variables de entorno:**
```
SENDGRID_API_KEY=tu_api_key_aqui
```

**Registro:** https://sendgrid.com/

---

### 2. **Resend** (Alternativa Moderna) ⭐⭐

**Ventajas:**
- ✅ API HTTP simple
- ✅ 100 emails gratis por día
- ✅ Muy fácil de usar
- ✅ Documentación excelente

**Instalación:**
```bash
npm install resend
```

**Código:**
```javascript
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Cartita <onboarding@resend.dev>',
  to: email,
  subject: 'Recuperación de Contraseña - Cartita',
  html: '...'
});
```

**Variables de entorno:**
```
RESEND_API_KEY=tu_api_key_aqui
```

**Registro:** https://resend.com/

---

### 3. **Mailgun** (Alternativa Robusta)

**Ventajas:**
- ✅ API HTTP
- ✅ 5,000 emails gratis por mes (primeros 3 meses)
- ✅ Muy usado en producción

**Instalación:**
```bash
npm install mailgun.js form-data
```

**Registro:** https://www.mailgun.com/

---

### 4. **Brevo (ex-Sendinblue)** (Alternativa Europea)

**Ventajas:**
- ✅ 300 emails gratis por día
- ✅ API HTTP
- ✅ GDPR compliant

**Registro:** https://www.brevo.com/

---

## 🚀 Implementación Recomendada: SendGrid

### Paso 1: Crear cuenta en SendGrid

1. Ve a https://sendgrid.com/
2. Regístrate gratis
3. Verifica tu email
4. Ve a Settings → API Keys
5. Crea una API Key con permisos de "Mail Send"

### Paso 2: Instalar dependencia

```bash
cd backend
npm install @sendgrid/mail
```

### Paso 3: Modificar passwordController.js

```javascript
const sgMail = require('@sendgrid/mail');

// Configurar SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid configurado');
}

// En la función de envío:
if (process.env.SENDGRID_API_KEY) {
  const msg = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: 'Recuperación de Contraseña - Cartita',
    html: `...tu HTML aquí...`
  };

  sgMail.send(msg)
    .then(() => {
      console.log('✅ Email enviado con SendGrid a:', email);
    })
    .catch((error) => {
      console.error('❌ Error SendGrid:', error);
    });
}
```

### Paso 4: Configurar en Render

Agregar variable de entorno:
```
SENDGRID_API_KEY=tu_api_key_de_sendgrid
```

---

## 📊 Comparación

| Servicio | Emails Gratis | API | SMTP | Facilidad |
|----------|---------------|-----|------|-----------|
| SendGrid | 100/día | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| Resend | 100/día | ✅ | ❌ | ⭐⭐⭐⭐⭐ |
| Mailgun | 5000/mes (3 meses) | ✅ | ✅ | ⭐⭐⭐⭐ |
| Brevo | 300/día | ✅ | ✅ | ⭐⭐⭐⭐ |
| Gmail SMTP | Ilimitado* | ❌ | ✅ | ⭐⭐ |

*Gmail tiene límites de 500 emails/día

---

## 🎯 Recomendación Final

**Para Render: Usa SendGrid o Resend**

Ambos funcionan perfectamente en Render porque usan API HTTP en lugar de SMTP.

**SendGrid** es más establecido y tiene mejor documentación.
**Resend** es más moderno y simple.

Cualquiera de los dos resolverá el problema de bloqueo de SMTP en Render.
