# 📊 Metodología de Desarrollo - Cartita

## 🎯 Metodología Aplicada: SCRUM

### Justificación de la Elección

Para el desarrollo de Cartita, se optó por la metodología ágil **SCRUM** debido a las características específicas del proyecto y las necesidades del cliente.

#### Razones para elegir SCRUM:

**1. Iteraciones claras:**
Este proyecto tiene fases bien definidas (análisis, diseño, desarrollo, pruebas, despliegue, mantenimiento) que pueden transformarse en sprints, permitiendo que se entreguen funcionalidades clave de forma incremental, como el sistema de autenticación, el menú digital QR, el sistema de pedidos en tiempo real, y la recuperación de contraseñas.

**2. Flexibilidad:**
Dado que las funcionalidades finales podrían ajustarse en base al feedback de los administradores de restaurantes durante las pruebas de usabilidad, SCRUM facilita adaptarse a estos cambios gracias a su enfoque en revisiones y adaptaciones constantes. Por ejemplo, durante el desarrollo se identificó la necesidad de cambiar de Gmail SMTP a SendGrid debido a limitaciones de infraestructura, y SCRUM permitió adaptar rápidamente el sprint para implementar esta solución alternativa.

**3. Enfoque en entregas de valor:**
Las funcionalidades como el menú digital para clientes, el sistema de pedidos en tiempo real y la gestión de productos son de alta prioridad para los usuarios. SCRUM asegura que los elementos más críticos se desarrollen y entreguen primero, permitiendo que el restaurante pueda comenzar a operar digitalmente lo antes posible.

**4. Colaboración con el cliente:**
La interacción constante con los responsables del restaurante en las reuniones iniciales y pruebas se alinea con el rol del Product Owner en SCRUM, quien define las prioridades y asegura que las necesidades del negocio estén al centro del desarrollo. Las ceremonias de Sprint Review permitieron obtener feedback valioso sobre el diseño del menú, la experiencia de usuario y las funcionalidades requeridas.

---

## 📅 Estructura de Sprints

### Sprint 1: Fundamentos y Autenticación (2 semanas)
**Objetivo:** Establecer la base del proyecto y sistema de usuarios

**User Stories:**
- Como administrador, quiero iniciar sesión para acceder al panel
- Como sistema, necesito roles para controlar permisos
- Como desarrollador, necesito la estructura base del proyecto

**Entregables:**
- ✅ Configuración de proyecto (Docker, Git)
- ✅ Base de datos inicial
- ✅ Sistema de autenticación con JWT
- ✅ Roles: SuperAdmin, Admin, 
- ✅ Login/Logout funcional

**Story Points:** 21
**Velocity:** 21 pts

---

### Sprint 2: Gestión de Menú (2 semanas)
**Objetivo:** CRUD completo de productos y categorías

**User Stories:**
- Como administrador, quiero crear productos para mostrar en el menú
- Como administrador, quiero organizar productos en categorías
- Como administrador, quiero subir imágenes de productos

**Entregables:**
- ✅ CRUD de categorías
- ✅ CRUD de productos
- ✅ Upload de imágenes en Base64
- ✅ Gestión de precios y disponibilidad
- ✅ Ordenamiento de categorías

**Story Points:** 26
**Velocity:** 26 pts

---

### Sprint 3: Sistema de Pedidos (2 semanas)
**Objetivo:** Implementar pedidos en tiempo real

**User Stories:**
- Como cliente, quiero hacer pedidos desde el menú digital
- Como administrador, quiero recibir pedidos en tiempo real
- Como administrador, quiero gestionar estados de pedidos

**Entregables:**
- ✅ Carrito de compras
- ✅ Socket.IO para tiempo real
- ✅ Estados de pedidos
- ✅ Notificaciones push
- ✅ Gestión de mesas

**Story Points:** 34
**Velocity:** 34 pts

---

### Sprint 4: Menú Digital para Clientes (2 semanas)
**Objetivo:** Interfaz pública del menú QR

**User Stories:**
- Como cliente, quiero ver el menú desde mi móvil
- Como cliente, quiero buscar productos
- Como cliente, quiero ver horarios del local

**Entregables:**
- ✅ Menú responsive
- ✅ Búsqueda y filtros
- ✅ Modal de bienvenida
- ✅ Horarios de atención
- ✅ Información del local

**Story Points:** 28
**Velocity:** 28 pts

