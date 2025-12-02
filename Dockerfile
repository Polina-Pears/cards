#PROD-зависимости бэка
FROM node:20-alpine AS deps
WORKDIR /app

# package.json/lock из корня (бек)
COPY package*.json ./
RUN npm ci --omit=dev

# Сборка бэка + фронта
FROM node:20-alpine AS builder
WORKDIR /app

# backend dev-зависимости (tsc и пр.)
COPY package*.json ./
RUN npm ci

# исходники бэка
COPY tsconfig.json ./
COPY server ./server

# зависимости клиента
COPY client/package*.json ./client/
RUN cd client && npm ci

# исходники клиента
COPY client ./client

# 2.1. Собрать фронт (Vite → dist/client)
RUN cd client && npm run build

# 2.2. Собрать бэк (tsc → dist/server.js)
RUN npm run build

# 3. Финальный лёгкий образ
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# только прод-зависимости бэка
COPY --from=deps /app/node_modules ./node_modules

# готовый билд (server.js + client/)
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
