# ---------- Build Stage ----------
FROM node:25.6-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build (vite build -> Nitro output in .output)
RUN npm run build


# ---------- Production Stage ----------
FROM node:25.6-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy only Nitro output
COPY --from=builder /app/.output ./.output

# ECS best practice: run as non-root
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs
USER nodeuser

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]