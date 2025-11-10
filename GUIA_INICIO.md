# 🚀 Guía de Inicio - App de Menú Digital

## ⚡ Inicio Rápido

### 1. Levantar los servicios con Docker

```bash
# Asegúrate de estar en la raíz del proyecto
cd "C:\Users\Julian Cancelo\Documents\Proyectos\INSO2"

# Levantar todos los servicios
docker-compose up --build
```

**Esto levantará:**
- PostgreSQL (Base de datos) en puerto 5432
- Backend (API) en puerto 5000
- Frontend (React) en puerto 3000

### 2. Configuración Inicial

La base de datos inicia **VACÍA**. Al abrir la aplicación por primera vez:

1. Accede a http://localhost:3000
2. Se mostrará automáticamente la página de **Setup Inicial**
3. Completa los datos:
   - **Paso 1**: Información de tu local (nombre, slug, colores)
   - **Paso 2**: Datos del administrador (nombre, email, contraseña)
4. Haz clic en "Finalizar Setup"

¡Listo! Serás redirigido automáticamente al panel de administración.
- Frontend (React) en puerto 3000

### 2. Esperar a que los servicios estén listos

Verás en la consola:
- ✅ Conexión a PostgreSQL establecida correctamente
- ✅ Modelos sincronizados con la base de datos
- 🚀 Servidor corriendo en http://localhost:5000
- ✅ Webpack compiled successfully (Frontend)

### 3. Acceder a la aplicación

**Como Cliente (Ver Menú y hacer pedidos):**
- URL: http://localhost:3000/restaurante-buen-sabor
- Puedes navegar por el menú, agregar productos al carrito y hacer un pedido

**Como Administrador:**
- URL: http://localhost:3000/admin/login
- Email: `admin@restaurante.com`
- Password: `admin123`

## 📝 Datos Iniciales

La base de datos inicia **completamente vacía**. Tú defines:

- Nombre y slug de tu local
- Colores personalizados
- Tu usuario administrador

Después del setup inicial, deberás crear:
- Categorías del menú
- Productos
- Gestionar pedidos en tiempo real

## Funcionalidades Implementadas

### Flujo del Cliente ✅
- ✅ Ver menú organizado por categorías
- ✅ Buscar productos
- ✅ Filtrar por categoría
- ✅ Agregar productos al carrito
- ✅ Personalizar productos (extras, opciones)
- ✅ Confirmar pedido (mesa, para llevar, delivery)
- ✅ Seguimiento en tiempo real del pedido

### Flujo del Administrador ✅
- ✅ Login con autenticación JWT
- ✅ Dashboard con estadísticas del día
- ✅ Gestión de pedidos en tiempo real
- ✅ Cambiar estado de pedidos
- ✅ Ver productos por categoría
- ✅ Activar/desactivar disponibilidad de productos
- ✅ Gestionar categorías

### Características Técnicas ✅
- ✅ Socket.IO para actualizaciones en tiempo real
- ✅ Multi-tenant (cada local tiene sus propios datos)
- ✅ Personalización de colores por local
- ✅ Imágenes en Base64
- ✅ Responsive design con Tailwind CSS
- ✅ Dockerizado completamente

## Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs -f backend

# Ver logs solo del frontend
docker-compose logs -f frontend

# Detener los servicios
docker-compose down

# Reiniciar desde cero (elimina datos)
docker-compose down -v
docker-compose up --build

# Reconstruir solo un servicio
docker-compose up --build backend
```

## Acceso a la Base de Datos

```bash
# Conectarse al contenedor de PostgreSQL
docker exec -it menu-db psql -U menuadmin -d menu_digital

# Consultas útiles
\dt                    # Listar tablas
SELECT * FROM locales;
SELECT * FROM productos;
SELECT * FROM pedidos;
\q                     # Salir
```

## Estructura de URLs

### Cliente
- `/restaurante-buen-sabor` - Menú principal
- `/restaurante-buen-sabor/confirmacion` - Confirmar pedido
- `/restaurante-buen-sabor/pedido/:id` - Seguimiento de pedido

### Admin
- `/admin/login` - Login
- `/admin` - Dashboard
- `/admin/pedidos` - Gestión de pedidos
- `/admin/productos` - Gestión de productos
- `/admin/categorias` - Gestión de categorías

## Próximos Pasos Sugeridos

1. **Añadir funcionalidad completa de CRUD** para productos y categorías
2. **Implementar subida de imágenes** (actualmente manual en Base64)
3. **Agregar notificaciones por email** al confirmar pedidos
4. **Implementar panel de estadísticas** más completo
5. **Agregar gestión de horarios** del local
6. **Implementar sistema de impresión** de tickets
7. **Añadir roles de usuarios** (admin, staff)

## Solución de Problemas

### Puerto ya en uso
```bash
# Si el puerto 3000, 5000 o 5432 está ocupado
docker-compose down
# Cambiar el puerto en docker-compose.yml
```

### Base de datos no se inicializa
```bash
docker-compose down -v
docker-compose up --build
```

### Frontend no compila
```bash
docker-compose down
docker-compose build --no-cache frontend
docker-compose up
```

## Tecnologías Utilizadas

- **Frontend**: React 18, Tailwind CSS, React Router, Socket.IO Client, Axios
- **Backend**: Node.js, Express, Socket.IO, Sequelize, JWT, bcryptjs
- **Base de Datos**: PostgreSQL 15
- **Infraestructura**: Docker, Docker Compose
