# Stage 1: Dependencies
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install && npm cache clean --force

# Stage 2: Builder (para producción)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Build de producción
RUN npm run build

# Stage 3: Production (servir con nginx)
FROM nginx:alpine AS production

# Copiar configuración de nginx
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]

# Stage 4: Development
FROM node:20-alpine AS development

WORKDIR /app

# Copiar dependencias
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando de desarrollo
CMD ["npm", "start"]
