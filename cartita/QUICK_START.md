# 🚀 Quick Start - Cartita Next.js

Guía rápida para poner en marcha Cartita en Next.js en menos de 5 minutos.

---

## ⚡ Instalación Rápida

```bash
# 1. Navegar a la carpeta
cd cartita

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales

# 4. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) 🎉

---

## 📝 Configuración Mínima

### 1. Variables de Entorno (.env.local)

```env
# Base de datos (REQUERIDO)
DATABASE_URL=postgresql://user:password@localhost:5432/cartita

# JWT (REQUERIDO)
JWT_SECRET=cambia-esto-por-algo-seguro-en-produccion

# URLs (Opcional en desarrollo)
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### 2. Base de Datos

#### Opción A: PostgreSQL Local

```bash
# Crear base de datos
createdb cartita

# Ejecutar migraciones
npm run db:migrate
```

#### Opción B: Neon (Recomendado)

1. Crear cuenta en [neon.tech](https://neon.tech)
2. Crear proyecto
3. Copiar `DATABASE_URL` a `.env.local`
4. Ejecutar migraciones: `npm run db:migrate`

---

## 🎯 Estructura del Proyecto

```
cartita/
├── src/
│   ├── app/              # 🛣️ Rutas (Next.js App Router)
│   │   ├── page.jsx      # Landing page (/)
│   │   ├── admin/        # Panel admin (/admin/*)
│   │   ├── menu/         # Menú digital (/menu/:id)
│   │   └── api/          # Backend API (/api/*)
│   │
│   ├── components/       # 🧩 Componentes React
│   │   ├── shared/       # Compartidos
│   │   ├── pages/        # De página
│   │   ├── admin/        # Admin
│   │   └── cliente/      # Cliente
│   │
│   ├── context/          # 🔄 React Context
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── LocalContext.jsx
│   │
│   └── lib/              # 🛠️ Utilidades
│       ├── api.js        # Cliente API
│       ├── database.js   # PostgreSQL
│       └── socket.js     # Socket.IO
│
├── public/               # 📁 Archivos estáticos
├── .env.local           # 🔐 Variables de entorno
└── package.json         # 📦 Dependencias
```

---

## 🔑 Rutas Principales

### Públicas
- `/` - Landing page
- `/menu/[localId]` - Menú digital del local

### Admin (Requieren autenticación)
- `/admin/login` - Login
- `/admin` - Dashboard
- `/admin/productos` - Gestión de productos
- `/admin/pedidos` - Gestión de pedidos
- `/admin/usuarios` - Gestión de usuarios
- `/admin/qr` - Generador de QR

### API
- `/api/auth/login` - Autenticación
- `/api/productos` - CRUD productos
- `/api/pedidos` - CRUD pedidos
- `/api/locales` - CRUD locales

---

## 🧪 Testing Rápido

### 1. Crear Usuario Admin

```sql
-- Ejecutar en tu base de datos
INSERT INTO usuarios (nombre, email, password, rol) 
VALUES (
  'Admin',
  'admin@cartita.com',
  '$2a$10$XQqy4Zy5Z5Z5Z5Z5Z5Z5ZuXXXXXXXXXXXXXXXXXXXXXXXX', -- admin123
  'superadmin'
);
```

### 2. Login

1. Ir a [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Email: `admin@cartita.com`
3. Password: `admin123`

### 3. Crear Primer Local

1. Dashboard → Locales → Nuevo Local
2. Completar datos
3. Guardar

### 4. Ver Menú Digital

1. Ir a `/menu/[slug-del-local]`
2. Ver menú público

---

## 📦 Scripts Útiles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo

# Producción
npm run build            # Build para producción
npm run start            # Servidor de producción

# Base de datos
npm run db:migrate       # Ejecutar migraciones
npm run db:seed          # Seed de datos de prueba
npm run db:reset         # Reset completo

# Utilidades
npm run lint             # Linter
npm run format           # Formatear código
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Database connection failed"

1. Verificar que PostgreSQL esté corriendo
2. Verificar `DATABASE_URL` en `.env.local`
3. Verificar que la base de datos exista

### Error: "Port 3000 already in use"

```bash
# Cambiar puerto
PORT=3001 npm run dev
```

### Warnings de Tailwind en CSS

Los warnings `Unknown at rule @tailwind` son normales y no afectan el funcionamiento. Son del linter CSS que no reconoce las directivas de Tailwind.

---

## 🚀 Deploy Rápido en Vercel

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Configurar variables de entorno en Vercel Dashboard
# - DATABASE_URL
# - JWT_SECRET
# - Otras...

# 5. Deploy a producción
vercel --prod
```

---

## 📚 Próximos Pasos

1. ✅ Configurar base de datos
2. ✅ Crear usuario admin
3. ✅ Crear primer local
4. ✅ Agregar productos
5. ✅ Generar QR del menú
6. ✅ Probar pedidos
7. 🚀 Deploy a producción

---

## 💡 Tips

### Desarrollo Rápido

```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Logs de base de datos
npm run db:logs

# Terminal 3: Tests
npm run test:watch
```

### Hot Reload

Next.js tiene hot reload automático. Los cambios se reflejan instantáneamente.

### Debugging

```javascript
// En Server Components
console.log('Server:', data); // Se ve en terminal

// En Client Components
console.log('Client:', data); // Se ve en navegador
```

---

## 🆘 Ayuda

- 📖 [README.md](README.md) - Documentación completa
- 📘 [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Guía de migración
- 🌐 [Next.js Docs](https://nextjs.org/docs)
- 💬 [GitHub Issues](https://github.com/tu-usuario/cartita/issues)

---

<div align="center">

**¡Listo para empezar! 🎉**

[⬆ Volver arriba](#-quick-start---cartita-nextjs)

</div>
