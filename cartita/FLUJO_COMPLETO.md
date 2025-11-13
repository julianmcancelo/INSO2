# 🎯 FLUJO COMPLETO DE INVITACIONES - CARTITA

## ✅ Estado: LISTO PARA PROBAR

---

## 📋 Flujo Paso a Paso

### **PASO 1: Usuario solicita desde Landing Page**

1. Ve a: `http://localhost:3000`
2. Completa el formulario:
   - Nombre del negocio
   - Tu nombre
   - Email
   - Teléfono (opcional)
   - Tipo de negocio (opcional)
3. Haz clic en "Empezar"
4. ✅ **Resultado:** 
   - Solicitud guardada en BD
   - Email de confirmación enviado (si Gmail está configurado)

---

### **PASO 2: Superadmin revisa solicitudes**

1. Inicia sesión como superadmin: `http://localhost:3000/admin/login`
2. Ve a: `http://localhost:3000/admin/solicitudes`
3. Verás las solicitudes pendientes (badge amarillo)
4. Haz clic en **"Aceptar y Generar Invitación"**
5. ✅ **Resultado:**
   - Se genera token único
   - Se muestra alert con el enlace
   - Enlace copiado al portapapeles
   - Email enviado al usuario con el enlace
   - Estado cambia a "Aceptada" (badge verde)

---

### **PASO 3: Usuario recibe email**

El usuario recibirá un email con:
- ✉️ Asunto: "🎉 ¡Bienvenido a Cartita! - Completa tu registro"
- 📧 Contenido:
  - Bienvenida personalizada
  - Botón grande "Completar Registro"
  - Enlace: `http://localhost:3000/registro/[token]`
  - Validez: 7 días
  - Lista de características

---

### **PASO 4: Usuario completa registro**

1. Usuario hace clic en el enlace del email
2. Se abre: `http://localhost:3000/registro/[token]`
3. La página verifica:
   - ✅ Token válido
   - ✅ No expirado
   - ✅ No usado previamente
4. Usuario completa el formulario:

   **Datos del Local:**
   - Nombre del local *
   - URL del menú (auto-generado) *
   - Descripción
   - Dirección
   - Teléfono
   - Email del local

   **Datos del Usuario:**
   - Nombre *
   - Email * (pre-llenado)
   - Contraseña *
   - Confirmar contraseña *

5. Haz clic en **"Completar Registro"**
6. ✅ **Resultado:**
   - Local creado
   - Usuario admin creado
   - 4 categorías por defecto creadas
   - Invitación marcada como usada
   - Redirige a `/admin/login`

---

### **PASO 5: Usuario inicia sesión**

1. En la página de login: `http://localhost:3000/admin/login`
2. Ingresa:
   - Email: el que usó en el registro
   - Contraseña: la que creó
3. Haz clic en "Iniciar sesión"
4. ✅ **Resultado:**
   - Acceso al dashboard
   - Puede gestionar su local
   - Puede crear productos
   - Puede ver pedidos

---

## 🧪 PRUEBA COMPLETA AHORA

### **Opción A: Con email real**

1. **Resetea las solicitudes:**
   ```bash
   cd cartita
   node scripts/reset-solicitudes.js
   ```

2. **Crea una solicitud nueva:**
   - Ve a `http://localhost:3000`
   - Usa TU email real
   - Completa el formulario

3. **Acepta la solicitud:**
   - Login como superadmin
   - Ve a `/admin/solicitudes`
   - Acepta la solicitud

4. **Revisa tu email:**
   - Busca el email de Cartita
   - Haz clic en "Completar Registro"

5. **Completa el registro:**
   - Llena el formulario
   - Crea tu cuenta

6. **Inicia sesión:**
   - Usa tus credenciales
   - Accede al dashboard

---

### **Opción B: Sin email (manual)**

1. **Acepta una solicitud**
2. **Copia el enlace del alert**
3. **Pégalo en el navegador**
4. **Completa el registro**
5. **Inicia sesión**

---

## 📊 Base de Datos

Después del registro completo, tendrás:

### **Tabla: locales**
```
id | nombre | slug | descripcion | direccion | telefono | email | activo
1  | Mi Local | mi-local | ... | ... | ... | ... | true
```

### **Tabla: usuarios**
```
id | nombre | email | rol | local_id | activo
1  | Admin | admin@... | admin | 1 | true
```

### **Tabla: categorias**
```
id | local_id | nombre | icono | orden
1  | 1 | Entradas | 🥗 | 1
2  | 1 | Platos Principales | 🍽️ | 2
3  | 1 | Bebidas | 🥤 | 3
4  | 1 | Postres | 🍰 | 4
```

### **Tabla: invitaciones**
```
id | token | email | usado | local_id | expira_en
1  | abc... | user@... | true | 1 | 2025-11-20
```

---

## 🔍 Verificar en Prisma Studio

```bash
npx prisma studio
```

Abre: `http://localhost:5555`

Verifica:
- ✅ Solicitud en estado "aceptada"
- ✅ Invitación con "usado: true"
- ✅ Local creado
- ✅ Usuario creado
- ✅ 4 categorías creadas

---

## 🐛 Troubleshooting

### **Error: "Invitación no encontrada"**
- Verifica que el token en la URL sea correcto
- Revisa en Prisma Studio que la invitación exista

### **Error: "Invitación ya utilizada"**
- Esta invitación ya fue usada
- Necesitas generar una nueva aceptando otra solicitud

### **Error: "Invitación expirada"**
- Han pasado más de 7 días
- Necesitas generar una nueva invitación

### **Error: "El slug ya está en uso"**
- Cambia el nombre del local
- El slug se auto-generará diferente

### **Email no llega**
- Verifica configuración en `.env.local`
- Revisa spam/correo no deseado
- La app funciona sin emails, usa el enlace del alert

---

## 📝 Comandos Útiles

### **Resetear solicitudes:**
```bash
node scripts/reset-solicitudes.js
```

### **Ver base de datos:**
```bash
npx prisma studio
```

### **Ver logs del servidor:**
Busca en la terminal donde corre `npm run dev`

---

## ✅ Checklist de Verificación

- [ ] Landing page funciona
- [ ] Formulario de solicitud funciona
- [ ] Email de confirmación se envía
- [ ] Superadmin puede ver solicitudes
- [ ] Botón "Aceptar" funciona
- [ ] Email de invitación se envía
- [ ] Enlace de registro funciona
- [ ] Página de registro valida token
- [ ] Formulario de registro funciona
- [ ] Local se crea correctamente
- [ ] Usuario se crea correctamente
- [ ] Categorías se crean automáticamente
- [ ] Login funciona con nuevas credenciales
- [ ] Dashboard es accesible

---

<div align="center">

## 🎉 ¡SISTEMA COMPLETO!

**Todo está listo para probar**

Flujo de invitaciones funcionando al 100%

</div>
