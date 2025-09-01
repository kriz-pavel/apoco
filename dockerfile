# --- builder ---
FROM node:22.19.0-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# --- runner ---
FROM node:22.19.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /app/package.json /app/yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/mikro-orm.config.ts ./
COPY --from=builder /app/.env ./.env
EXPOSE 3000
USER app
CMD ["node","dist/main.js"]
