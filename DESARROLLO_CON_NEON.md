# Desarrollo Local con Base de Datos Neon (PostgreSQL)

## 🎯 Ventajas de usar Neon para desarrollo

✅ **Misma base de datos** en desarrollo y producción  
✅ **Sin diferencias** entre MySQL y PostgreSQL  
✅ **Tier gratuito** generoso (0.5 GB)  
✅ **Branching** de base de datos para testing  
✅ **Backups automáticos**  
✅ **Sin Docker** necesario para la base de datos  

---

## 🔧 Configuración

### 1. Obtener credenciales de Neon

Ve a tu dashboard de Neon y copia la connection string:
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

### 2. Configurar variables de entorno locales

Crea o actualiza `backend/.env`:

```env
# Base de Datos PostgreSQL (Neon) - DESARROLLO Y PRODUCCIÓN
DB_DIALECT=postgres
DB_HOST=tu-proyecto.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=tu-usuario
DB_PASSWORD=tu-password

# JWT
JWT_SECRET=tu_jwt_secret_seguro_de_64_caracteres_minimo
JWT_EXPIRE=7d

# Puerto del servidor
PORT=5000

# URL del Frontend
FRONTEND_URL=http://localhost:3001

# Email (Gmail)
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu_app_password_de_gmail

# Email del Superadministrador
SUPERADMIN_EMAIL=superadmin@tudominio.com

# Ambiente
NODE_ENV=development
```

### 3. Actualizar docker-compose.yml

Comenta o elimina el servicio de MySQL ya que usarás Neon:

```yaml
version: '3.8'

services:
  # Base de datos MySQL - COMENTADO (usando Neon)
  # mysql:
  #   image: mysql:8.0
  #   ...

  backend:
    build:
      context: ./backend
      target: development
    ports:
      - "5000:5000"
    environment:
      # Variables de Neon desde .env
      - DB_DIALECT=${DB_DIALECT}
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - FRONTEND_URL=${FRONTEND_URL}
      - NODE_ENV=development
    volumes:
      - ./backend/src:/app/src
      - ./backend/package.json:/app/package.json
      - backend_logs:/app/logs
    # depends_on: - ELIMINAR dependencia de MySQL
    #   mysql:
    #     condition: service_healthy
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      target: development
    ports:
      - "3001:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
      - REACT_APP_SOCKET_URL=http://localhost:5000
      - CHOKIDAR_USEPOLLING=true
    volumes:
      - ./frontend/src:/app/src
      - ./frontend/public:/app/public
    restart: unless-stopped

volumes:
  backend_logs:

networks:
  menu-network:
    driver: bridge
```

---

## 🚀 Uso

### Desarrollo local con Neon

```bash
# 1. Configurar variables de entorno
cd backend
cp .env.example .env
# Editar .env con credenciales de Neon

# 2. Levantar servicios (sin MySQL)
docker-compose up -d

# 3. Verificar conexión
curl http://localhost:5000/health

# 4. Verificar estructura de BD
curl http://localhost:5000/api/migrate/verify-structure
```

### Sin Docker (desarrollo nativo)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm start
```

---

## 🔄 Branching de Base de Datos (Neon)

Neon permite crear "branches" de tu base de datos para testing:

```bash
# En el dashboard de Neon:
# 1. Ir a "Branches"
# 2. Crear nueva branch desde "main"
# 3. Usar la connection string de la branch para testing
```

**Casos de uso:**
- Testing de migraciones
- Desarrollo de features sin afectar datos
- QA con datos de producción clonados

---

## 📊 Monitoreo

### Neon Dashboard
- Queries ejecutados
- Uso de almacenamiento
- Conexiones activas
- Métricas de performance

### Logs locales
```bash
# Ver logs del backend
docker logs cartita-backend -f

# Ver logs en archivo
tail -f backend/logs/app.log
```

---

## 🔐 Seguridad

### Producción (Render)
- Variables de entorno en Render Dashboard
- SSL/TLS automático con Neon
- Connection pooling habilitado

### Desarrollo
- **NO commitear** archivo `.env` con credenciales reales
- Usar `.env.example` como template
- Credenciales de Neon en variables de entorno locales

---

## 🐛 Troubleshooting

### Error: "Connection refused"
```bash
# Verificar que las credenciales de Neon sean correctas
# Verificar que DB_DIALECT=postgres en .env
```

### Error: "SSL required"
```bash
# Neon requiere SSL, asegúrate que la connection string tenga:
# ?sslmode=require
```

### Error: "Too many connections"
```bash
# Neon tiene límite de conexiones en tier gratuito
# Cerrar conexiones no usadas o upgrade a tier pago
```

---

## 💡 Recomendaciones

1. **Usar Neon para todo**: Desarrollo, staging y producción
2. **Crear branches** para features grandes
3. **Backups regulares** (Neon los hace automáticamente)
4. **Monitorear uso** en el dashboard de Neon
5. **Connection pooling** ya está configurado en Sequelize

---

## 📚 Recursos

- [Neon Documentation](https://neon.tech/docs)
- [Neon Branching](https://neon.tech/docs/introduction/branching)
- [PostgreSQL vs MySQL](https://neon.tech/postgresql/postgresql-vs-mysql)
