# ─── Build stage ────────────────────────────────────────────────────────────
FROM node:25-alpine AS builder

WORKDIR /app

# Install dependencies first (layer cached unless lockfile changes)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ─── Runtime stage ───────────────────────────────────────────────────────────
FROM node:25-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Nitro bundles everything into .output — no node_modules needed at runtime
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
