# 🐳 Docker Setup - Cartita

Guía completa para ejecutar Cartita con Docker.

## 📋 Requisitos Previos

- Docker Desktop 20.10+
- Docker Compose 2.0+
- 4GB RAM mínimo
- 10GB espacio en disco

## 🚀 Inicio Rápido

### Desarrollo

```bash
# Construir e iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### Producción

```bash
# Usar archivo de producción
docker-compose -f docker-compose.prod.yml up -d

# Con variables de entorno
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

## 🏗️ Arquitectura

### Servicios

1. **MySQL** (Puerto 3307)
   - Base de datos principal
   - Volumen persistente
   - Health checks configurados

2. **Backend** (Puerto 5000)
   - Node.js 20 Alpine
   - Multi-stage build
   - Usuario no-root
   - Health checks

3. **Frontend** (Puerto 3001 dev / 80 prod)
   - React en desarrollo
   - Nginx en producción
   - Hot reload habilitado

4. **phpMyAdmin** (Puerto 8080)
   - Gestión de base de datos
   - Solo en desarrollo

## 📦 Multi-Stage Builds

### Backend

```dockerfile
# Stage 1: Dependencies (solo producción)
# Stage 2: Builder (todas las deps)
# Stage 3: Production (optimizado)
```

**Beneficios:**
- ✅ Imagen final más pequeña (~150MB vs ~500MB)
- ✅ Usuario no-root para seguridad
- ✅ Dumb-init para manejo de señales
- ✅ Health checks integrados

### Frontend

```dockerfile
# Stage 1: Dependencies
# Stage 2: Builder (build de React)
# Stage 3: Production (Nginx)
# Stage 4: Development (React dev server)
```

**Beneficios:**
- ✅ Producción con Nginx (~25MB)
- ✅ Desarrollo con hot reload
- ✅ Gzip y cache configurados
- ✅ Security headers

## 🔧 Comandos Útiles

### Gestión de Contenedores

```bash
# Ver estado
docker-compose ps

# Reconstruir servicios
docker-compose build

# Reconstruir sin cache
docker-compose build --no-cache

# Reiniciar un servicio
docker-compose restart backend

# Ver logs de un servicio
docker-compose logs -f backend
```

### Limpieza

```bash
# Detener y eliminar contenedores
docker-compose down

# Eliminar también volúmenes
docker-compose down -v

# Limpiar imágenes no usadas
docker system prune -a
```

### Acceso a Contenedores

```bash
# Shell en backend
docker-compose exec backend sh

# Shell en frontend
docker-compose exec frontend sh

# MySQL CLI
docker-compose exec mysql mysql -u menuadmin -p menu_digital
```

## 🌐 URLs de Acceso

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Frontend | http://localhost:3001 | - |
| Backend API | http://localhost:5000 | - |
| phpMyAdmin | http://localhost:8080 | menuadmin / menupass123 |
| MySQL | localhost:3307 | menuadmin / menupass123 |

## 🔐 Seguridad

### Desarrollo
- Contraseñas en docker-compose.yml (OK para dev)
- Puertos expuestos para debugging

### Producción
- ✅ Variables de entorno desde `.env`
- ✅ Usuario no-root en contenedores
- ✅ Health checks configurados
- ✅ Resource limits
- ✅ Security headers en Nginx
- ⚠️ Cambiar todas las contraseñas
- ⚠️ Usar secrets de Docker Swarm/Kubernetes

## 📊 Monitoreo

### Health Checks

Todos los servicios tienen health checks:

```bash
# Ver estado de salud
docker-compose ps

# Inspeccionar health check
docker inspect cartita-backend --format='{{json .State.Health}}'
```

### Logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Últimas 100 líneas
docker-compose logs --tail=100 backend
```

## 🚢 Despliegue

### Preparación

1. Crear `.env.production`:
```env
NODE_ENV=production
DB_HOST=tu-db-host
DB_USER=tu-usuario
DB_PASSWORD=tu-password-seguro
JWT_SECRET=tu-jwt-secret-muy-largo-y-aleatorio
FRONTEND_URL=https://www.cartita.digital
```

2. Build de producción:
```bash
docker-compose -f docker-compose.prod.yml build
```

3. Iniciar:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Docker Swarm (Opcional)

```bash
# Inicializar swarm
docker swarm init

# Desplegar stack
docker stack deploy -c docker-compose.prod.yml cartita

# Ver servicios
docker service ls

# Escalar backend
docker service scale cartita_backend=3
```

## 🐛 Troubleshooting

### Problema: Contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs backend

# Verificar health check
docker inspect cartita-backend
```

### Problema: Base de datos no conecta

```bash
# Verificar que MySQL esté healthy
docker-compose ps

# Probar conexión
docker-compose exec backend sh
nc -zv mysql 3306
```

### Problema: Hot reload no funciona (Windows)

Asegúrate de tener `CHOKIDAR_USEPOLLING=true` en el docker-compose.

### Problema: Permisos en volúmenes

```bash
# Cambiar permisos
docker-compose exec backend chown -R nodejs:nodejs /app
```

## 📈 Optimizaciones

### Reducir tiempo de build

1. Usar `.dockerignore`
2. Ordenar comandos de menos a más cambiantes
3. Usar cache de layers

### Reducir tamaño de imagen

- ✅ Multi-stage builds
- ✅ Alpine Linux
- ✅ `npm ci` en lugar de `npm install`
- ✅ `--only=production`
- ✅ Limpiar cache: `npm cache clean --force`

## 🔄 CI/CD

### GitHub Actions

```yaml
- name: Build Docker images
  run: docker-compose build

- name: Run tests
  run: docker-compose run backend npm test

- name: Push to registry
  run: |
    docker tag cartita-backend:latest registry.com/cartita-backend:${{ github.sha }}
    docker push registry.com/cartita-backend:${{ github.sha }}
```

## 📚 Recursos

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs: `docker-compose logs`
2. Verifica health checks: `docker-compose ps`
3. Revisa este README
4. Contacta al equipo de desarrollo
