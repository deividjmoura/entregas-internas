# syntax=docker/dockerfile:1

# ---- Stage 1: build ----
FROM node:20-slim AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY pnpm-workspace.yaml package.json ./
COPY packages/shared ./packages/shared
COPY services/request ./services/request

RUN pnpm install --frozen-lockfile --filter @entregas/request-service... 
RUN pnpm --filter @entregas/shared build
RUN pnpm --filter @entregas/request-service prisma:generate
RUN pnpm --filter @entregas/request-service build

# ---- Stage 2: runtime ----
FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=build /app/services/request/dist ./services/request/dist
COPY --from=build /app/services/request/package.json ./services/request/package.json
COPY --from=build /app/services/request/node_modules ./services/request/node_modules
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3001
CMD ["node", "services/request/dist/main.js"]
