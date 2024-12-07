FROM node:current-alpine3.19 AS base
WORKDIR /app

COPY package*.json ./
RUN npm i

FROM base AS build
WORKDIR /app
COPY . .
ENV NODE_ENV=production
RUN npm run build && npm prune --omit=dev

FROM node:current-alpine3.19
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 runner

ENV NODE_ENV=production
COPY --from=build --chown=runner:nodejs /app/dist ./dist
COPY --from=build --chown=runner:nodejs /app/.env ./.env
COPY --from=build --chown=runner:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=runner:nodejs /app/package.json ./package.json
COPY --from=build --chown=runner:nodejs /app/public/images/sample*.jpeg ./public/images/
COPY --from=build --chown=runner:nodejs /app/drizzle ./drizzle
COPY --from=build --chown=runner:nodejs /app/drizzle.config.js ./drizzle.config.js

USER runner
EXPOSE 3000

CMD ["npx", "dotenvx", "run", "--", "npm", "run", "start"]