---

### Sprint 5: Recuperación de Contraseña y Emails (1 semana)
**Objetivo:** Sistema completo de recuperación

**User Stories:**
- Como usuario, quiero recuperar mi contraseña por email
- Como sistema, necesito enviar emails profesionales

**Entregables:**
- ✅ Formulario de recuperación
- ✅ Tokens de seguridad
- ✅ Email HTML profesional
- ✅ Integración con Gmail/SendGrid
- ⏳ Deployment funcional (en progreso)

**Story Points:** 18
**Velocity:** 15 pts (ajustado por problemas de SMTP)

---

### Sprint 6: Optimizaciones y Deployment (1 semana)
**Objetivo:** Preparar para producción

**User Stories:**
- Como usuario, quiero que la app cargue rápido
- Como desarrollador, necesito la app en producción

**Entregables:**
- ✅ Footer en todas las páginas
- ✅ Optimización de imágenes
- ✅ Deployment en Render
- ✅ Deployment en Netlify/Vercel
- ✅ Documentación completa

**Story Points:** 16
**Velocity:** 16 pts

---

## 📊 Métricas del Proyecto

### Velocity Chart
```
Story Points por Sprint:
Sprint 1: ████████████████████ 21 pts
Sprint 2: ██████████████████████████ 26 pts
Sprint 3: ██████████████████████████████████ 34 pts
Sprint 4: ████████████████████████████ 28 pts
Sprint 5: ██████████████████ 18 pts
Sprint 6: ████████████████ 16 pts

Promedio: 23.8 pts/sprint
```

### Burndown Chart - Sprint 5 (Ejemplo)
```
Story Points Restantes
18 │ ●
16 │   ╲
14 │     ●
12 │       ╲
10 │         ●
 8 │           ╲
 6 │             ●
 4 │               ╲
 2 │                 ●
 0 │___________________●
   Día 1  2  3  4  5  6  7
```

---

## 🔄 Ceremonias SCRUM

### Daily Standup (15 minutos)
**Frecuencia:** Diaria
**Participantes:** Todo el equipo

**Formato:**
1. ¿Qué hice ayer?
2. ¿Qué haré hoy?
3. ¿Tengo impedimentos?

**Ejemplo:**
```
👤 Developer 1:
✅ Ayer: Implementé el formulario de recuperación
🎯 Hoy: Configurar nodemailer con Gmail
⚠️ Impedimento: Ninguno

👤 Developer 2:
✅ Ayer: Diseñé el email HTML
🎯 Hoy: Integrar con el backend
⚠️ Impedimento: Ninguno
```

---

### Sprint Planning (2-4 horas)
**Frecuencia:** Inicio de cada sprint
**Participantes:** Todo el equipo + Product Owner

**Agenda:**
1. Revisar Product Backlog
2. Seleccionar User Stories
3. Estimar Story Points
4. Definir Sprint Goal
5. Crear Sprint Backlog

**Técnica de estimación:** Planning Poker (Fibonacci: 1, 2, 3, 5, 8, 13, 21)

---

### Sprint Review (1-2 horas)
**Frecuencia:** Final de cada sprint
**Participantes:** Todo el equipo + Stakeholders

**Agenda:**
1. Demostración de funcionalidades
2. Feedback del cliente
3. Actualizar Product Backlog

**Ejemplo - Sprint 5:**
```
✅ Demostrado:
- Formulario de recuperación funcional
- Email con diseño profesional
- Tokens de seguridad implementados

📝 Feedback:
- "El email se ve muy profesional" ✅
- "¿Podemos usar SendGrid en lugar de Gmail?" 📌
- "Agregar footer en todas las páginas" 📌

🔄 Acciones:
- Investigar SendGrid para próximo sprint
- Agregar footer al backlog
```

---

### Sprint Retrospective (1 hora)
**Frecuencia:** Final de cada sprint
**Participantes:** Todo el equipo

**Formato:** Start, Stop, Continue

**Ejemplo - Sprint 5:**
```
🟢 START (Empezar a hacer):
- Investigar limitaciones de infraestructura antes
- Documentar decisiones técnicas en tiempo real
- Tener plan B para servicios externos

🔴 STOP (Dejar de hacer):
- Asumir que servicios externos funcionarán sin probar
- Commit sin probar en entorno similar a producción

🟡 CONTINUE (Seguir haciendo):
- Commits frecuentes y descriptivos
- Documentación clara (RENDER_CONFIG.md)
- Diseño responsive desde el inicio
```

