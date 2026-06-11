# syntax=docker/dockerfile:1
# apps/docs/Dockerfile — multi-stage, monorepo-aware (pnpm + turbo)
FROM node:24-alpine AS build
WORKDIR /repo
RUN corepack enable
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY packages ./packages
COPY apps/docs ./apps/docs
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm config set store-dir /pnpm/store && pnpm i --frozen-lockfile --prefer-offline
RUN pnpm --filter docs build          # builds core + react + docs (turbo)
FROM node:24-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /repo/apps/docs/.next/standalone ./
COPY --from=build /repo/apps/docs/.next/static ./apps/docs/.next/static
COPY --from=build /repo/apps/docs/public ./apps/docs/public
EXPOSE 3000
CMD ["node", "apps/docs/server.js"]
