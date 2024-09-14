FROM node:lts-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm i

FROM base AS build
WORKDIR /app
COPY . .
RUN npm run build && \
    npm prune --production

FROM node:lts-alpine
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 runner

COPY --from=build --chown=runner:nodejs /app/dist ./dist
COPY --from=build --chown=runner:nodejs /app/.env.prod ./.env.prod
COPY --from=build --chown=runner:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=runner:nodejs /app/package.json ./package.json

USER runner
EXPOSE 3000

ENV EXPRESS_PORT=3000

CMD ["node", "dist/index.js"]