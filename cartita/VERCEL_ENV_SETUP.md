# 🚀 Configuración de Variables de Entorno en Vercel

## 📋 Variables Requeridas

Ve a tu proyecto en Vercel → **Settings** → **Environment Variables** y agrega las siguientes:

---

## 🗄️ Base de Datos

### `DATABASE_URL`
```
mysql://transpo1_cartita:feelthesky1@167.250.5.55:3306/transpo1_cartita
```
**Importante:** Esta es la conexión a tu base de datos MySQL existente.

---

## 🔐 Autenticación

### `JWT_SECRET`
```
ac09fc636029fd5d86ea9a835a5e5a7799e165a6c1c8989b60986f8d32f13da3abb176b74924a2b46f076403451252d2a4b84b63935cd05012bc520da4a144ec
```

---

## 🌐 URLs Públicas

### `NEXT_PUBLIC_API_URL`
```
https://cartita.digital
```

### `NEXT_PUBLIC_SOCKET_URL`
```
https://cartita.digital
```

---

## 📧 Configuración de Email

### `EMAIL_HOST`
```
smtp.gmail.com
```

### `EMAIL_PORT`
```
587
```

### `EMAIL_USER`
```
cartita.digitalok@gmail.com
```

### `EMAIL_PASSWORD`
```
xybfxjsaguavbzea
```

### `EMAIL_FROM`
```
Cartita <cartita.digitalok@gmail.com>
```

---

## 👤 Superadmin

### `SUPERADMIN_EMAIL`
```
cartita.digitalok@gmail.com
```

---

## ✅ Checklist de Configuración

- [ ] Todas las variables agregadas en Vercel
- [ ] Variables aplicadas a **Production**, **Preview** y **Development**
- [ ] Redeploy del proyecto después de agregar variables
- [ ] Verificar que el sitio carga sin errores de CORS
- [ ] Probar login con usuario de prueba
- [ ] Verificar que las APIs responden correctamente

---

## 🔄 Después de Configurar

1. **Redeploy el proyecto** en Vercel (o espera el próximo commit)
2. **Limpia las cookies** del navegador (Ctrl + Shift + Delete)
3. **Accede a** `https://cartita.digital`
4. **Prueba el login** con tus credenciales

---

## 🐛 Troubleshooting

### Error: "the URL must start with the protocol mysql://"
- ✅ Verifica que `DATABASE_URL` esté configurada correctamente
- ✅ Asegúrate de que empiece con `mysql://`

### Error: CORS
- ✅ Ya está configurado en `next.config.js` y `vercel.json`
- ✅ Limpia las cookies del navegador

### Error: Email no se envía
- ✅ Verifica que `EMAIL_PASSWORD` sea la App Password de Gmail
- ✅ No uses tu contraseña normal de Gmail

---

## 📝 Notas

- **No subas el archivo `.env.local` a Git** (ya está en `.gitignore`)
- **Las variables de Vercel son seguras** y no se exponen en el cliente
- **Variables con `NEXT_PUBLIC_`** son accesibles desde el navegador
- **Variables sin `NEXT_PUBLIC_`** solo están disponibles en el servidor
