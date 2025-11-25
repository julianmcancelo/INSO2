# 📘 Guía de Migración: CRA → Next.js 14

Esta guía documenta la migración completa de Cartita desde Create React App a Next.js 14 con App Router.

---

## 📋 Tabla de Contenidos

- [Resumen de Cambios](#resumen-de-cambios)
- [Estructura de Archivos](#estructura-de-archivos)
- [Routing](#routing)
- [Data Fetching](#data-fetching)
- [API Routes](#api-routes)
- [Context Providers](#context-providers)
- [Componentes](#componentes)
- [Estilos](#estilos)
- [Deployment](#deployment)
- [Checklist de Migración](#checklist-de-migración)

---

## 🎯 Resumen de Cambios

### Antes (CRA)
```
frontend/ (React SPA)
  ├── src/
  │   ├── pages/
  │   ├── components/
  │   └── services/api.js
  
backend/ (Express separado)
  ├── src/
  │   ├── routes/
  │   ├── controllers/
  │   └── server.js
```

### Después (Next.js)
```
cartita/ (Full-stack)
  ├── src/
  │   ├── app/          # Routing + Pages
  │   ├── components/   # React Components
  │   ├── lib/          # API client + utils
  │   └── api/          # Backend integrado
```

---

## 📁 Estructura de Archivos

### Mapeo de Directorios

| CRA | Next.js | Notas |
|-----|---------|-------|
| `src/pages/` | `src/app/` | App Router |
| `src/components/` | `src/components/` | Sin cambios |
| `src/services/api.js` | `src/lib/api.js` | Mismo código |
| `src/context/` | `src/context/` | Agregar `'use client'` |
| `public/` | `public/` | Sin cambios |
| Backend Express | `src/app/api/` | API Routes |

---

## 🛣️ Routing

### React Router → Next.js App Router

#### Antes (React Router)
```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/menu/:localId" element={<MenuPage />} />
</Routes>
```

#### Después (Next.js)
```
src/app/
├── page.jsx                    # / (Landing)
├── admin/
│   ├── login/
│   │   └── page.jsx           # /admin/login
│   └── page.jsx               # /admin
└── menu/
    └── [localId]/
        └── page.jsx           # /menu/:localId
```

### Navegación

#### Antes
```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/admin');
```

#### Después
```jsx
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/admin');
```

### Links

#### Antes
```jsx
import { Link } from 'react-router-dom';

<Link to="/admin">Dashboard</Link>
```

#### Después
```jsx
import Link from 'next/link';

<Link href="/admin">Dashboard</Link>
```

---

## 📊 Data Fetching

### Client-Side Fetching (Sin cambios)

```jsx
'use client';

import { useState, useEffect } from 'react';
import { productoAPI } from '@/lib/api';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    const response = await productoAPI.getAll();
    setProductos(response.data.productos);
  };

  return <div>{/* ... */}</div>;
}
```

### Server-Side Fetching (NUEVO)

```jsx
// Server Component (sin 'use client')
import { getDb } from '@/lib/database';

export default async function ProductosPage() {
  const db = await getDb();
  const result = await db.query('SELECT * FROM productos');
  const productos = result.rows;

  return <div>{/* ... */}</div>;
}
```

---

## 🔌 API Routes

### Express → Next.js API Routes

#### Antes (Express)
```javascript
// backend/src/routes/productos.js
router.post('/productos', async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.json({ success: true, producto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Después (Next.js API Route)
```javascript
// src/app/api/productos/route.js
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database';

export async function POST(request) {
  try {
    const body = await request.json();
    const db = await getDb();
    
    const result = await db.query(
      'INSERT INTO productos (nombre, precio) VALUES ($1, $2) RETURNING *',
      [body.nombre, body.precio]
    );

    return NextResponse.json({
      success: true,
      producto: result.rows[0]
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Middleware de Autenticación

#### Antes (Express)
```javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  next();
};
```

#### Después (Next.js)
```javascript
// src/lib/middleware.js
export function requireAuth(handler) {
  return async (request, context) => {
    const auth = verifyToken(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }
    request.user = auth.user;
    return handler(request, context);
  };
}

// Uso
export const POST = requireAuth(async (request) => {
  // request.user está disponible
});
```

---

## 🔄 Context Providers

### Agregar 'use client'

Todos los Context providers deben tener la directiva `'use client'`:

```jsx
'use client';

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // ... mismo código
}
```

### Providers Wrapper

```jsx
// src/app/providers.jsx
'use client';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <LocalProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </LocalProvider>
    </AuthProvider>
  );
}

// src/app/layout.jsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## 🧩 Componentes

### Client Components

Componentes con interactividad necesitan `'use client'`:

```jsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Server Components (Por defecto)

Componentes sin interactividad pueden ser Server Components:

```jsx
// Sin 'use client'
export default function ProductCard({ producto }) {
  return (
    <div>
      <h3>{producto.nombre}</h3>
      <p>${producto.precio}</p>
    </div>
  );
}
```

---

## 🎨 Estilos

### Tailwind CSS (Sin cambios)

La configuración de Tailwind es casi idéntica:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  // ... resto igual
};
```

### CSS Global

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Tus estilos personalizados */
```

---

## 🚀 Deployment

### Antes (CRA + Express)

```
Vercel (Frontend) + Railway (Backend) = 2 servicios
```

### Después (Next.js)

```
Vercel (Full-stack) = 1 servicio
```

#### Configuración Vercel

1. Push a GitHub
2. Importar en Vercel
3. Configurar variables de entorno:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `EMAIL_*` (opcional)
4. Deploy automático ✨

---

## ✅ Checklist de Migración

### Configuración Inicial
- [x] Crear proyecto Next.js 14
- [x] Configurar Tailwind CSS
- [x] Configurar variables de entorno
- [x] Configurar ESLint

### Estructura
- [x] Migrar estructura de carpetas
- [x] Crear `src/app/` con App Router
- [x] Migrar `src/components/`
- [x] Migrar `src/context/` (agregar 'use client')
- [x] Migrar `src/lib/` (ex services)

### Routing
- [x] Migrar rutas públicas
- [x] Migrar rutas admin
- [x] Migrar rutas dinámicas ([param])
- [x] Actualizar navegación (useRouter)
- [x] Actualizar Links

### API
- [x] Crear API Routes básicas
- [x] Migrar autenticación
- [x] Migrar endpoints principales
- [x] Configurar middleware
- [x] Configurar base de datos

### Componentes
- [x] Identificar Client Components
- [x] Agregar 'use client' donde necesario
- [x] Migrar componentes compartidos
- [x] Migrar componentes de página

### Testing
- [ ] Probar rutas públicas
- [ ] Probar rutas admin
- [ ] Probar API endpoints
- [ ] Probar autenticación
- [ ] Probar Socket.IO

### Deployment
- [ ] Configurar Vercel
- [ ] Configurar variables de entorno
- [ ] Probar en staging
- [ ] Deploy a producción

---

## 🐛 Problemas Comunes

### 1. "use client" faltante

**Error:** `You're importing a component that needs useState. It only works in a Client Component`

**Solución:** Agregar `'use client'` al inicio del archivo

### 2. localStorage en Server Components

**Error:** `localStorage is not defined`

**Solución:** Usar solo en Client Components con `'use client'`

### 3. useRouter de Next.js

**Error:** Usar `useRouter` de React Router

**Solución:** 
```jsx
// ❌ Antes
import { useRouter } from 'react-router-dom';

// ✅ Después
import { useRouter } from 'next/navigation';
```

### 4. Imágenes

**Error:** Imágenes no optimizadas

**Solución:** Usar `next/image`
```jsx
import Image from 'next/image';

<Image src="/logo.png" width={200} height={200} alt="Logo" />
```

---

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [App Router Migration](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## 🎉 Conclusión

La migración a Next.js 14 trae:

✅ **Mejor SEO** - SSR/SSG nativo  
✅ **Mejor Performance** - Server Components  
✅ **Deployment Simplificado** - Todo en Vercel  
✅ **Mejor DX** - File-based routing  
✅ **Optimizaciones Automáticas** - Imágenes, fonts, etc.  

**Tiempo estimado de migración:** 10-15 días

---

<div align="center">

**¿Preguntas? Abre un issue en GitHub**

</div>
