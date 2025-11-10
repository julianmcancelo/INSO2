# 🚀 Sistema de Onboarding Completo - Menú Digital

## 📋 Flujo de Trabajo Implementado

### 1. **Usuario Interesado** → Landing Page
- Accede a `http://localhost:3000/`
- Ve la landing page con información del sistema
- Completa formulario con:
  - ✅ Nombre del negocio
  - ✅ Nombre de contacto
  - ✅ Email
  - ✅ Teléfono (opcional)
  - ✅ Tipo de negocio
  - ✅ Mensaje
- Al enviar, se crea una **Solicitud** en estado `pendiente`

### 2. **Superadministrador** → Revisa Solicitudes
- Accede a `http://localhost:3000/admin/solicitudes`
- Ve todas las solicitudes organizadas por estado:
  - 🟡 **Pendientes**: Sin procesar
  - 🟢 **Aprobadas**: Local creado
  - 🔴 **Rechazadas**: Descartadas
- Puede aprobar o rechazar cada solicitud

### 3. **Aprobar Solicitud** → Crear Local + Invitación
Al aprobar una solicitud, el superadmin elige:

#### Opción A: **Enviar Email** 📧
- Se crea el local automáticamente
- Se genera invitación con token único
- Se envía email automático al contacto con:
  - Link de registro: `http://localhost:3000/register/[TOKEN]`
  - Instrucciones
  - Branding del local

#### Opción B: **Copiar Enlace** 📋
- Se crea el local automáticamente
- Se genera invitación con token único
- El enlace se copia al portapapeles
- El superadmin lo envía manualmente

### 4. **Admin de Local** → Completa Registro
- Recibe el email o enlace
- Accede a `/register/[TOKEN]`
- Ve página personalizada con:
  - Logo/nombre del local
  - Rol asignado (admin)
- Completa formulario:
  - Nombre completo
  - Email (pre-llenado si se especificó)
  - Contraseña
- Al registrarse:
  - ✅ Se crea usuario vinculado al local
  - ✅ Token de invitación marcado como usado
  - ✅ Redirige a `/admin/login`

### 5. **Admin de Local** → Gestiona su Local
- Inicia sesión
- Accede a su dashboard
- Puede gestionar:
  - ✅ Categorías
  - ✅ Productos
  - ✅ Pedidos
  - ⏳ (Próximamente: más funciones)

---

## ⚙️ Configuración Requerida

### 1. **Iniciar Docker Desktop**
```bash
# Asegúrate de que Docker Desktop esté corriendo
```

### 2. **Configurar Variables de Entorno**

Crea el archivo `backend/.env` basado en `.env.example`:

```env
# Base de Datos
DB_HOST=db
DB_PORT=3306
DB_NAME=menu_digital
DB_USER=menuadmin
DB_PASSWORD=menupass123

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_cambiala

# Puerto
PORT=5000

# URLs
FRONTEND_URL=http://localhost:3000

# Gmail para enviar emails
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx

# Email del superadmin (para notificaciones)
SUPERADMIN_EMAIL=tu-superadmin@email.com

# Ambiente
NODE_ENV=development
```

### 3. **Configurar Gmail App Password**

Para enviar emails, necesitas una **App Password** de Gmail:

1. Ve a https://myaccount.google.com/security
2. Activa **"Verificación en 2 pasos"**
3. Busca **"Contraseñas de aplicaciones"**
4. Genera una contraseña para **"Correo"**
5. Copia la contraseña de 16 caracteres
6. Pégala en `EMAIL_PASSWORD` (sin espacios)

### 4. **Instalar Dependencias y Reiniciar**

```bash
# Ir al directorio del proyecto
cd c:\Users\Julian Cancelo\Documents\Proyectos\INSO2

# Levantar servicios
docker-compose up -d

# Instalar nodemailer en el backend
docker exec menu-backend npm install nodemailer

# Reiniciar backend
docker-compose restart backend

# Reiniciar frontend
docker-compose restart frontend
```

---

## 🧪 Cómo Probar el Flujo Completo

### **Paso 1: Solicitud desde Landing**
1. Abre `http://localhost:3000/`
2. Completa el formulario de solicitud
3. Click en **"Enviar Solicitud"**
4. Deberías ver mensaje de éxito

### **Paso 2: Revisar como Superadmin**
1. Login como superadmin: `http://localhost:3000/admin/login`
2. Ve a **"Solicitudes"** desde el dashboard
3. Verás la solicitud en estado **Pendiente**

### **Paso 3: Aprobar Solicitud**
1. Click en **"Aprobar"** en la solicitud
2. Elige una opción:
   - **"Enviar Invitación por Email"**: Se enviará automáticamente
   - **"Generar Enlace (Copiar)"**: Se copia al portapapeles

