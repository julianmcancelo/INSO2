# 🐳 Configuración Docker - Menú Digital

## ✅ Estado Actual

Todos los contenedores están corriendo correctamente:

- **MySQL Database** (menu-db): Puerto 3307 → 3306
- **Backend API** (menu-backend): Puerto 5000
- **Frontend React** (menu-frontend): Puerto 3001 → 3000

## 🚀 Acceso a la Aplicación

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **MySQL**: localhost:3307

## 📋 Comandos Útiles

### Iniciar los contenedores
```bash
docker-compose up -d
```

### Detener los contenedores
```bash
docker-compose down
```

### Ver logs en tiempo real
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend

# Solo base de datos
docker-compose logs -f mysql
```

### Reiniciar un servicio específico
```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql
```

### Ver estado de los contenedores
```bash
docker-compose ps
```

### Reconstruir las imágenes
```bash
docker-compose up --build -d
```

### Limpiar todo (contenedores, volúmenes, etc.)
```bash
docker-compose down -v
```

## 🔧 Configuración

### Variables de Entorno

El archivo `.env` en la carpeta `backend` contiene:
- Credenciales de base de datos
- JWT secret
- Configuración de email (opcional para desarrollo)

### Puertos Modificados

Se cambiaron los siguientes puertos para evitar conflictos:
- **MySQL**: 3307 (en lugar de 3306) - porque hay un MySQL local corriendo
- **Frontend**: 3001 (en lugar de 3000) - porque el puerto 3000 estaba ocupado

## 📊 Base de Datos

La base de datos se inicializa automáticamente con el script `backend/database/init.sql`.

Para conectarte directamente a MySQL:
```bash
mysql -h 127.0.0.1 -P 3307 -u menuadmin -p
# Password: menupass123
```

O usando Docker:
```bash
docker exec -it menu-db mysql -u menuadmin -p menu_digital
```

## 🔄 Hot Reload

Ambos servicios (backend y frontend) tienen hot reload activado:
- Los cambios en el código se reflejan automáticamente
- No necesitas reconstruir las imágenes para cambios de código

## ⚠️ Notas Importantes

1. **Email**: La configuración de email está en modo mock. Para enviar emails reales, configura `EMAIL_USER` y `EMAIL_PASSWORD` en el archivo `.env`.

2. **Volúmenes**: Los datos de MySQL se persisten en un volumen Docker (`mysql_data`). Si quieres resetear la base de datos, ejecuta:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

3. **Node Modules**: Los `node_modules` se instalan dentro del contenedor. No necesitas instalarlos localmente.

## 🐛 Troubleshooting

### El contenedor no inicia
```bash
docker-compose logs [servicio]
```

### Puerto ocupado
Modifica el puerto en `docker-compose.yml` en la sección `ports`.

### Cambios no se reflejan
```bash
docker-compose restart [servicio]
```

### Limpiar y empezar de cero
```bash
docker-compose down -v
docker-compose up --build -d
```
