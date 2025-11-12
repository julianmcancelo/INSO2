# Stage 1: Dependencies
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias desde stage anterior
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./

# Instalar todas las dependencias (incluyendo dev)
RUN npm install

# Copiar código fuente
COPY . .

# Stage 3: Production
FROM node:20-alpine AS production

# Instalar dumb-init para mejor manejo de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copiar dependencias de producción
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copiar código fuente
COPY --chown=nodejs:nodejs . .

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usar dumb-init para mejor manejo de señales
ENTRYPOINT ["dumb-init", "--"]

# Comando por defecto
CMD ["node", "src/server.js"]
