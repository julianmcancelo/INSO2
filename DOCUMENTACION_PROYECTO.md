# 📱 Sistema de Menú Digital para Restaurantes

## Índice

1. [Introducción](#introducción)
2. [Descripción del Proyecto](#descripción-del-proyecto)
3. [Proceso del Proyecto](#proceso-del-proyecto)
4. [Presupuesto](#presupuesto)
5. [Matriz de Riesgos](#matriz-de-riesgos)
6. [Metodología Aplicada](#metodología-aplicada)
7. [Gestión de Calidad](#gestión-de-calidad)
8. [Tipos de Pruebas](#tipos-de-pruebas)
   - [Pruebas Funcionales](#pruebas-funcionales)
   - [Pruebas No Funcionales](#pruebas-no-funcionales)
9. [Conclusión](#conclusión)

---

## 1. Introducción

### 1.1 Contexto

En la era digital actual, la industria gastronómica enfrenta el desafío constante de adaptarse a las nuevas tecnologías y expectativas de los clientes. La pandemia de COVID-19 aceleró significativamente la digitalización de los servicios, haciendo que los menús digitales y sistemas de pedidos en línea pasaran de ser una ventaja competitiva a una necesidad básica.

Los restaurantes, bares y locales gastronómicos necesitan herramientas que les permitan:
- Ofrecer sus productos de manera digital y atractiva
- Gestionar pedidos de forma eficiente
- Reducir costos operativos (impresión de menús, personal de atención)
- Adaptarse rápidamente a cambios en el menú o precios
- Mejorar la experiencia del cliente

### 1.2 Problemática

Los sistemas tradicionales de menús físicos y toma de pedidos presentan múltiples inconvenientes:

**Para los Clientes:**
- Menús desactualizados o deteriorados
- Tiempo de espera para ser atendidos
- Dificultad para visualizar todos los productos disponibles
- Falta de información detallada sobre ingredientes o preparación
- Proceso de pedido lento y propenso a errores

**Para los Negocios:**
- Costos elevados de impresión y actualización de menús
- Necesidad de personal dedicado exclusivamente a tomar pedidos
- Errores en la comunicación de pedidos entre meseros y cocina
- Dificultad para actualizar precios o disponibilidad en tiempo real
- Falta de trazabilidad y estadísticas de ventas

### 1.3 Propuesta de Solución

Este proyecto propone el desarrollo de un **Sistema de Menú Digital Integral** que digitaliza completamente el proceso de visualización de productos, toma de pedidos y gestión de órdenes para locales gastronómicos.

La solución incluye:
- **Menú digital accesible vía QR**: Los clientes escanean un código QR y acceden al menú desde su smartphone
- **Sistema de pedidos en línea**: Permite realizar pedidos directamente desde el dispositivo del cliente
- **Panel de administración**: Gestión completa del menú, categorías, productos y pedidos
- **Seguimiento en tiempo real**: Los clientes pueden ver el estado de su pedido en vivo
- **Múltiples métodos de pago**: Efectivo, transferencia bancaria y Mercado Pago
- **Sistema multi-local**: Permite gestionar múltiples locales desde una única plataforma

### 1.4 Objetivos del Proyecto

#### Objetivo General
Desarrollar una plataforma web integral que permita a locales gastronómicos digitalizar su menú, gestionar pedidos de manera eficiente y mejorar la experiencia del cliente mediante tecnologías modernas y accesibles.

#### Objetivos Específicos

1. **Digitalización del Menú**
   - Crear un sistema de menú digital responsive y atractivo
   - Implementar categorización y búsqueda de productos
   - Permitir personalización visual (logo, colores corporativos)

2. **Gestión de Pedidos**
   - Desarrollar un sistema de carrito de compras intuitivo
   - Implementar seguimiento en tiempo real de pedidos
   - Crear notificaciones automáticas de cambios de estado

3. **Panel Administrativo**
   - Construir un dashboard completo para gestión del negocio
   - Permitir CRUD de productos, categorías y configuraciones
   - Implementar sistema de usuarios y roles

4. **Experiencia del Cliente**
   - Diseñar una interfaz amigable y fácil de usar
   - Implementar modal de bienvenida para captura de datos
   - Integrar búsqueda de direcciones con OpenStreetMap
   - Permitir carga de comprobantes de pago

5. **Escalabilidad y Mantenibilidad**
   - Utilizar arquitectura modular y escalable
   - Implementar buenas prácticas de desarrollo
   - Documentar código y procesos

### 1.5 Alcance

#### Dentro del Alcance
- ✅ Sistema web responsive (móvil y desktop)
- ✅ Gestión de múltiples locales
- ✅ CRUD completo de productos y categorías
- ✅ Sistema de pedidos con estados
- ✅ Métodos de pago: Efectivo, Transferencia, Mercado Pago
- ✅ Generación de códigos QR por local
- ✅ Panel administrativo completo
- ✅ Seguimiento en tiempo real con WebSockets
- ✅ Sistema de invitaciones para usuarios
- ✅ Configuración de recargos por método de pago
- ✅ Carga de comprobantes de transferencia
- ✅ Búsqueda de direcciones con OpenStreetMap

#### Fuera del Alcance (Versión Actual)
- ❌ Aplicación móvil nativa
- ❌ Integración completa con Mercado Pago (solo configuración)
- ❌ Sistema de reservas de mesas
- ❌ Programa de fidelización
- ❌ Integración con sistemas de facturación
- ❌ Análisis avanzado de datos y reportes

---

## 2. Descripción del Proyecto

### 2.1 Visión General

El Sistema de Menú Digital es una plataforma web completa que consta de tres componentes principales:

1. **Frontend del Cliente**: Interfaz pública para visualizar menús y realizar pedidos
2. **Panel de Administración**: Sistema de gestión para dueños y empleados
3. **Backend API**: Servidor que maneja la lógica de negocio y base de datos

### 2.2 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA GENERAL                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   FRONTEND       │         │   BACKEND        │
│   React.js       │◄───────►│   Node.js        │
│   Port: 3001     │  HTTP   │   Express.js     │
│                  │  REST   │   Port: 5000     │
│                  │◄───────►│                  │
│                  │ Socket  │   Socket.IO      │
└──────────────────┘  .IO    └──────────────────┘
                                      │
                                      │ Sequelize
                                      ▼
                              ┌──────────────────┐
                              │   BASE DE DATOS  │
                              │   MySQL          │
                              │   Port: 3306     │
                              └──────────────────┘
```

### 2.3 Stack Tecnológico

#### Frontend
- **Framework**: React.js 18.2.0
- **Routing**: React Router DOM v6
- **Estilos**: TailwindCSS 3.4.1
- **Iconos**: Lucide React
- **Notificaciones**: React Toastify
- **Comunicación en tiempo real**: Socket.IO Client
- **HTTP Client**: Axios

#### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js 4.18.2
- **ORM**: Sequelize 6.37.7
- **Autenticación**: JWT (jsonwebtoken)
- **Validación**: express-validator
- **WebSockets**: Socket.IO 4.6.1
- **Email**: Nodemailer
- **Seguridad**: bcryptjs, cors

#### Base de Datos
- **Motor**: MySQL 8.0
- **Gestión**: Sequelize ORM

#### DevOps
- **Containerización**: Docker & Docker Compose
- **Control de versiones**: Git
- **Desarrollo**: Nodemon (hot reload)

### 2.4 Módulos Principales

#### 2.4.1 Módulo de Autenticación y Usuarios

**Funcionalidades:**
- Registro de usuarios mediante invitación
- Login con JWT
- Roles: Superadmin, Admin, Empleado
- Sistema de invitaciones con tokens únicos
- Gestión de solicitudes de nuevos locales

**Características:**
- Tokens JWT con expiración
- Contraseñas hasheadas con bcrypt
- Middleware de protección de rutas
- Validación de permisos por rol

#### 2.4.2 Módulo de Locales

**Funcionalidades:**
- CRUD de locales gastronómicos
- Configuración personalizada:
  - Logo (Base64)
  - Colores corporativos
  - Información de contacto
  - Horarios de atención
- Generación de códigos QR únicos
- Sistema multi-local

**Características:**
- Slug único por local
- Configuración JSON flexible
- Relación con usuarios, productos y pedidos

#### 2.4.3 Módulo de Productos y Categorías

**Funcionalidades:**
- CRUD de categorías con iconos
- CRUD de productos con:
  - Imagen (Base64)
  - Precio
  - Descripción
  - Tiempo de preparación
  - Opciones personalizables
  - Estado (disponible/no disponible)
- Ordenamiento personalizado
- Productos destacados

**Características:**
- Categorización jerárquica
- Búsqueda y filtrado
- Gestión de disponibilidad en tiempo real
- Opciones dinámicas (tamaños, extras, etc.)

#### 2.4.4 Módulo de Pedidos

**Funcionalidades:**
- Carrito de compras con localStorage
- Confirmación de pedidos con datos del cliente
- Estados de pedido:
  - Pendiente
  - Preparando
  - Listo
  - Entregado
  - Cancelado
- Seguimiento en tiempo real
- Notificaciones por WebSocket
- Tipos de entrega:
  - Mesa
  - Take Away
  - Delivery

**Características:**
- Numeración automática de pedidos
- Cálculo automático de totales
- Personalización de productos
- Notas del cliente
- Historial completo

#### 2.4.5 Módulo de Pagos

**Funcionalidades:**
- Métodos de pago:
  - Efectivo
  - Transferencia bancaria
  - Mercado Pago
- Configuración de recargos por método
- Carga de comprobantes de transferencia
- Cálculo automático de recargos

**Características:**
- Recargos configurables por local
- Validación de comprobantes
- Almacenamiento de imágenes en Base64
- Datos bancarios configurables (CBU, Alias)

#### 2.4.6 Módulo de Bienvenida y Datos del Cliente

**Funcionalidades:**
- Modal interactivo de bienvenida
- Captura de datos:
  - Nombre completo
  - Teléfono/WhatsApp
  - Método de entrega
  - Dirección (si es delivery)
- Búsqueda de direcciones con OpenStreetMap
- Persistencia de datos en localStorage

**Características:**
- Flujo de 3 pasos
- Autocompletado de direcciones
- Validación de campos
- Pre-llenado en pedidos futuros

### 2.5 Flujo de Trabajo del Sistema

#### Flujo del Cliente

```
1. Cliente escanea QR del local
        ↓
2. Accede a /menu/:localId
        ↓
3. Modal de bienvenida (si es primera vez)
   - Ingresa nombre y teléfono
   - Selecciona método de entrega
   - Ingresa dirección (si es delivery)
        ↓
4. Visualiza menú digital
   - Busca productos
   - Filtra por categoría
   - Ve detalles y opciones
        ↓
5. Agrega productos al carrito
   - Personaliza opciones
   - Agrega notas
        ↓
6. Confirma pedido
   - Revisa datos
   - Selecciona método de pago
   - Sube comprobante (si es transferencia)
        ↓
7. Pedido creado
        ↓
8. Seguimiento en tiempo real
   - Ve estado actual
   - Recibe notificaciones
   - Tiempo estimado
```

#### Flujo del Administrador

```
1. Login en /admin/login
        ↓
2. Dashboard principal
   - Estadísticas del día
   - Pedidos activos
   - Accesos rápidos
        ↓
3. Gestión de contenido
   - Productos
   - Categorías
   - Configuración del local
        ↓
4. Gestión de pedidos
   - Lista de pedidos
   - Cambio de estados
   - Visualización de detalles
        ↓
5. Configuración
   - Métodos de pago
   - Recargos
   - Usuarios
   - Generación de QR
```

### 2.6 Características Destacadas

#### 2.6.1 Experiencia del Cliente

**Interfaz Intuitiva**
- Diseño responsive para móviles
- Navegación fluida
- Búsqueda en tiempo real
- Filtros por categoría

**Personalización**
- Opciones dinámicas por producto
- Notas especiales
- Visualización de tiempo de preparación

**Transparencia**
- Seguimiento en tiempo real
- Estados visuales claros
- Notificaciones automáticas

#### 2.6.2 Gestión Administrativa

**Dashboard Completo**
- Estadísticas en tiempo real
- Pedidos del día
- Accesos rápidos

**Gestión Eficiente**
- CRUD completo de productos
- Actualización instantánea
- Gestión de disponibilidad

**Control de Calidad**
- Validaciones de datos
- Confirmación de acciones críticas
- Historial de cambios

#### 2.6.3 Tecnología Avanzada

**Tiempo Real**
- WebSockets para actualizaciones instantáneas
- Sincronización automática
- Notificaciones push

**Seguridad**
- Autenticación JWT
- Contraseñas encriptadas
- Validación de datos
- Protección de rutas

**Escalabilidad**
- Arquitectura modular
- Base de datos relacional
- API RESTful
- Containerización con Docker

### 2.7 Beneficios del Sistema

#### Para el Negocio

1. **Reducción de Costos**
   - Eliminación de menús impresos
   - Menos personal necesario para tomar pedidos
   - Actualización gratuita de precios

2. **Eficiencia Operativa**
   - Pedidos directos a cocina
   - Menos errores de comunicación
   - Gestión centralizada

3. **Análisis de Datos**
   - Estadísticas de ventas
   - Productos más vendidos
   - Horarios pico

4. **Flexibilidad**
   - Cambios instantáneos en el menú
   - Gestión de disponibilidad en tiempo real
   - Configuración personalizada

#### Para el Cliente

1. **Comodidad**
   - Pedido desde la mesa
   - Sin esperas para ser atendido
   - Visualización completa del menú

2. **Información Completa**
   - Descripciones detalladas
   - Imágenes de productos
   - Precios actualizados

3. **Control**
   - Seguimiento del pedido
   - Personalización de productos
   - Múltiples métodos de pago

4. **Rapidez**
   - Proceso de pedido ágil
   - Confirmación inmediata
   - Notificaciones en tiempo real

---

## 3. Proceso del Proyecto

*(Sección a completar)*

## 4. Presupuesto

*(Sección a completar)*

## 5. Matriz de Riesgos

*(Sección a completar)*

## 6. Metodología Aplicada

*(Sección a completar)*

## 7. Gestión de Calidad

*(Sección a completar)*

## 8. Tipos de Pruebas

### 8.1 Pruebas Funcionales

*(Sección a completar)*

### 8.2 Pruebas No Funcionales

*(Sección a completar)*

## 9. Conclusión

*(Sección a completar)*

---

**Documento en construcción**  
Última actualización: Noviembre 2025
