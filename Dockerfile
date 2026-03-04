# Build
FROM node:25-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build
RUN find /app/dist -name "*.mjs" | head -20

# Run
FROM node:25-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]