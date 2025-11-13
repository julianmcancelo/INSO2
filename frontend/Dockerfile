# Stage 1: Dependencies
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (usar install en lugar de ci para mayor flexibilidad)
RUN npm install && npm cache clean --force

# Stage 2: Builder (para producción)
FROM node:20-alpine AS builder

WORKDIR /app

# Argumentos de build para variables de entorno
ARG REACT_APP_API_URL
ARG REACT_APP_SOCKET_URL

# Establecer variables de entorno para el build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_SOCKET_URL=$REACT_APP_SOCKET_URL

# Copiar dependencias
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Build de producción
RUN npm run build

# Stage 3: Production (servir con nginx)
FROM nginx:alpine AS production

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar build de React
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Crear usuario no-root para nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Cambiar a usuario no-root
USER nginx

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

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
