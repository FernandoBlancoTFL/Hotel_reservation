FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY domain/package*.json ./domain/
COPY apps/backend/package*.json ./apps/backend/

# Instalar todas las dependencias
RUN npm install

FROM base AS builder
WORKDIR /app

# Copiar node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/domain/node_modules ./domain/node_modules  
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules

# Copiar código fuente
COPY domain ./domain
COPY apps/backend ./apps/backend
COPY tsconfig.json ./
COPY package*.json ./

# Build domain primero
WORKDIR /app/domain
RUN npm run build

# Build backend
WORKDIR /app/apps/backend
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiar todo lo necesario
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/domain/dist ./domain/dist
COPY --from=builder /app/domain/package*.json ./domain/
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package*.json ./apps/backend/

EXPOSE 3000

CMD ["node", "apps/backend/dist/index.js"]