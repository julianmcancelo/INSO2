# 🚀 Guía de Instalación - Cartita Next.js

## Prerequisitos

- **Node.js** 18+ instalado
- **npm** o **yarn**
- **PostgreSQL** 14+ (local o en la nube)

---

## 📦 Instalación Paso a Paso

### 1. Clonar o navegar al proyecto

```bash
cd cartita
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
# Base de datos (REQUERIDO)
DATABASE_URL=postgresql://user:password@localhost:5432/cartita

# JWT (REQUERIDO)
JWT_SECRET=cambia-esto-por-algo-muy-seguro-en-produccion

# URLs (Opcional en desarrollo)
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# Node
NODE_ENV=development
```

### 4. Configurar Base de Datos

#### Opción A: PostgreSQL Local

```bash
# Crear base de datos
createdb cartita

# Ejecutar migraciones (cuando estén disponibles)
# npm run db:migrate
```

#### Opción B: Neon (Recomendado para desarrollo)

1. Crear cuenta en [neon.tech](https://neon.tech)
2. Crear nuevo proyecto
3. Copiar `DATABASE_URL` a `.env.local`

### 5. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) 🎉

---

## 🗄️ Esquema de Base de Datos

### Tablas Principales

```sql
-- Usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL, -- 'superadmin', 'admin', 'staff'
  local_id INTEGER REFERENCES locales(id),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Locales
CREATE TABLE locales (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  descripcion TEXT,
  direccion VARCHAR(500),
  telefono VARCHAR(50),
  email VARCHAR(255),
  logo_base64 TEXT,
  color_primario VARCHAR(7) DEFAULT '#FF6B35',
  color_secundario VARCHAR(7) DEFAULT '#004E89',
  horario_atencion JSONB,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categorías
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  local_id INTEGER REFERENCES locales(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  icono VARCHAR(50),
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Productos
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE,
  local_id INTEGER REFERENCES locales(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  imagen_base64 TEXT,
  tiempo_preparacion INTEGER,
  disponible BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pedidos
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  local_id INTEGER REFERENCES locales(id) ON DELETE CASCADE,
  numero_pedido INTEGER NOT NULL,
  nombre_cliente VARCHAR(255) NOT NULL,
  telefono_cliente VARCHAR(50) NOT NULL,
  tipo_entrega VARCHAR(50), -- 'takeaway', 'delivery'
  direccion VARCHAR(500),
  total DECIMAL(10,2) NOT NULL,
  notas TEXT,
  estado VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'preparando', 'listo', 'entregado', 'cancelado'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Items de Pedido
CREATE TABLE pedido_items (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  personalizaciones JSONB,
  notas TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Solicitudes (desde landing page)
CREATE TABLE solicitudes (
  id SERIAL PRIMARY KEY,
  nombre_negocio VARCHAR(255) NOT NULL,
  nombre_contacto VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(50),
  tipo_negocio VARCHAR(100),
  mensaje TEXT,
  estado VARCHAR(50) DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo (puerto 3000)

# Producción
npm run build            # Build para producción
npm run start            # Servidor de producción

# Utilidades
npm run lint             # Ejecutar ESLint
```

---

## 🐛 Solución de Problemas

### Error: "Module not found: Can't resolve '@/...'"

**Solución:** Asegúrate de que existe el archivo `jsconfig.json` en la raíz:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Error: "Database connection failed"

**Solución:** 
1. Verifica que PostgreSQL esté corriendo
2. Verifica `DATABASE_URL` en `.env.local`
3. Asegúrate de que la base de datos existe

### Error: "Port 3000 already in use"

**Solución:**
```bash
# Cambiar puerto
PORT=3001 npm run dev
```

### Warnings de Tailwind CSS

Los warnings `Unknown at rule @tailwind` son normales y no afectan el funcionamiento.

---

## 📚 Próximos Pasos

1. ✅ Crear usuario admin inicial
2. ✅ Crear primer local
3. ✅ Agregar categorías
4. ✅ Agregar productos
5. ✅ Generar código QR
6. 🚀 Deploy a producción

---

## 🆘 Ayuda

- 📖 [README.md](README.md)
- 📘 [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- 🚀 [QUICK_START.md](QUICK_START.md)
- 💬 GitHub Issues

---

<div align="center">

**¡Listo para empezar! 🎉**

</div>
