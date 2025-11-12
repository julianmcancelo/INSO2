# 🏗️ Arquitectura del Sistema - Cartita

## 📋 Índice
- [Visión General](#visión-general)
- [Arquitectura de Alto Nivel](#arquitectura-de-alto-nivel)
- [Frontend](#frontend)
- [Backend](#backend)
- [Base de Datos](#base-de-datos)
- [Comunicación en Tiempo Real](#comunicación-en-tiempo-real)
- [Seguridad](#seguridad)
- [Deployment](#deployment)

---

## 🎯 Visión General

Cartita es una aplicación web full-stack construida con arquitectura cliente-servidor, utilizando tecnologías modernas y patrones de diseño escalables.

### Características Arquitectónicas

- **Arquitectura:** Cliente-Servidor (3 capas)
- **Patrón:** MVC (Modelo-Vista-Controlador)
- **Comunicación:** REST API + WebSockets
- **Autenticación:** JWT (JSON Web Tokens)
- **Base de Datos:** MySQL (Relacional)
- **Contenedores:** Docker + Docker Compose

---

## 🌐 Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CAPA DE PRESENTACIÓN                       │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Landing    │  │    Admin     │  │    Menu      │              │
│  │    Page      │  │    Panel     │  │   Digital    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│         │                  │                  │                      │
│         └──────────────────┴──────────────────┘                      │
│                            │                                          │
│                    React Application                                 │
│                            │                                          │
│              ┌─────────────┴─────────────┐                          │
│              │                           │                          │
│         HTTP/HTTPS                  WebSocket                       │
│              │                           │                          │
└──────────────┼───────────────────────────┼──────────────────────────┘
               │                           │
┌──────────────┼───────────────────────────┼──────────────────────────┐
│              │      CAPA DE LÓGICA       │                          │
│              │                           │                          │
│         ┌────▼────┐              ┌───────▼──────┐                  │
│         │   API   │              │  Socket.IO   │                  │
│         │ Routes  │              │    Server    │                  │
│         └────┬────┘              └──────────────┘                  │
│              │                                                       │
│         ┌────▼────────────────────────────┐                        │
│         │      Middleware Layer           │                        │
│         │  ┌──────┐ ┌──────┐ ┌──────┐   │                        │
│         │  │ Auth │ │ CORS │ │ Rate │   │                        │
│         │  └──────┘ └──────┘ └──────┘   │                        │
│         └────┬────────────────────────────┘                        │
│              │                                                       │
│         ┌────▼────────────────────────────┐                        │
│         │       Controllers               │                        │
│         │  ┌──────┐ ┌──────┐ ┌──────┐   │                        │
│         │  │Local │ │Pedido│ │User  │   │                        │
│         │  └──────┘ └──────┘ └──────┘   │                        │
│         └────┬────────────────────────────┘                        │
│              │                                                       │
│         ┌────▼────────────────────────────┐                        │
│         │      Sequelize ORM              │                        │
│         └────┬────────────────────────────┘                        │
│              │                                                       │
└──────────────┼───────────────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────────────┐
│                        CAPA DE DATOS                                  │
│                                                                       │
│                    ┌─────────────────┐                              │
│                    │     MySQL       │                              │
│                    │   Database      │                              │
│                    └─────────────────┘                              │
│                                                                       │
│  Tablas:                                                             │
│  - locales          - usuarios        - categorias                  │
│  - productos        - pedidos         - pedido_items                │
│  - opciones         - configuracion_global                          │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Frontend

### Tecnologías
- **Framework:** React 18.x
- **Routing:** React Router v6
- **Estado:** Context API + Hooks
- **Estilos:** TailwindCSS 3.x
- **Iconos:** Lucide React
- **HTTP Client:** Axios
- **WebSocket:** Socket.IO Client
- **Notificaciones:** React Toastify

### Estructura de Carpetas

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── BrandLogo.jsx
│   │   ├── ProductoCard.jsx
│   │   ├── CartModal.jsx
│   │   └── ...
│   ├── context/             # Context API
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/               # Páginas/Vistas
│   │   ├── admin/
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── AdminProductos.jsx
│   │   │   └── ...
│   │   ├── cliente/
│   │   │   └── MenuPage.jsx
│   │   └── LandingPage.jsx
│   ├── services/            # Servicios API
│   │   ├── api.js
│   │   └── socket.js
│   ├── utils/               # Utilidades
│   ├── App.jsx              # Componente principal
│   ├── index.js             # Entry point
│   └── index.css            # Estilos globales
├── Dockerfile
├── nginx.conf
└── package.json
```

### Patrones de Diseño

#### 1. Context API para Estado Global
```javascript
// AuthContext.jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lógica de autenticación...

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### 2. Custom Hooks
```javascript
// useAuth.js
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

#### 3. Protected Routes
```javascript
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/admin/login" />;
  if (roles && !roles.includes(user.rol)) return <Navigate to="/" />;
  
  return children;
};
```

---

## ⚙️ Backend

### Tecnologías
- **Runtime:** Node.js 20.x
- **Framework:** Express 4.x
- **ORM:** Sequelize 6.x
- **Database:** MySQL 8.x
- **Authentication:** JWT (jsonwebtoken)
- **Encryption:** Bcrypt
- **WebSocket:** Socket.IO
- **Email:** Nodemailer / SendGrid
- **Validation:** Express Validator

### Estructura de Carpetas

```
backend/
├── src/
│   ├── config/              # Configuraciones
│   │   ├── database.js
│   │   ├── email.js
│   │   └── socket.js
│   ├── controllers/         # Controladores (Lógica de negocio)
│   │   ├── auth.controller.js
│   │   ├── local.controller.js
│   │   ├── producto.controller.js
│   │   ├── pedido.controller.js
│   │   └── password.controller.js
│   ├── middleware/          # Middlewares
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── error.middleware.js
│   ├── models/              # Modelos Sequelize
│   │   ├── Local.js
│   │   ├── Usuario.js
│   │   ├── Producto.js
│   │   ├── Pedido.js
│   │   └── index.js
│   ├── routes/              # Rutas API
│   │   ├── auth.js
│   │   ├── locales.js
│   │   ├── productos.js
│   │   ├── pedidos.js
│   │   └── password.js
│   ├── sockets/             # Eventos Socket.IO
│   │   └── pedidos.socket.js
│   ├── utils/               # Utilidades
│   │   └── jwt.js
│   └── server.js            # Entry point
├── database/
│   └── init.sql             # Script inicial
├── Dockerfile
└── package.json
```

### Arquitectura MVC

```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
┌──────▼──────┐
│   Routes    │ ← Define endpoints
└──────┬──────┘
       │
┌──────▼──────┐
│ Middleware  │ ← Auth, Validation
└──────┬──────┘
       │
┌──────▼──────┐
│ Controller  │ ← Lógica de negocio
└──────┬──────┘
       │
┌──────▼──────┐
│   Model     │ ← Acceso a datos
└──────┬──────┘
       │
┌──────▼──────┐
│  Database   │
└──────┬──────┘
       │
┌──────▼──────┐
│  Response   │
└─────────────┘
```

### Ejemplo de Flujo

```javascript
// 1. Route (routes/productos.js)
router.get('/', authMiddleware, productoController.getAll);

// 2. Middleware (middleware/auth.middleware.js)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// 3. Controller (controllers/producto.controller.js)
exports.getAll = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [Categoria]
    });
    res.json({ productos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Model (models/Producto.js)
const Producto = sequelize.define('Producto', {
  nombre: DataTypes.STRING,
  precio: DataTypes.DECIMAL(10, 2),
  // ...
});
```

---

## 🗄️ Base de Datos

### Diagrama ER

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   locales   │──────<│   usuarios   │       │ categorias  │
└─────────────┘       └──────────────┘       └─────────────┘
      │                                              │
      │                                              │
      │               ┌──────────────┐              │
      └──────────────>│  productos   │<─────────────┘
                      └──────────────┘
                            │
                            │
                      ┌─────▼──────┐
                      │  opciones  │
                      └────────────┘
                            
┌──────────────┐      ┌──────────────┐
│   pedidos    │─────<│ pedido_items │
└──────────────┘      └──────────────┘
       │                     │
       │                     │
       └─────────────────────┘
```

### Esquema Detallado

#### Tabla: locales
```sql
CREATE TABLE locales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  descripcion TEXT,
  logoBase64 LONGTEXT,
  colorPrimario VARCHAR(7) DEFAULT '#ef4444',
  colorSecundario VARCHAR(7) DEFAULT '#f59e0b',
  direccion VARCHAR(255),
  telefono VARCHAR(50),
  email VARCHAR(255),
  horarioAtencion JSON,
  datosBancarios JSON,
  configuracion JSON,
  activo BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Tabla: usuarios
```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  localId INT,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('superadmin', 'admin', 'mesero') DEFAULT 'mesero',
  activo BOOLEAN DEFAULT true,
  resetPasswordToken VARCHAR(255),
  resetPasswordExpires DATETIME,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (localId) REFERENCES locales(id)
);
```

#### Tabla: productos
```sql
CREATE TABLE productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  localId INT NOT NULL,
  categoriaId INT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  imagenBase64 LONGTEXT,
  disponible BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,
  orden INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (localId) REFERENCES locales(id),
  FOREIGN KEY (categoriaId) REFERENCES categorias(id)
);
```

---

## 🔄 Comunicación en Tiempo Real

### Socket.IO Architecture

```
┌─────────────────┐                    ┌─────────────────┐
│     Cliente     │                    │     Admin       │
│   (MenuPage)    │                    │   (Dashboard)   │
└────────┬────────┘                    └────────┬────────┘
         │                                      │
         │ socket.emit('nuevo-pedido')         │
         ├─────────────────────────────────────>│
         │                                      │
         │                                      │ socket.emit('cambio-estado')
         │<─────────────────────────────────────┤
         │                                      │
         │                                      │
         └──────────────┬───────────────────────┘
                        │
                ┌───────▼────────┐
                │  Socket.IO     │
                │    Server      │
                └────────────────┘
```

### Eventos Implementados

#### Cliente → Servidor
```javascript
// Nuevo pedido
socket.emit('nuevo-pedido', {
  localId: 1,
  mesa: 5,
  items: [...],
  total: 1500
});

// Unirse a sala del local
socket.emit('join-local', localId);
```

#### Servidor → Cliente
```javascript
// Notificar nuevo pedido
io.to(`local-${localId}`).emit('pedido-creado', pedido);

// Notificar cambio de estado
io.to(`local-${localId}`).emit('pedido-actualizado', pedido);
```

### Implementación

```javascript
// backend/src/sockets/pedidos.socket.js
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Unirse a sala del local
    socket.on('join-local', (localId) => {
      socket.join(`local-${localId}`);
      console.log(`Socket ${socket.id} unido a local-${localId}`);
    });

    // Nuevo pedido
    socket.on('nuevo-pedido', async (data) => {
      try {
        const pedido = await Pedido.create(data);
        io.to(`local-${data.localId}`).emit('pedido-creado', pedido);
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });
};
```

---

## 🔐 Seguridad

### Autenticación JWT

```
┌─────────────┐                    ┌─────────────┐
│   Cliente   │                    │   Servidor  │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │  POST /api/auth/login            │
       │  { email, password }             │
       ├─────────────────────────────────>│
       │                                  │
       │                                  │ 1. Verificar credenciales
       │                                  │ 2. Generar JWT
       │                                  │
       │  { token, user }                 │
       │<─────────────────────────────────┤
       │                                  │
       │  GET /api/productos              │
       │  Authorization: Bearer <token>   │
       ├─────────────────────────────────>│
       │                                  │
       │                                  │ 3. Verificar JWT
       │                                  │ 4. Procesar request
       │                                  │
       │  { productos }                   │
       │<─────────────────────────────────┤
       │                                  │
```

### Medidas de Seguridad Implementadas

1. **Passwords Hasheados** (Bcrypt)
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```

2. **JWT con Expiración**
```javascript
const token = jwt.sign(
  { id: user.id, rol: user.rol },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

3. **CORS Configurado**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

4. **Rate Limiting** (Recomendado)
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de requests
});
app.use('/api/', limiter);
```

5. **Validación de Inputs**
```javascript
const { body, validationResult } = require('express-validator');

router.post('/productos',
  body('nombre').notEmpty(),
  body('precio').isNumeric(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ...
  }
);
```

---

## 🚀 Deployment

### Arquitectura de Producción

```
┌──────────────────────────────────────────────────────────┐
│                    Internet                               │
└────────────────────────┬─────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
┌────────▼─────────┐          ┌─────────▼────────┐
│   Netlify/Vercel │          │      Render      │
│    (Frontend)    │          │    (Backend)     │
│                  │          │                  │
│  - React Build   │          │  - Node.js API   │
│  - Static Files  │          │  - Socket.IO     │
│  - CDN           │          │  - Docker        │
└──────────────────┘          └─────────┬────────┘
                                        │
                              ┌─────────▼────────┐
                              │      MySQL       │
                              │   (Remote DB)    │
                              └──────────────────┘
```

### Variables de Entorno

**Frontend (Netlify/Vercel):**
```env
REACT_APP_API_URL=https://cartitaap.onrender.com
REACT_APP_SOCKET_URL=https://cartitaap.onrender.com
```

**Backend (Render):**
```env
NODE_ENV=production
PORT=10000
DB_HOST=167.250.5.55
DB_PORT=3306
DB_NAME=transpo1_cartita
DB_USER=transpo1_cartita
DB_PASSWORD=***
JWT_SECRET=***
FRONTEND_URL=https://cartita.digital
EMAIL_USER=cartita.digitalok@gmail.com
EMAIL_PASSWORD=***
```

---

## 📊 Métricas y Monitoreo

### Performance
- **Tiempo de carga inicial:** < 3s
- **Time to Interactive:** < 5s
- **Lighthouse Score:** > 90

### Escalabilidad
- **Usuarios concurrentes:** 100+
- **Pedidos por minuto:** 50+
- **Uptime:** 99.9%

---

## 🔄 Flujo de Datos Completo

### Ejemplo: Crear un Pedido

```
1. Cliente hace pedido en MenuPage
   └─> CartContext.createPedido()
       └─> axios.post('/api/pedidos', data)
           └─> Backend: pedido.controller.js
               └─> Pedido.create(data)
                   └─> MySQL: INSERT INTO pedidos
                       └─> Socket.IO: emit('pedido-creado')
                           └─> Admin recibe notificación
                               └─> UI se actualiza en tiempo real
```

---

## 📚 Referencias

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)
- [Socket.IO Documentation](https://socket.io/)
- [JWT.io](https://jwt.io/)
