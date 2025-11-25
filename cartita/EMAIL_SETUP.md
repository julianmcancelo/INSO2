# 📧 Configuración de Emails - Cartita

## ✅ Sistema de Emails Implementado

### 📨 Emails automáticos:

1. **Email de Confirmación de Solicitud**
   - Se envía cuando alguien completa el formulario del landing
   - Confirma que recibimos su solicitud
   - Tiempo estimado de respuesta: 24-48 horas

2. **Email de Invitación**
   - Se envía cuando el superadmin acepta una solicitud
   - Incluye enlace único de registro
   - Válido por 7 días
   - Diseño profesional con gradientes y logo

---

## 🔧 Configuración de Gmail

### Paso 1: Habilitar verificación en 2 pasos

1. Ve a tu cuenta de Gmail: https://myaccount.google.com/security
2. Busca "Verificación en 2 pasos"
3. Actívala si no está activada

### Paso 2: Generar contraseña de aplicación

1. Ve a: https://myaccount.google.com/apppasswords
2. Selecciona "Correo" y "Otro (nombre personalizado)"
3. Escribe "Cartita" como nombre
4. Haz clic en "Generar"
5. **Copia la contraseña de 16 caracteres**

### Paso 3: Configurar variables de entorno

Ya está configurado en `.env.local`:

```env
EMAIL_USER=cartita.digitalok@gmail.com
EMAIL_PASSWORD=xybfxjsaguavbzea
```

---

## 🎨 Diseño de Emails

### Características:

✅ **Responsive** - Se ve bien en móvil y desktop
✅ **Gradientes** - Colores de marca (naranja/rojo)
✅ **Logo emoji** - 🍽️ Cartita
✅ **Botón CTA** - "Completar Registro"
✅ **Información clara** - Validez, características, ayuda
✅ **Fallback texto plano** - Para clientes que no soportan HTML

### Estructura del email de invitación:

```
┌─────────────────────────────┐
│  Header (Gradiente naranja) │
│  🍽️ Cartita                 │
│  Tu menú digital está listo │
└─────────────────────────────┘
│                             │
│  ¡Bienvenido a Cartita! 🎉 │
│                             │
│  Tu solicitud para [Nombre] │
│  ha sido aceptada.          │
│                             │
│  ┌─────────────────────┐   │
│  │ Completar Registro  │   │ ← Botón CTA
│  └─────────────────────┘   │
│                             │
│  ⏰ Válido por 7 días       │
│                             │
│  ¿Qué puedes hacer?         │
│  📱 Menú digital con QR     │
│  🛒 Pedidos en tiempo real  │
│  📊 Estadísticas            │
│  ⚡ Actualiza al instante   │
│                             │
│  Enlace alternativo:        │
│  http://...                 │
│                             │
└─────────────────────────────┘
│  Footer                     │
│  Contacto y copyright       │
└─────────────────────────────┘
```

---

## 🧪 Probar el sistema

### 1. Email de confirmación de solicitud:

```bash
# Ir al landing page
http://localhost:3000

# Completar formulario
# Automáticamente se envía email de confirmación
```

### 2. Email de invitación:

```bash
# Como superadmin
http://localhost:3000/admin/solicitudes

# Aceptar una solicitud
# Automáticamente se envía email con enlace de registro
```

---

## 📝 Logs del servidor

Verás en la consola:

```
✅ Servidor de email listo
✅ Email de confirmación enviado: <message-id>
✅ Email de invitación enviado a: usuario@email.com
```

Si hay error:

```
⚠️ Error al enviar email (continuando): [error]
```

**Nota:** Si el email falla, la operación continúa normalmente. El enlace se muestra en el dashboard.

---

## 🔒 Seguridad

✅ **Contraseña de aplicación** - No se usa la contraseña real de Gmail
✅ **Variables de entorno** - Credenciales no en el código
✅ **Token único** - Cada invitación tiene un token criptográfico
✅ **Expiración** - Los enlaces expiran en 7 días
✅ **Un solo uso** - Cada invitación solo se puede usar una vez

---

## 🎯 Próximos pasos

- [ ] Página de registro `/registro/[token]`
- [ ] Email de bienvenida al completar registro
- [ ] Email de notificación al superadmin cuando hay nueva solicitud
- [ ] Email de pedido confirmado
- [ ] Email de cambio de estado de pedido

---

## 🐛 Troubleshooting

### Error: "Invalid login"
- Verifica que la contraseña de aplicación sea correcta
- Asegúrate de tener verificación en 2 pasos activada

### Error: "Connection timeout"
- Verifica tu conexión a internet
- Revisa el firewall

### Los emails van a spam
- Agrega el dominio a SPF/DKIM (para producción)
- Pide a los usuarios que agreguen a contactos

---

<div align="center">

**¡Sistema de emails funcionando! 📧**

Los usuarios recibirán emails profesionales automáticamente

</div>
