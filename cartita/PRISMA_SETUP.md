# 🚀 Setup con Prisma + MySQL

## ✅ Ya está todo configurado!

### 📦 Archivos creados:
- ✅ `prisma/schema.prisma` - Esquema completo de la base de datos
- ✅ `prisma/seed.js` - Datos iniciales (superadmin, local demo, productos)
- ✅ `src/lib/prisma.js` - Cliente de Prisma
- ✅ `.env.local.template` - Template con tu configuración MySQL

---

## 🔧 Pasos para configurar:

### 1. Crear archivo `.env.local`

Copia el contenido de `.env.local.template` a `.env.local`:

```bash
# En PowerShell:
Copy-Item .env.local.template .env.local
```

O crea manualmente `cartita/.env.local` con:

```env
DATABASE_URL="mysql://transpo1_cartita:feelthesky1@167.250.5.55:3306/transpo1_cartita"
JWT_SECRET="ac09fc636029fd5d86ea9a835a5e5a7799e165a6c1c8989b60986f8d32f13da3abb176b74924a2b46f076403451252d2a4b84b63935cd05012bc520da4a144ec"
NEXT_PUBLIC_API_URL="http://localhost:3000"
EMAIL_USER="cartita.digitalok@gmail.com"
EMAIL_PASSWORD="xybfxjsaguavbzea"
NODE_ENV="development"
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Generar el cliente de Prisma

```bash
npm run prisma:generate
```

### 4. Crear las tablas en la base de datos

```bash
npm run prisma:push
```

Esto creará todas las tablas en tu MySQL sin necesidad de migraciones.

### 5. Poblar con datos iniciales (seed)

```bash
npm run prisma:seed
```

Esto creará:
- ✅ Usuario superadmin (email: cartita.digitalok@gmail.com, password: admin123)
- ✅ Local demo (/menu/demo)
- ✅ 4 categorías de ejemplo
- ✅ 4 productos de ejemplo

### 6. ¡Listo! Iniciar el servidor

```bash
npm run dev
```

Abre: **http://localhost:3000**

---

## 🎯 Credenciales de acceso:

**Superadmin:**
- Email: `cartita.digitalok@gmail.com`
- Password: `admin123`

**Local demo:**
- URL: `http://localhost:3000/menu/demo`

---

## 🛠️ Comandos útiles de Prisma:

```bash
# Ver la base de datos en el navegador
npm run prisma:studio

# Generar cliente después de cambios en schema
npm run prisma:generate

# Sincronizar schema con la BD (desarrollo)
npm run prisma:push

# Crear migración (producción)
npm run prisma:migrate

# Re-ejecutar seed
npm run prisma:seed
```

---

## 📊 Prisma Studio

Para ver y editar datos visualmente:

```bash
npm run prisma:studio
```

Se abrirá en: **http://localhost:5555**

---

## ✅ Ventajas de Prisma:

1. ✨ **Type-safe** - Autocompletado en VS Code
2. 🚀 **Más rápido** que Sequelize
3. 🎯 **Queries simples** y legibles
4. 🔄 **Migraciones automáticas**
5. 📊 **Prisma Studio** para ver datos
6. 🛡️ **Prevención de SQL injection**

---

## 🔄 Migrar desde Sequelize:

Las API Routes ya están listas para usar Prisma. Solo necesitas:

1. Reemplazar `import { getDb }` por `import prisma`
2. Cambiar queries SQL por queries de Prisma

Ejemplo:
```javascript
// Antes (SQL directo)
const result = await db.query('SELECT * FROM productos WHERE id = $1', [id]);

// Ahora (Prisma)
const producto = await prisma.producto.findUnique({ where: { id } });
```

---

<div align="center">

**¡Todo listo para usar Prisma! 🎉**

</div>
