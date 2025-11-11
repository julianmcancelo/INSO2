# 📊 Flujo de Datos del Cliente - Base de Datos

## 🎯 Arquitectura del Sistema

### Capas de Almacenamiento

```
┌─────────────────────────────────────┐
│  localStorage (Frontend)            │
│  - Datos temporales del cliente     │
│  - UX: Evitar pedir datos de nuevo  │
│  - Se limpia al cerrar navegador    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Base de Datos MySQL (Backend)      │
│  - Datos permanentes                │
│  - Asociados al pedido              │
│  - Histórico completo               │
└─────────────────────────────────────┘
```

## 🔄 Flujo Completo de Datos

### 1. Primera Visita del Cliente

```
Cliente accede → /menu/1
       ↓
No hay datos en localStorage
       ↓
Muestra BienvenidaModal
       ↓
Cliente completa:
  - Nombre: "Juan Pérez"
  - Teléfono: "+54 11 1234-5678"
  - Método: "delivery"
  - Dirección: "Av. Corrientes 1234, Piso 5B"
  - Referencia: "Edificio azul, timbre 5B"
       ↓
Guardar en localStorage (UX)
       ↓
Mostrar menú
```

### 2. Cliente Hace un Pedido

```
Cliente agrega productos al carrito
       ↓
Clic en "Confirmar Pedido"
       ↓
Navega a /menu/1/confirmacion
       ↓
Formulario PRE-LLENADO con datos de localStorage:
  ✅ Nombre: "Juan Pérez"
  ✅ Teléfono: "+54 11 1234-5678"
  ✅ Tipo: "delivery"
  ✅ Dirección: "Av. Corrientes 1234, Piso 5B"
  ✅ Referencia: "Edificio azul, timbre 5B"
       ↓
Cliente puede editar si quiere
       ↓
Clic en "Confirmar Pedido"
       ↓
POST /api/pedidos
{
  "localId": 1,
  "clienteNombre": "Juan Pérez",
  "clienteTelefono": "+54 11 1234-5678",
  "tipoEntrega": "delivery",
  "direccionEntrega": "Av. Corrientes 1234, Piso 5B",
  "referenciaEntrega": "Edificio azul, timbre 5B",
  "notasCliente": "Sin cebolla",
  "items": [...]
}
       ↓
GUARDAR EN BASE DE DATOS
       ↓
Pedido creado con ID: 123
       ↓
Navega a /menu/1/pedido/123
```

### 3. Visitas Siguientes

```
Cliente accede → /menu/1
       ↓
Detecta datos en localStorage
       ↓
NO muestra BienvenidaModal
       ↓
Acceso directo al menú
       ↓
Toast: "¡Hola Juan! Bienvenido a Pizzería Roma"
```

## 💾 Modelo de Base de Datos

### Tabla: `pedidos`

```sql
CREATE TABLE pedidos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  localId INT NOT NULL,
  numeroPedido VARCHAR(20) UNIQUE NOT NULL,
  
  -- DATOS DEL CLIENTE (guardados en cada pedido)
  clienteNombre VARCHAR(100) NOT NULL,
  clienteTelefono VARCHAR(20),
  
  -- TIPO DE ENTREGA
  tipoEntrega ENUM('mesa', 'takeaway', 'delivery') NOT NULL DEFAULT 'mesa',
  
  -- DATOS SEGÚN TIPO
  numeroMesa VARCHAR(10),              -- Si es mesa
  direccionEntrega TEXT,               -- Si es delivery
  referenciaEntrega TEXT,              -- Si es delivery (NUEVO)
  
  -- ESTADO Y TOTAL
  estado ENUM('pendiente', 'preparando', 'listo', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
  total DECIMAL(10, 2) NOT NULL,
  
  -- NOTAS Y TIEMPOS
  notasCliente TEXT,
  tiempoEstimado INT,
  horaEntrega DATETIME,
  
  -- TIMESTAMPS
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  
  FOREIGN KEY (localId) REFERENCES locales(id)
);
```

### Ejemplo de Registro

```json
{
  "id": 123,
  "localId": 1,
  "numeroPedido": "#001",
  "clienteNombre": "Juan Pérez",
  "clienteTelefono": "+54 11 1234-5678",
  "tipoEntrega": "delivery",
  "numeroMesa": null,
  "direccionEntrega": "Av. Corrientes 1234, Piso 5B",
  "referenciaEntrega": "Edificio azul, timbre 5B",
  "estado": "pendiente",
  "total": 1250.00,
  "notasCliente": "Sin cebolla",
  "tiempoEstimado": 30,
  "horaEntrega": null,
  "createdAt": "2025-11-10 20:30:00",
  "updatedAt": "2025-11-10 20:30:00"
}
```

## 🔑 Campos Importantes

### Datos del Cliente (Siempre Requeridos)
- ✅ `clienteNombre` - Nombre completo
- ✅ `clienteTelefono` - Para contacto/WhatsApp

### Tipo de Entrega (Enum)
- 🪑 `mesa` - Servicio en mesa
- 📦 `takeaway` - Retiro en el local
- 🚴 `delivery` - Envío a domicilio

### Datos Condicionales

