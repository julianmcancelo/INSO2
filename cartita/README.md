# 🍽️ Cartita - Next.js Version

<div align="center">

### **[cartita.digital](https://cartita.digital)**

*La plataforma definitiva para digitalizar tu restaurante - Migrado a Next.js 14*

[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)

</div>

---

## 🎯 ¿Qué es Cartita?

Cartita es una plataforma completa de menú digital y gestión de pedidos para restaurantes, ahora potenciada por **Next.js 14** con App Router para mejor SEO, performance y experiencia de desarrollo.

### ✨ Características Principales

- 🚀 **Next.js 14 App Router** - Routing moderno y optimizado
- 🔍 **SEO Optimizado** - Server-Side Rendering para mejor indexación
- ⚡ **Performance Mejorada** - React Server Components y streaming
- 📱 **100% Responsive** - Diseño mobile-first con Tailwind CSS
- 🔐 **Autenticación JWT** - Sistema seguro de autenticación
- 🛒 **Pedidos en Tiempo Real** - Socket.IO integrado
- 📊 **Panel Admin Completo** - Gestión de productos, pedidos y usuarios
- 🎨 **UI Moderna** - Componentes reutilizables y diseño profesional

---

## 🏗️ Arquitectura

```
cartita/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Rutas públicas
│   │   │   ├── page.jsx       # Landing page
│   │   │   └── menu/          # Menú digital
│   │   ├── admin/             # Panel administrativo
│   │   │   ├── login/
│   │   │   ├── productos/
│   │   │   ├── pedidos/
│   │   │   └── ...
│   │   ├── api/               # API Routes
│   │   │   ├── auth/
│   │   │   ├── productos/
│   │   │   ├── pedidos/
│   │   │   └── ...
│   │   ├── layout.jsx         # Root layout
│   │   ├── providers.jsx      # Context providers
│   │   └── globals.css        # Estilos globales
│   ├── components/            # Componentes React
│   │   ├── shared/           # Componentes compartidos
│   │   ├── pages/            # Componentes de página
│   │   ├── admin/            # Componentes admin
│   │   └── cliente/          # Componentes cliente
│   ├── context/              # React Context
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── LocalContext.jsx
│   ├── lib/                  # Utilidades y helpers
│   │   ├── api.js           # Cliente API
│   │   ├── database.js      # Conexión PostgreSQL
│   │   ├── middleware.js    # Middlewares
│   │   └── socket.js        # Socket.IO client
│   └── utils/               # Funciones auxiliares
├── public/                  # Archivos estáticos
├── .env.local              # Variables de entorno
├── next.config.js          # Configuración Next.js
├── tailwind.config.js      # Configuración Tailwind
└── package.json
```

---

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+ instalado
- PostgreSQL 14+ o cuenta en Neon/Supabase
- npm o yarn

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/cartita.git
cd cartita

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales

# 4. Ejecutar migraciones de base de datos
npm run db:migrate

# 5. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔧 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/cartita

# JWT
JWT_SECRET=tu-secreto-super-seguro-cambialo-en-produccion

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-password-de-aplicacion
EMAIL_FROM=noreply@cartita.digital

# URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# Node
NODE_ENV=development
```

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run start        # Inicia servidor de producción

# Utilidades
npm run lint         # Ejecuta ESLint
npm run db:migrate   # Ejecuta migraciones de BD
npm run db:seed      # Seed de datos iniciales
```

---

## 🌐 Deployment

### Vercel (Recomendado)

1. Push tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura las variables de entorno
4. Deploy automático ✨

```bash
# O usando Vercel CLI
npm i -g vercel
vercel
```

### Railway / Render

1. Conecta tu repositorio
2. Configura las variables de entorno
3. Deploy automático

---

## 🔑 Credenciales por Defecto

**Admin de prueba:**
- Email: `admin@cartita.com`
- Password: `admin123`

⚠️ **Cambiar en producción**

---

## 📊 Base de Datos

### Esquema Principal

- **usuarios** - Administradores y staff
- **locales** - Restaurantes/locales
- **categorias** - Categorías del menú
- **productos** - Productos con imágenes
- **pedidos** - Pedidos de clientes
- **pedido_items** - Items de cada pedido
- **configuracion_global** - Configuración del sistema

### Migraciones

```bash
# Crear nueva migración
npm run db:migration:create nombre_migracion

# Ejecutar migraciones pendientes
npm run db:migrate

# Rollback última migración
npm run db:rollback
```

---

## 🎨 Tecnologías Utilizadas

### Frontend
- **Next.js 14** - React framework con App Router
- **React 18** - Librería UI
- **Tailwind CSS** - Estilos utility-first
- **Lucide React** - Iconos modernos
- **React Toastify** - Notificaciones
- **Socket.IO Client** - WebSockets

### Backend (API Routes)
- **Next.js API Routes** - Endpoints serverless
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación
- **Bcrypt** - Hashing de contraseñas
- **Nodemailer** - Envío de emails

### DevOps
- **Vercel** - Hosting y deployment
- **Neon/Supabase** - PostgreSQL en la nube
- **GitHub Actions** - CI/CD (opcional)

---

## 📝 Diferencias con la Versión CRA

### Mejoras

✅ **SEO Mejorado** - SSR/SSG para mejor indexación en Google  
✅ **Performance** - 40-60% más rápido con Server Components  
✅ **Deployment Simplificado** - Todo en Vercel (frontend + backend)  
✅ **Developer Experience** - File-based routing, mejor DX  
✅ **Optimizaciones Automáticas** - Imágenes, fonts, scripts  

### Cambios Importantes

🔄 **Routing** - De React Router a Next.js App Router  
🔄 **API** - De Express separado a API Routes integradas  
🔄 **Data Fetching** - Server Components + Client Components  
🔄 **Navegación** - `useRouter` de Next.js en lugar de React Router  

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles

---

## 👥 Equipo

Desarrollado con ♥ por el equipo de Ingeniería 2

---

## 📞 Soporte

- 📧 Email: soporte@cartita.digital
- 🌐 Web: [cartita.digital](https://cartita.digital)
- 📚 Docs: [docs.cartita.digital](https://docs.cartita.digital)

---

## 🗺️ Roadmap

- [ ] Multi-idioma (i18n)
- [ ] Integración de pagos (Mercado Pago)
- [ ] App móvil nativa
- [ ] Reportes avanzados
- [ ] Integración con delivery
- [ ] Sistema de reservas

---

<div align="center">

**[⬆ Volver arriba](#-cartita---nextjs-version)**

</div>
