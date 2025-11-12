# 🍽️ Cartita - Sistema Multi-Local

<div align="center">

### **[cartita.digital](https://cartita.digital)**

*La plataforma definitiva para digitalizar tu restaurante en 2025*

[![Año](https://img.shields.io/badge/Año-2025-blue.svg)](https://cartita.digital)
[![Estado](https://img.shields.io/badge/Estado-Producción-success.svg)](https://cartita.digital)
[![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-orange.svg)](https://cartita.digital)

</div>

---

## 🌟 Introducción

En **2025**, la industria gastronómica ha evolucionado completamente hacia lo digital. Los clientes esperan experiencias sin fricción: escanear un código QR, ver el menú en sus dispositivos y hacer pedidos en segundos.

**Cartita** es la plataforma completa que permite a restaurantes, bares y locales gastronómicos ofrecer una experiencia digital de primera clase:

- ✨ **Sin Apps**: Los clientes acceden desde el navegador, sin descargas
- 🚀 **Setup en Minutos**: De solicitud a menú online en 24 horas
- 💰 **Sin Permanencia**: Prueba gratuita de 30 días
- 📱 **100% Móvil**: Diseñado para la generación mobile-first
- 🏢 **Multi-Local**: Ideal para cadenas o grupos gastronómicos
- ⚡ **Tiempo Real**: Pedidos y notificaciones instantáneas con WebSockets

> 📖 **Para una introducción detallada**, lee [INTRODUCCION.md](INTRODUCCION.md)

---

## 📋 Descripción

Aplicación completa de carta digital para restaurantes, bares y locales gastronómicos. Sistema multi-local con menú QR, pedidos online y personalización por establecimiento.

## 🏗️ Arquitectura

- **Frontend**: React + Tailwind CSS + Socket.IO Client
- **Backend**: Node.js + Express + Socket.IO
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Contenedores**: Docker + Docker Compose

## ✨ Características Principales

### Flujo del Cliente
1. Ingresa al menú digital del local
2. Ve productos organizados por categorías
3. Selecciona productos y personaliza opciones
4. Agrega al carrito
5. Confirma pedido (mesa, para llevar o delivery)
6. Recibe confirmación y tiempo estimado

### Flujo del Administrador
1. Gestión de productos (fotos, precios, descripciones)
2. Creación de categorías
3. Control de disponibilidad en tiempo real
4. Recepción de pedidos en vivo
5. Gestión de estados (pendiente, preparación, listo, entregado)
6. Modificación de precios y productos

### Sistema Multi-Local
- Cada local tiene su propio menú
- Personalización de logo y colores
- Datos completamente aislados por local
- Múltiples locales en una sola instalación

## 🚀 Inicio Rápido

### Prerequisitos
- Docker Desktop instalado

### Instalación

```bash
# Levantar todos los servicios
docker-compose up --build

# Acceder a:
# Frontend (Cliente): http://localhost:3000
# Backend (API): http://localhost:5000
# Base de Datos: localhost:5432
```

### Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Detener servicios
docker-compose down

# Reset completo (eliminar datos)
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache

# Acceder a la base de datos
docker exec -it menu-db psql -U menuadmin -d menu_digital
```

## 🗄️ Opciones de Base de Datos

### Opción 1: Neon (PostgreSQL) - **RECOMENDADO** ✅

Usa la misma base de datos para desarrollo y producción:

```bash
# 1. Crear cuenta en Neon: https://console.neon.tech
# 2. Copiar connection string
# 3. Configurar backend/.env con credenciales de Neon
# 4. Levantar con docker-compose.neon.yml

docker-compose -f docker-compose.neon.yml up -d
```

**Ventajas:**
- ✅ Misma BD en desarrollo y producción
- ✅ Sin diferencias MySQL vs PostgreSQL
- ✅ Tier gratuito generoso (0.5 GB)
- ✅ Branching de base de datos
- ✅ Backups automáticos

📖 **Guía completa**: [DESARROLLO_CON_NEON.md](DESARROLLO_CON_NEON.md)

### Opción 2: MySQL Local (Docker)

Usa MySQL local con Docker:

```bash
# Usar docker-compose.yml estándar
docker-compose up -d
```

## 📊 Esquema de Base de Datos

- **locales**: Información del local (nombre, logo, colores)
- **usuarios**: Administradores y staff
- **categorias**: Categorías del menú (hamburguesas, bebidas, etc.)
- **productos**: Productos del menú con fotos en Base64
- **opciones**: Opciones de personalización (extras, tamaño, etc.)
- **pedidos**: Pedidos realizados
- **pedido_items**: Items de cada pedido

## 🔐 Autenticación

Sistema basado en JWT:
- Login admin → Token JWT
- Token en localStorage
- Header: `Authorization: Bearer <token>`

## 🔄 Tiempo Real con Socket.IO

Sincronización instantánea:
- Nuevos pedidos al admin
- Cambios de estado a clientes
- Actualización de disponibilidad
- Notificaciones en vivo

## 📁 Estructura del Proyecto

```
INSO2/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── sockets/
│   │   └── server.js
│   ├── database/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🛠️ Desarrollo

Los servicios se auto-recargan al detectar cambios (hot reload habilitado).

## 🌐 Despliegue en Producción

### Arquitectura Recomendada: Vercel + Neon ⭐

```
┌─────────────────────────┐      ┌─────────────┐
│       Vercel            │ ───> │    Neon     │
│  Frontend + Backend API │      │ PostgreSQL  │
└─────────────────────────┘      └─────────────┘
```

**Todo en un solo lugar** - Más simple y eficiente

### 🚀 Despliegue en 3 Pasos

#### 1. Crear Base de Datos en Neon

```bash
# 1. Ir a https://neon.tech
# 2. Crear proyecto
# 3. Copiar DATABASE_URL
```

#### 2. Desplegar en Vercel

```bash
# 1. Ir a https://vercel.com/new
# 2. Importar repo de GitHub
# 3. Configurar variables de entorno
# 4. Deploy (frontend + backend juntos)
```

#### 3. Crear Usuario Admin

```sql
-- En Neon SQL Editor
INSERT INTO usuarios ...
```

📖 **Guía completa paso a paso**: [DEPLOY_VERCEL_NEON.md](DEPLOY_VERCEL_NEON.md)

### Alternativas de Despliegue

- **Railway + Neon**: [NEON_RAILWAY_SETUP.md](NEON_RAILWAY_SETUP.md)
- **Vercel Solo Frontend**: [QUICK_START_VERCEL.md](QUICK_START_VERCEL.md)

### Variables de Entorno en Producción

```env
# Frontend (Vercel)
REACT_APP_API_URL=https://tu-backend.railway.app
REACT_APP_SOCKET_URL=https://tu-backend.railway.app

# Backend (Railway/Render)
NODE_ENV=production
DB_HOST=tu-db-host
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_NAME=menu_digital
JWT_SECRET=tu-secreto-seguro
FRONTEND_URL=https://tu-app.vercel.app
```

## 📝 Credenciales por Defecto

**Base de Datos:**
- Usuario: `menuadmin`
- Password: `menupass123`
- DB: `menu_digital`

**Admin de prueba:**
- Email: `admin@restaurante.com`
- Password: `admin123`

**Local de prueba:**
- Nombre: "Restaurante El Buen Sabor"
- Slug: `restaurante-buen-sabor`
- URL: http://localhost:3000/restaurante-buen-sabor

## 📄 Licencia

MIT