**Si `tipoEntrega = 'mesa'`:**
- `numeroMesa` - Requerido

**Si `tipoEntrega = 'takeaway'`:**
- No requiere datos adicionales

**Si `tipoEntrega = 'delivery'`:**
- `direccionEntrega` - Requerido
- `referenciaEntrega` - Opcional

## 📱 Ventajas del Sistema Dual

### localStorage (Frontend)
✅ **Ventajas:**
- Experiencia rápida
- No pide datos en cada visita
- Funciona offline
- Pre-llena formularios

❌ **Limitaciones:**
- Se pierde al limpiar navegador
- Solo en ese dispositivo
- No es persistente

### Base de Datos (Backend)
✅ **Ventajas:**
- Datos permanentes
- Histórico completo
- Análisis y reportes
- Múltiples dispositivos
- Backup y seguridad

❌ **Limitaciones:**
- Requiere conexión
- Más lento que localStorage

## 🎯 Casos de Uso

### Caso 1: Cliente Frecuente
```
Visita 1:
  - Completa bienvenida
  - Hace pedido
  - Datos guardados en BD y localStorage

Visita 2 (mismo navegador):
  - Acceso directo al menú
  - Datos pre-llenados
  - Hace pedido
  - Nuevos datos en BD

Visita 3 (otro dispositivo):
  - Completa bienvenida de nuevo
  - Hace pedido
  - Datos guardados en BD
```

### Caso 2: Cliente Nuevo
```
Primera vez:
  - Completa bienvenida
  - Ve menú
  - Hace pedido
  - Datos en BD asociados al pedido
```

### Caso 3: Cliente Cambia de Dirección
```
Visita con datos guardados:
  - Acceso directo al menú
  - Agrega productos
  - En confirmación, EDITA dirección
  - Nuevo pedido con nueva dirección
  - localStorage se actualiza
```

## 📊 Consultas Útiles

### Ver todos los pedidos de un cliente
```sql
SELECT * FROM pedidos 
WHERE clienteTelefono = '+54 11 1234-5678'
ORDER BY createdAt DESC;
```

### Pedidos delivery pendientes
```sql
SELECT * FROM pedidos 
WHERE tipoEntrega = 'delivery' 
  AND estado = 'pendiente'
ORDER BY createdAt ASC;
```

### Clientes frecuentes
```sql
SELECT clienteNombre, clienteTelefono, COUNT(*) as total_pedidos
FROM pedidos
GROUP BY clienteTelefono
HAVING total_pedidos > 5
ORDER BY total_pedidos DESC;
```

### Direcciones más usadas
```sql
SELECT direccionEntrega, COUNT(*) as veces
FROM pedidos
WHERE tipoEntrega = 'delivery'
GROUP BY direccionEntrega
ORDER BY veces DESC
LIMIT 10;
```

## 🔄 Sincronización

### localStorage → Base de Datos
```javascript
// En ConfirmacionPage.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Datos vienen de:
  // 1. localStorage (pre-llenado)
  // 2. Ediciones del usuario
  
  const pedidoData = {
    localId: local.id,
    clienteNombre: formData.clienteNombre,      // ← De localStorage o editado
    clienteTelefono: formData.clienteTelefono,  // ← De localStorage o editado
    tipoEntrega: formData.tipoEntrega,          // ← De localStorage o editado
    direccionEntrega: formData.direccionEntrega,// ← De localStorage o editado
    referenciaEntrega: formData.referenciaEntrega,// ← De localStorage o editado
    notasCliente: formData.notasCliente,        // ← Nuevo en cada pedido
    items: cart.map(...)                        // ← Del carrito
  };
  
  // Guardar en BD
  await pedidoAPI.create(pedidoData);
};
```

## ✨ Mejoras Futuras

### Funcionalidades
- [ ] **Cuenta de cliente**: Login opcional para ver historial
- [ ] **Direcciones guardadas**: Múltiples direcciones por cliente
- [ ] **Favoritos**: Productos favoritos del cliente
- [ ] **Reordenar**: Repetir pedido anterior con un clic
- [ ] **Puntos de fidelidad**: Sistema de recompensas

### Análisis
- [ ] **Dashboard de clientes**: Clientes más frecuentes
- [ ] **Zonas de delivery**: Mapa de calor de entregas
- [ ] **Horarios pico**: Análisis de pedidos por hora
- [ ] **Productos populares**: Por cliente o zona

### Comunicación
- [ ] **WhatsApp automático**: Confirmación por WhatsApp
- [ ] **SMS de estado**: Notificaciones de cambio de estado
- [ ] **Email de resumen**: Resumen del pedido por email

## 🎉 Resumen

El sistema implementa una **arquitectura híbrida**:

1. **localStorage**: Para UX rápida y fluida
2. **Base de Datos**: Para persistencia y análisis

Los datos del cliente se capturan UNA VEZ en la bienvenida y se:
- ✅ Guardan en localStorage (temporal, UX)
- ✅ Envían a la BD con cada pedido (permanente)
- ✅ Pre-llenan formularios (comodidad)
- ✅ Permiten edición (flexibilidad)

**Resultado**: Experiencia profesional con datos completos y persistentes. 🚀