---

## 📋 Tablero Kanban

### Estructura del Tablero
```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│   BACKLOG    │    TO DO     │ IN PROGRESS  │    REVIEW    │     DONE     │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ - Reportes   │ - SendGrid   │ - Timeout    │ - Footer     │ - Login      │
│ - Analytics  │ - Logo local │ - Email fix  │ - Horarios   │ - CRUD Menu  │
│ - Pagos      │              │              │              │ - Pedidos    │
│ - Multi-lang │              │              │              │ - Socket.IO  │
│              │              │              │              │ - Recovery   │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

### Límites WIP (Work In Progress)
- **TO DO:** Sin límite
- **IN PROGRESS:** Máximo 3 tareas
- **REVIEW:** Máximo 2 tareas

---

## ✅ Definition of Done (DoD)

Una tarea se considera "Done" cuando cumple:

### Código
- ✅ Código escrito y funcional
- ✅ Código revisado (code review)
- ✅ Sin errores de linting
- ✅ Comentarios en código complejo

### Testing
- ✅ Tests unitarios pasando (si aplica)
- ✅ Probado en desarrollo
- ✅ Probado en navegadores principales

### Documentación
- ✅ README actualizado
- ✅ Comentarios en código
- ✅ Documentación técnica (si aplica)

### Deployment
- ✅ Commit en Git con mensaje descriptivo
- ✅ Push a repositorio
- ✅ Deploy en desarrollo exitoso
- ✅ Sin bugs críticos

### Aprobación
- ✅ Aprobado por Product Owner
- ✅ Cumple criterios de aceptación

---

## 🎯 Product Backlog

### Priorización: MoSCoW

#### Must Have (Debe tener) - Prioridad Alta
1. ✅ Sistema de autenticación
2. ✅ CRUD de productos y categorías
3. ✅ Sistema de pedidos en tiempo real
4. ✅ Menú digital QR
5. ✅ Recuperación de contraseña

#### Should Have (Debería tener) - Prioridad Media
6. ✅ Footer en todas las páginas
7. ✅ Horarios de atención
8. ⏳ Logo del local (en progreso)
9. ⏳ Emails funcionando en producción (en progreso)
10. 📝 Dashboard con estadísticas

#### Could Have (Podría tener) - Prioridad Baja
11. 📝 Reportes de ventas
12. 📝 Integración de pagos
13. 📝 Notificaciones push
14. 📝 Temas personalizables

#### Won't Have (No tendrá) - Fuera de alcance
15. ❌ App móvil nativa
16. ❌ Multi-idioma
17. ❌ Integración con redes sociales

---

## 📈 Gestión de Riesgos

### Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| SMTP bloqueado en Render | Alta | Alto | ✅ Usar SendGrid/Resend |
| Problemas de performance | Media | Medio | ✅ Optimización de queries |
| Cambios de requisitos | Alta | Medio | ✅ Sprints cortos y flexibles |
| Bugs en producción | Media | Alto | ✅ Testing exhaustivo |

---

## 🛠️ Herramientas Utilizadas

### Gestión de Proyecto
- **GitHub Projects** - Tablero Kanban
- **Git** - Control de versiones
- **GitHub Issues** - Tracking de bugs y features

### Comunicación
- **Discord/Slack** - Chat del equipo
- **Google Meet** - Reuniones

### Desarrollo
- **VS Code** - IDE
- **Docker** - Contenedores
- **Postman** - Testing de API

### Documentación
- **Markdown** - Documentación técnica
- **Draw.io** - Diagramas
- **Notion** - Wiki del proyecto

---

## 📊 Lecciones Aprendidas

### Sprint 5 - Recuperación de Contraseña

**Problema:** Render bloquea puertos SMTP

**Solución:** Cambiar a API HTTP (SendGrid)

**Lección:** Investigar limitaciones de infraestructura antes de implementar

**Impacto:** +3 días de desarrollo

---

## 🎓 Conclusión

La metodología Scrumban permitió:
- ✅ Entregas incrementales funcionales
- ✅ Adaptación rápida a cambios
- ✅ Visibilidad del progreso
- ✅ Mejora continua del proceso
- ✅ Producto de calidad profesional

**Resultado:** Sistema completo y funcional en 10 semanas (6 sprints)
