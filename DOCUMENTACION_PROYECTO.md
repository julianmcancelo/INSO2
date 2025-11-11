# 📱 Sistema de Menú Digital para Restaurantes

## Índice

1. [Introducción](#introducción)
2. [Descripción del Proyecto](#descripción-del-proyecto)
3. [Casos de Uso del Sistema](#casos-de-uso-del-sistema)
   - [Actores del Sistema](#actores-del-sistema)
   - [Casos de Uso por Actor](#casos-de-uso-por-actor)
   - [Diagrama de Casos de Uso](#diagrama-de-casos-de-uso)
4. [Proceso del Proyecto](#proceso-del-proyecto)
5. [Presupuesto](#presupuesto)
6. [Matriz de Riesgos](#matriz-de-riesgos)
7. [Metodología Aplicada](#metodología-aplicada)
8. [Gestión de Calidad](#gestión-de-calidad)
9. [Tipos de Pruebas](#tipos-de-pruebas)
   - [Pruebas Funcionales](#pruebas-funcionales)
   - [Pruebas No Funcionales](#pruebas-no-funcionales)
10. [Conclusión](#conclusión)

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

## 3. Casos de Uso del Sistema

### 3.1 Actores del Sistema

El sistema de menú digital cuenta con los siguientes actores principales:

#### 3.1.1 Cliente
**Descripción**: Usuario final que accede al menú digital y realiza pedidos.
- **Características**: No requiere autenticación, accede vía código QR
- **Objetivo**: Visualizar menú, realizar pedidos y hacer seguimiento

#### 3.1.2 Administrador
**Descripción**: Propietario o gerente del local con permisos completos de gestión.
- **Características**: Requiere autenticación, acceso completo al panel administrativo
- **Objetivo**: Gestionar completamente el local, productos, pedidos y configuraciones

#### 3.1.3 Empleado
**Descripción**: Personal del local con permisos limitados para operaciones básicas.
- **Características**: Requiere autenticación, permisos restringidos
- **Objetivo**: Gestionar pedidos y actualizar disponibilidad de productos

#### 3.1.4 Superadministrador
**Descripción**: Usuario con acceso a múltiples locales y configuraciones globales.
- **Características**: Máximo nivel de permisos, gestión multi-local
- **Objetivo**: Administrar el sistema completo y múltiples locales

#### 3.1.5 Sistema
**Descripción**: Actor del sistema que ejecuta procesos automatizados.
- **Características**: Procesos internos sin intervención humana
- **Objetivo**: Mantener sincronización, enviar notificaciones y validar datos

### 3.2 Casos de Uso por Actor

#### 3.2.1 Casos de Uso - Cliente

| ID | Caso de Uso | Descripción | Prioridad |
|---|---|---|---|
| CU-C01 | Acceder al menú digital | Escanear código QR y acceder al menú del local | Alta |
| CU-C02 | Completar datos de bienvenida | Ingresar información personal y preferencias de entrega | Alta |
| CU-C03 | Buscar direcciones | Utilizar OpenStreetMap para autocompletar direcciones | Media |
| CU-C04 | Visualizar menú | Explorar categorías y productos disponibles | Alta |
| CU-C05 | Buscar productos | Buscar productos específicos en el menú | Media |
| CU-C06 | Filtrar por categoría | Filtrar productos por categorías específicas | Media |
| CU-C07 | Ver detalles de producto | Visualizar información detallada de productos | Alta |
| CU-C08 | Personalizar producto | Seleccionar opciones y extras para productos | Alta |
| CU-C09 | Agregar al carrito | Añadir productos personalizados al carrito | Alta |
| CU-C10 | Gestionar carrito | Modificar cantidades y eliminar productos del carrito | Alta |
| CU-C11 | Confirmar pedido | Revisar y confirmar el pedido final | Alta |
| CU-C12 | Seleccionar método de pago | Elegir entre efectivo, transferencia o Mercado Pago | Alta |
| CU-C13 | Cargar comprobante | Subir comprobante de transferencia bancaria | Media |
| CU-C14 | Hacer seguimiento del pedido | Monitorear el estado del pedido en tiempo real | Alta |
| CU-C15 | Recibir notificaciones | Recibir actualizaciones automáticas del estado | Media |

#### 3.2.2 Casos de Uso - Administrador

| ID | Caso de Uso | Descripción | Prioridad |
|---|---|---|---|
| CU-A01 | Iniciar sesión | Autenticarse en el panel administrativo | Alta |
| CU-A02 | Gestionar local | Configurar información, logo y colores del local | Alta |
| CU-A03 | Gestionar categorías | Crear, editar y eliminar categorías de productos | Alta |
| CU-A04 | Gestionar productos | CRUD completo de productos del menú | Alta |
| CU-A05 | Configurar opciones de productos | Definir tamaños, extras y personalizaciones | Media |
| CU-A06 | Gestionar disponibilidad | Activar/desactivar productos en tiempo real | Alta |
| CU-A07 | Gestionar pedidos | Visualizar y cambiar estados de pedidos | Alta |
| CU-A08 | Configurar métodos de pago | Establecer recargos y datos bancarios | Media |
| CU-A09 | Generar código QR | Crear códigos QR para acceso al menú | Media |
| CU-A10 | Gestionar usuarios | Invitar y administrar empleados | Media |
| CU-A11 | Ver estadísticas | Consultar dashboard con métricas del negocio | Media |
| CU-A12 | Configurar horarios | Establecer horarios de atención del local | Baja |

#### 3.2.3 Casos de Uso - Empleado

| ID | Caso de Uso | Descripción | Prioridad |
|---|---|---|---|
| CU-E01 | Iniciar sesión | Autenticarse con permisos limitados | Alta |
| CU-E02 | Gestionar pedidos | Cambiar estados de pedidos (preparando, listo, entregado) | Alta |
| CU-E03 | Ver lista de pedidos | Consultar pedidos activos y pendientes | Alta |
| CU-E04 | Actualizar disponibilidad | Marcar productos como no disponibles temporalmente | Media |
| CU-E05 | Ver detalles de pedidos | Consultar información completa de cada pedido | Alta |

#### 3.2.4 Casos de Uso - Superadministrador

| ID | Caso de Uso | Descripción | Prioridad |
|---|---|---|---|
| CU-S01 | Gestionar múltiples locales | Administrar varios locales desde una cuenta | Alta |
| CU-S02 | Aprobar solicitudes | Revisar y aprobar solicitudes de nuevos locales | Media |
| CU-S03 | Gestionar administradores | Asignar administradores a locales específicos | Media |
| CU-S04 | Configurar sistema | Realizar configuraciones globales del sistema | Baja |

#### 3.2.5 Casos de Uso - Sistema

| ID | Caso de Uso | Descripción | Prioridad |
|---|---|---|---|
| CU-SYS01 | Enviar notificaciones | Notificar cambios de estado via WebSocket | Alta |
| CU-SYS02 | Generar números de pedido | Asignar numeración automática a pedidos | Alta |
| CU-SYS03 | Calcular totales | Computar precios con recargos y personalizaciones | Alta |
| CU-SYS04 | Validar datos | Verificar integridad de información ingresada | Alta |
| CU-SYS05 | Sincronizar en tiempo real | Mantener datos actualizados entre usuarios | Media |

### 3.3 Diagrama de Casos de Uso

```
                    SISTEMA DE MENÚ DIGITAL
    ┌─────────────────────────────────────────────────────────────┐
    │                                                             │
    │  Cliente                    Sistema                         │
    │    │                         │                             │
    │    ├─ Acceder al menú       ├─ Enviar notificaciones       │
    │    ├─ Completar bienvenida  ├─ Generar números pedido      │
    │    ├─ Buscar direcciones    ├─ Calcular totales            │
    │    ├─ Visualizar menú       ├─ Validar datos               │
    │    ├─ Buscar productos      └─ Sincronizar tiempo real     │
    │    ├─ Filtrar categorías                                   │
    │    ├─ Ver detalles                                         │
    │    ├─ Personalizar producto                                │
    │    ├─ Gestionar carrito                                    │
    │    ├─ Confirmar pedido                                     │
    │    ├─ Seleccionar pago                                     │
    │    ├─ Cargar comprobante                                   │
    │    ├─ Seguir pedido                                        │
    │    └─ Recibir notificaciones                               │
    │                                                             │
    │  Administrador              Empleado                       │
    │    │                         │                             │
    │    ├─ Iniciar sesión        ├─ Iniciar sesión             │
    │    ├─ Gestionar local       ├─ Gestionar pedidos          │
    │    ├─ Gestionar categorías  ├─ Ver lista pedidos          │
    │    ├─ Gestionar productos   ├─ Actualizar disponibilidad  │
    │    ├─ Configurar opciones   └─ Ver detalles pedidos       │
    │    ├─ Gestionar disponibilidad                            │
    │    ├─ Gestionar pedidos                                   │
    │    ├─ Configurar pagos                                    │
    │    ├─ Generar QR                                          │
    │    ├─ Gestionar usuarios                                  │
    │    ├─ Ver estadísticas                                    │
    │    └─ Configurar horarios                                 │
    │                                                             │
    │  Superadministrador                                        │
    │    │                                                       │
    │    ├─ Gestionar múltiples locales                         │
    │    ├─ Aprobar solicitudes                                 │
    │    ├─ Gestionar administradores                           │
    │    └─ Configurar sistema                                  │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
```

### 3.4 Relaciones entre Casos de Uso

#### 3.4.1 Dependencias Principales

**Flujo del Cliente:**
- CU-C01 → CU-C02 → CU-C04 → CU-C09 → CU-C11 → CU-C14

**Flujo del Administrador:**
- CU-A01 → CU-A02 → CU-A04 → CU-A06 → CU-A07

**Flujo del Empleado:**
- CU-E01 → CU-E03 → CU-E02

#### 3.4.2 Casos de Uso Críticos

Los siguientes casos de uso son considerados críticos para el funcionamiento del sistema:

1. **CU-C01** - Acceder al menú digital
2. **CU-C11** - Confirmar pedido
3. **CU-A07** - Gestionar pedidos
4. **CU-E02** - Gestionar pedidos (empleado)
5. **CU-SYS01** - Enviar notificaciones

### 3.5 Precondiciones y Postcondiciones

#### Ejemplo: CU-C11 - Confirmar Pedido

**Precondiciones:**
- El cliente ha completado los datos de bienvenida
- Existe al menos un producto en el carrito
- Se ha seleccionado un método de pago válido
- Los datos del cliente están completos

**Postcondiciones:**
- Se genera un nuevo pedido con estado "Pendiente"
- Se asigna un número único al pedido
- Se envía notificación al local
- Se limpia el carrito del cliente
- Se redirige al cliente a la página de seguimiento

---

## 4. Proceso del Proyecto

*(Sección a completar)*

## 5. Presupuesto

*(Sección a completar)*

## 6. Matriz de Riesgos

### 6.1 Metodología de Evaluación

La matriz de riesgos utiliza una escala de **Probabilidad** e **Impacto** de 1 a 5, donde:

**Probabilidad:**
- 1 = Muy Baja (< 10%)
- 2 = Baja (10-30%)
- 3 = Media (30-50%)
- 4 = Alta (50-70%)
- 5 = Muy Alta (> 70%)

**Impacto:**
- 1 = Muy Bajo (sin afectación significativa)
- 2 = Bajo (afectación menor)
- 3 = Medio (afectación moderada)
- 4 = Alto (afectación considerable)
- 5 = Muy Alto (afectación crítica)

**Nivel de Riesgo = Probabilidad × Impacto**

### 6.2 Clasificación de Riesgos

| Rango | Nivel | Color | Acción Requerida |
|-------|-------|-------|------------------|
| 1-4 | Bajo | 🟢 Verde | Monitorear |
| 5-9 | Medio | 🟡 Amarillo | Planificar mitigación |
| 10-15 | Alto | 🟠 Naranja | Mitigar activamente |
| 16-25 | Crítico | 🔴 Rojo | Acción inmediata |

### 6.3 Identificación de Riesgos

| ID | Categoría | Riesgo | Descripción | Prob | Imp | Nivel | Estado |
|----|-----------|--------|-------------|------|-----|-------|--------|
| R01 | Técnico | Falla del servidor | Caída del servidor backend afectando el servicio | 2 | 5 | 🟠 10 | Activo |
| R02 | Técnico | Problemas de conectividad | Pérdida de conexión a internet en el local | 3 | 4 | 🟠 12 | Activo |
| R03 | Técnico | Errores en WebSocket | Falla en notificaciones en tiempo real | 2 | 3 | 🟢 6 | Activo |
| R04 | Técnico | Sobrecarga de base de datos | Rendimiento lento por alto volumen de pedidos | 3 | 3 | 🟡 9 | Activo |
| R05 | Seguridad | Vulnerabilidades de autenticación | Acceso no autorizado al panel admin | 2 | 5 | 🟠 10 | Activo |
| R06 | Seguridad | Pérdida de datos | Corrupción o pérdida de información de pedidos | 1 | 5 | 🟡 5 | Activo |
| R07 | Operacional | Resistencia al cambio | Personal no adopta el nuevo sistema | 4 | 3 | 🟠 12 | Activo |
| R08 | Operacional | Capacitación insuficiente | Usuarios no saben usar el sistema correctamente | 3 | 3 | 🟡 9 | Activo |
| R09 | Operacional | Dependencia de QR | Clientes no pueden escanear códigos QR | 2 | 4 | 🟡 8 | Activo |
| R10 | Negocio | Competencia | Aparición de soluciones similares más baratas | 4 | 2 | 🟡 8 | Activo |
| R11 | Negocio | Cambios regulatorios | Nuevas normativas afectan el funcionamiento | 2 | 3 | 🟢 6 | Activo |
| R12 | Técnico | Compatibilidad móvil | Problemas en diferentes dispositivos/navegadores | 3 | 3 | 🟡 9 | Activo |
| R13 | Operacional | Picos de demanda | Sistema no soporta alta concurrencia | 3 | 4 | 🟠 12 | Activo |
| R14 | Técnico | Integración de pagos | Fallas en Mercado Pago o métodos de pago | 2 | 4 | 🟡 8 | Activo |
| R15 | Operacional | Errores humanos | Personal comete errores en gestión de pedidos | 4 | 2 | 🟡 8 | Activo |

### 6.4 Matriz de Calor de Riesgos

```
MATRIZ DE RIESGOS - SISTEMA DE MENÚ DIGITAL

        PROBABILIDAD
        1    2    3    4    5
    5   🟡   🟠   🟠   🔴   🔴
I   4   🟢   🟡   🟠   🟠   🔴
M   3   🟢   🟢   🟡   🟠   🟠
P   2   🟢   🟢   🟢   🟡   🟠
A   1   🟢   🟢   🟢   🟢   🟡
C
T   Riesgos por cuadrante:
O   🔴 Crítico: Ninguno identificado
    🟠 Alto: R01, R02, R05, R07, R13
    🟡 Medio: R04, R06, R08, R10, R12, R14, R15
    🟢 Bajo: R03, R11
```

### 6.5 Estrategias de Mitigación

#### 6.5.1 Riesgos Altos (🟠)

**R01 - Falla del servidor**
- **Mitigación**: Implementar redundancia de servidores y backups automáticos
- **Contingencia**: Plan de recuperación de desastres en < 2 horas
- **Responsable**: Equipo DevOps
- **Fecha límite**: Antes del lanzamiento

**R02 - Problemas de conectividad**
- **Mitigación**: Modo offline temporal para toma de pedidos manual
- **Contingencia**: Protocolo de pedidos por teléfono como respaldo
- **Responsable**: Administrador del local
- **Fecha límite**: Capacitación previa al lanzamiento

**R05 - Vulnerabilidades de autenticación**
- **Mitigación**: Implementar 2FA y auditorías de seguridad regulares
- **Contingencia**: Cambio inmediato de credenciales comprometidas
- **Responsable**: Equipo de desarrollo
- **Fecha límite**: Antes del lanzamiento

**R07 - Resistencia al cambio**
- **Mitigación**: Programa de capacitación y incentivos para adopción
- **Contingencia**: Soporte técnico dedicado durante primeras semanas
- **Responsable**: Gerente del proyecto
- **Fecha límite**: 2 semanas antes del lanzamiento

**R13 - Picos de demanda**
- **Mitigación**: Pruebas de carga y escalado automático de recursos
- **Contingencia**: Limitación temporal de pedidos simultáneos
- **Responsable**: Equipo técnico
- **Fecha límite**: Testing previo al lanzamiento

#### 6.5.2 Riesgos Medios (🟡)

**R04 - Sobrecarga de base de datos**
- **Mitigación**: Optimización de consultas y índices de base de datos
- **Monitoreo**: Alertas de rendimiento automáticas

**R06 - Pérdida de datos**
- **Mitigación**: Backups automáticos cada 6 horas y réplicas de BD
- **Verificación**: Pruebas de restauración mensuales

**R08 - Capacitación insuficiente**
- **Mitigación**: Manual de usuario y videos tutoriales
- **Soporte**: Línea de ayuda durante primeros 30 días

**R12 - Compatibilidad móvil**
- **Mitigación**: Testing en múltiples dispositivos y navegadores
- **Fallback**: Versión simplificada para navegadores antiguos

**R14 - Integración de pagos**
- **Mitigación**: Múltiples métodos de pago alternativos
- **Contingencia**: Proceso manual para pagos fallidos

### 6.6 Plan de Monitoreo

| Riesgo | Indicador | Frecuencia | Umbral de Alerta | Acción |
|--------|-----------|------------|------------------|--------|
| R01 | Uptime del servidor | Continuo | < 99% | Investigar causa |
| R02 | Conectividad local | Diario | > 2 desconexiones/día | Revisar infraestructura |
| R04 | Tiempo de respuesta BD | Continuo | > 2 segundos | Optimizar consultas |
| R07 | Adopción del sistema | Semanal | < 80% uso | Reforzar capacitación |
| R13 | Concurrencia | Continuo | > 80% capacidad | Escalar recursos |

### 6.7 Responsabilidades

| Rol | Responsabilidades |
|-----|-------------------|
| **Project Manager** | Monitoreo general de riesgos, coordinación de mitigaciones |
| **Tech Lead** | Riesgos técnicos (R01, R03, R04, R05, R12, R13, R14) |
| **DevOps Engineer** | Infraestructura y disponibilidad (R01, R02, R06) |
| **Business Analyst** | Riesgos operacionales y de negocio (R07, R08, R10, R11, R15) |
| **QA Lead** | Validación de mitigaciones y testing (R12, R13, R14) |

### 6.8 Revisión y Actualización

- **Frecuencia**: Revisión quincenal durante desarrollo, mensual en producción
- **Criterios de actualización**: Cambios en probabilidad/impacto, nuevos riesgos identificados
- **Responsable**: Project Manager con input del equipo completo
- **Documentación**: Registro de cambios en esta matriz con fechas y justificaciones

## 7. Metodología Aplicada

### 7.1 Metodología Seleccionada: Scrum

Para el desarrollo del Sistema de Menú Digital se ha seleccionado **Scrum** como metodología ágil principal, complementada con prácticas de DevOps para la integración y despliegue continuo.

### 7.2 Justificación de la Elección

#### 7.2.1 Características del Proyecto que Favorecen Scrum

| Característica | Descripción | Beneficio de Scrum |
|----------------|-------------|-------------------|
| **Complejidad Media** | Sistema con múltiples módulos interconectados | Framework estructurado pero flexible |
| **Stakeholders Diversos** | Dueños, empleados, clientes, desarrolladores | Roles claros y comunicación regular |
| **Requisitos Evolutivos** | Necesidades pueden cambiar según feedback | Adaptabilidad en cada sprint |
| **Entrega Incremental** | Valor entregado por módulos funcionales | Sprints con entregables utilizables |
| **Equipo Pequeño-Medio** | 3-7 personas en el equipo de desarrollo | Tamaño ideal para Scrum |

#### 7.2.2 Comparación con Otras Metodologías

| Metodología | Ventajas | Desventajas para este proyecto |
|-------------|----------|-------------------------------|
| **Scrum** ✅ | Estructura clara, feedback rápido, adaptable | Requiere disciplina en ceremonias |
| **Kanban** | Flujo continuo, visual | Menos estructura para equipos nuevos |
| **XP** | Calidad técnica alta | Muy técnico, menos gestión de producto |
| **Cascada** | Predecible | Inflexible para cambios de requisitos |

### 7.3 Implementación de Scrum

#### 7.3.1 Roles del Equipo

| Rol Scrum | Responsable | Responsabilidades Principales |
|-----------|-------------|------------------------------|
| **Product Owner** | Líder de Producto | - Gestionar Product Backlog<br>- Definir criterios de aceptación<br>- Priorizar funcionalidades<br>- Comunicación con stakeholders |
| **Scrum Master** | Facilitador del Equipo | - Facilitar ceremonias Scrum<br>- Eliminar impedimentos<br>- Coaching del equipo<br>- Proteger al equipo de interrupciones |
| **Development Team** | Equipo de Desarrollo | - Desarrollar funcionalidades<br>- Estimar user stories<br>- Autoorganizarse<br>- Entregar incrementos de valor |

#### 7.3.2 Artefactos Scrum

**Product Backlog**
- Lista priorizada de funcionalidades
- User stories con criterios de aceptación
- Estimaciones en story points
- Épicas divididas en historias más pequeñas

**Sprint Backlog**
- Historias seleccionadas para el sprint actual
- Tareas técnicas detalladas
- Estimaciones en horas
- Responsables asignados

**Incremento de Producto**
- Funcionalidad potencialmente entregable
- Cumple Definition of Done
- Integrado y probado
- Desplegable en ambiente de producción

#### 7.3.3 Eventos Scrum

| Evento | Duración | Frecuencia | Participantes | Objetivo |
|--------|----------|------------|---------------|----------|
| **Sprint Planning** | 4 horas | Inicio de sprint | Todo el equipo | Planificar trabajo del sprint |
| **Daily Scrum** | 15 min | Diario | Development Team | Sincronización y planificación diaria |
| **Sprint Review** | 2 horas | Final de sprint | Equipo + stakeholders | Demostrar incremento y obtener feedback |
| **Sprint Retrospective** | 1.5 horas | Final de sprint | Todo el equipo | Mejorar proceso del equipo |

### 7.4 Configuración Específica del Proyecto

#### 7.4.1 Duración de Sprints
- **Duración**: 2 semanas (10 días laborables)
- **Justificación**: Balance entre feedback rápido y tiempo suficiente para desarrollo

#### 7.4.2 Definition of Ready (DoR)
Una user story está lista para desarrollo cuando:
- ✅ Tiene criterios de aceptación claros
- ✅ Está estimada por el equipo
- ✅ Las dependencias están identificadas
- ✅ Los mockups/wireframes están disponibles (si aplica)
- ✅ Los criterios de testing están definidos

#### 7.4.3 Definition of Done (DoD)
Una funcionalidad está terminada cuando:
- ✅ Código desarrollado y revisado (code review)
- ✅ Pruebas unitarias implementadas y pasando
- ✅ Pruebas de integración ejecutadas
- ✅ Documentación técnica actualizada
- ✅ Funcionalidad probada en ambiente de staging
- ✅ Criterios de aceptación validados
- ✅ Sin bugs críticos o de alta prioridad

### 7.5 Épicas y User Stories del Proyecto

#### 7.5.1 Épicas Principales

| ID | Épica | Descripción | Prioridad | Estimación |
|----|-------|-------------|-----------|------------|
| E01 | Autenticación y Usuarios | Sistema de login, roles y permisos | Alta | 21 SP |
| E02 | Gestión de Locales | CRUD de locales y configuraciones | Alta | 34 SP |
| E03 | Menú Digital Cliente | Interfaz pública para clientes | Alta | 55 SP |
| E04 | Gestión de Productos | CRUD de productos y categorías | Alta | 34 SP |
| E05 | Sistema de Pedidos | Carrito, checkout y seguimiento | Alta | 89 SP |
| E06 | Panel Administrativo | Dashboard y gestión para admins | Media | 34 SP |
| E07 | Pagos y Facturación | Integración de métodos de pago | Media | 21 SP |
| E08 | Notificaciones | WebSocket y notificaciones push | Baja | 13 SP |

#### 7.5.2 Ejemplo de User Stories (Épica E03)

**US-E03-01**: Como cliente, quiero escanear un código QR para acceder al menú digital
- **Criterios de Aceptación**:
  - El QR redirige a la URL correcta del local
  - La página carga en menos de 3 segundos
  - Es compatible con dispositivos móviles
- **Estimación**: 5 SP

**US-E03-02**: Como cliente, quiero ver las categorías de productos organizadas
- **Criterios de Aceptación**:
  - Las categorías se muestran con iconos
  - Filtrado funcional por categoría
  - Diseño responsive
- **Estimación**: 8 SP

### 7.6 Planificación de Releases

#### 7.6.1 Release Plan

| Release | Versión | Épicas Incluidas | Duración | Fecha Objetivo |
|---------|---------|------------------|----------|----------------|
| **MVP** | v1.0 | E01, E02, E03, E04 | 8 sprints | Mes 4 |
| **Beta** | v1.1 | E05, E06 | 4 sprints | Mes 6 |
| **Production** | v2.0 | E07, E08 + mejoras | 4 sprints | Mes 8 |

#### 7.6.2 Roadmap de Sprints

```
Sprint 1-2: Autenticación y base del sistema
Sprint 3-4: Gestión de locales y configuración
Sprint 5-6: Menú digital básico para clientes
Sprint 7-8: Gestión de productos y categorías
Sprint 9-10: Sistema de pedidos core
Sprint 11-12: Panel administrativo
Sprint 13-14: Integración de pagos
Sprint 15-16: Notificaciones y pulido final
```

### 7.7 Herramientas y Prácticas Complementarias

#### 7.7.1 Herramientas de Gestión
- **Jira/Azure DevOps**: Gestión de backlog y sprints
- **Slack/Teams**: Comunicación del equipo
- **Confluence**: Documentación y knowledge base
- **Figma**: Diseño y prototipado

#### 7.7.2 Prácticas de Desarrollo
- **Git Flow**: Gestión de ramas y releases
- **Code Review**: Revisión obligatoria de código
- **Pair Programming**: Para funcionalidades complejas
- **Test-Driven Development**: Para lógica crítica de negocio

#### 7.7.3 DevOps Integration
- **CI/CD Pipeline**: Integración y despliegue automático
- **Docker**: Containerización para consistency
- **Automated Testing**: Pruebas automáticas en pipeline
- **Monitoring**: Seguimiento de aplicación en producción

### 7.8 Métricas y Seguimiento

#### 7.8.1 Métricas de Sprint
- **Velocity**: Story points completados por sprint
- **Burndown Chart**: Progreso del sprint día a día
- **Sprint Goal Achievement**: % de objetivo de sprint alcanzado
- **Defect Rate**: Bugs encontrados post-desarrollo

#### 7.8.2 Métricas de Release
- **Lead Time**: Tiempo desde idea hasta producción
- **Cycle Time**: Tiempo de desarrollo de una historia
- **Customer Satisfaction**: Feedback de stakeholders
- **Technical Debt**: Deuda técnica acumulada

### 7.9 Gestión de Riesgos en Scrum

#### 7.9.1 Identificación Temprana
- **Sprint Review**: Feedback temprano de stakeholders
- **Daily Scrum**: Identificación diaria de impedimentos
- **Retrospectives**: Análisis de problemas del proceso

#### 7.9.2 Mitigación Ágil
- **Sprints Cortos**: Reducen impacto de cambios
- **Incrementos Funcionales**: Permiten pivotear rápidamente
- **Comunicación Constante**: Evita malentendidos

### 7.10 Adaptaciones Específicas

#### 7.10.1 Consideraciones del Dominio
- **Testing con Usuarios Reales**: Restaurantes piloto para feedback
- **Horarios de Negocio**: Despliegues fuera de horas pico
- **Escalabilidad**: Consideración desde sprint 1
- **Seguridad**: Revisiones de seguridad en cada release

#### 7.10.2 Flexibilidad del Framework
- **Ceremonias Remotas**: Adaptación para trabajo distribuido
- **Documentación Mínima**: Solo la necesaria para el contexto
- **Stakeholder Involvement**: Participación activa de dueños de restaurantes

## 8. Gestión de Calidad

*(Sección a completar)*

## 9. Tipos de Pruebas

### 9.1 Pruebas Funcionales

*(Sección a completar)*

### 9.2 Pruebas No Funcionales

*(Sección a completar)*

## 10. Conclusión

*(Sección a completar)*

---

**Documento en construcción**  
Última actualización: Noviembre 2025
