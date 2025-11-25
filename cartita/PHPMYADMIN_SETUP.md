# 🐳 phpMyAdmin con Docker

## 🚀 Inicio Rápido

### 1. Iniciar phpMyAdmin

```bash
docker-compose up -d
```

### 2. Acceder a phpMyAdmin

Abre en tu navegador: **http://localhost:8080**

### 3. Credenciales de acceso

- **Servidor:** `167.250.5.55`
- **Usuario:** `transpo1_cartita`
- **Contraseña:** `feelthesky1`
- **Base de datos:** `transpo1_cartita`

**Nota:** Las credenciales ya están pre-configuradas, solo haz clic en "Iniciar sesión"

---

## 🛠️ Comandos útiles

### Ver logs
```bash
docker-compose logs -f phpmyadmin
```

### Detener phpMyAdmin
```bash
docker-compose down
```

### Reiniciar
```bash
docker-compose restart
```

### Eliminar contenedor
```bash
docker-compose down -v
```

---

## 📊 Características

- ✅ Conectado a tu MySQL remoto (167.250.5.55)
- ✅ Puerto local: 8080
- ✅ Límite de upload: 300MB
- ✅ Memoria: 512MB
- ✅ Auto-restart si se cierra

---

## 🔍 Verificar que funciona

1. Abre http://localhost:8080
2. Deberías ver la interfaz de phpMyAdmin
3. Haz clic en "Iniciar sesión" (credenciales pre-cargadas)
4. Verás la base de datos `transpo1_cartita`

---

## ⚠️ Troubleshooting

### Error de conexión
Si no puede conectar al MySQL remoto:
- Verifica que el firewall permita conexiones desde tu IP
- Verifica que el usuario tenga permisos remotos

### Puerto 8080 ocupado
Si el puerto 8080 está en uso, edita `docker-compose.yml`:
```yaml
ports:
  - "8081:80"  # Cambia 8080 por otro puerto
```

---

## 🎯 Alternativa: Acceso directo sin Docker

Si prefieres no usar Docker, puedes usar:

### MySQL Workbench
- Host: 167.250.5.55
- Port: 3306
- User: transpo1_cartita
- Password: feelthesky1

### DBeaver
- Database: MySQL
- Host: 167.250.5.55
- Port: 3306
- Database: transpo1_cartita
- User: transpo1_cartita
- Password: feelthesky1

---

<div align="center">

**¡phpMyAdmin listo para usar! 🎉**

</div>
