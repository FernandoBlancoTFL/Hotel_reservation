FROM node:18-alpine AS deps
WORKDIR /app

# Copiar solo package.json del frontend
COPY apps/frontend/package*.json ./

# Instalar dependencias
RUN npm ci --ignore-scripts

FROM node:18-alpine AS builder
WORKDIR /app

# Copiar node_modules desde deps
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente del frontend
COPY apps/frontend ./

# Build
RUN npm run build

FROM nginx:alpine AS runner

# Copiar build al nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración nginx
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]