### **Paso 4: Completar Registro (Admin de Local)**
1. Abre el enlace recibido (email o copiado)
2. Verás página de registro personalizada
3. Completa tu información
4. Click en **"Completar Registro"**

### **Paso 5: Usar el Sistema (Admin de Local)**
1. Login en `/admin/login`
2. Verás tu dashboard con tu local asignado
3. Crea categorías en `/admin/categorias`
4. (Próximamente) Crea productos, gestiona pedidos, etc.

---

## 📊 Modelos de Base de Datos

### **Solicitud**
```sql
CREATE TABLE solicitudes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombreNegocio VARCHAR(255) NOT NULL,
  nombreContacto VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(50),
  tipoNegocio VARCHAR(100),
  mensaje TEXT,
  estado ENUM('pendiente', 'aprobada', 'rechazada') DEFAULT 'pendiente',
  localCreado INT,
  invitacionEnviada BOOLEAN DEFAULT false,
  revisadoPor INT,
  notas TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### **Invitacion**
```sql
CREATE TABLE invitaciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  token VARCHAR(64) UNIQUE NOT NULL,
  localId INT NOT NULL,
  email VARCHAR(255),
  rol ENUM('admin', 'staff') NOT NULL,
  usado BOOLEAN DEFAULT false,
  usadoPor INT,
  expiresAt DATETIME NOT NULL,
  creadoPor INT NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

---

## 🔌 Endpoints API

### **Solicitudes**
```
POST   /api/solicitudes              - Crear solicitud (público)
GET    /api/solicitudes              - Ver todas (superadmin)
POST   /api/solicitudes/:id/aprobar  - Aprobar y crear local
POST   /api/solicitudes/:id/rechazar - Rechazar
DELETE /api/solicitudes/:id          - Eliminar
```

### **Invitaciones**
```
POST   /api/invitations                    - Crear invitación
GET    /api/invitations/local/:id          - Ver invitaciones del local
GET    /api/invitations/validate/:token    - Validar token (público)
POST   /api/invitations/register/:token    - Completar registro (público)
DELETE /api/invitations/:id                - Eliminar invitación
```

---

## ✅ Funcionalidades Implementadas

### **Backend**
- ✅ Modelo `Solicitud` con relaciones
- ✅ Modelo `Invitacion` con tokens únicos
- ✅ Sistema de emails con Nodemailer + Gmail
- ✅ Endpoints para solicitudes (CRUD)
- ✅ Endpoints para invitaciones (CRUD + validación)
- ✅ Creación automática de local al aprobar
- ✅ Notificaciones por email

### **Frontend**
- ✅ Landing page atractiva con formulario
- ✅ Dashboard de solicitudes para superadmin
- ✅ Filtros por estado (pendiente/aprobada/rechazada)
- ✅ Modal de aprobación con 2 opciones
- ✅ Página de registro por invitación
- ✅ Validación de tokens
- ✅ Integración completa del flujo

### **UX/UI**
- ✅ Diseño responsive y moderno
- ✅ Notificaciones toast
- ✅ Loading states
- ✅ Validaciones en tiempo real
- ✅ Emails HTML profesionales

---

## 🎯 Próximos Pasos Sugeridos

1. **Sistema de Productos**
   - Modal para crear/editar productos
   - Upload de imágenes
   - Asignación a categorías

2. **Personalización de Local**
   - Editor de colores
   - Upload de logo
   - Configuración de horarios

3. **Gestión de Staff**
   - Invitar staff (rol staff)
   - Permisos granulares

4. **Reportes y Analytics**
   - Ventas por período
   - Productos más vendidos
   - Gráficos

---

## 🐛 Troubleshooting

### **Email no se envía**
- Verifica que `EMAIL_USER` y `EMAIL_PASSWORD` estén correctos
- Asegúrate de usar una **App Password**, no tu contraseña de Gmail
- Verifica que Gmail permita "aplicaciones menos seguras"
- Revisa logs del backend: `docker logs menu-backend`

### **Token inválido o expirado**
- Los tokens expiran en 7 días por defecto
- Genera uno nuevo desde `/admin/solicitudes`

### **No veo solicitudes en el dashboard**
- Asegúrate de estar logueado como **superadmin**
- Verifica que hay solicitudes en la BD
- Revisa la consola del navegador (F12)

---

## 📝 Notas Importantes

- Las invitaciones expiran en **7 días** por defecto
- Cada token solo puede usarse **una vez**
- Los emails se envían de forma asíncrona
- El superadmin recibe notificación automática de nuevas solicitudes
- Los colores del local se aplican automáticamente en el registro

---

¡Listo! El sistema está completamente implementado y funcional. 🎉
