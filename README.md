# 🍔 App de Menú Digital Multi-Local

Aplicación completa de menú digital para restaurantes, bares y locales gastronómicos. Sistema multi-local con personalización por establecimiento.

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
