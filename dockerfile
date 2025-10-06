# --- deps (prod) ---
FROM node:22.19.0-alpine AS deps
# switch to existing non-root node user
USER node  
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node package.json yarn.lock ./
RUN --mount=type=cache,target=/home/node/.cache/yarn yarn install --production --frozen-lockfile

# --- builder ---
FROM node:22.19.0-alpine AS builder
# switch to existing non-root node user
USER node  
WORKDIR /app
COPY --chown=node:node package.json yarn.lock ./
RUN --mount=type=cache,target=/home/node/.cache/yarn yarn install --frozen-lockfile
COPY --chown=node:node . .
RUN yarn build

# --- runner ---
FROM node:22.19.0-alpine AS runner
# switch to existing non-root node user
USER node  
WORKDIR /app
ENV NODE_ENV=production
RUN mkdir -p /app/temp
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/package.json /app/yarn.lock ./
COPY --chown=node:node --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["yarn","start:prod"]

# --- tester (e2e) ---
FROM node:22.19.0-alpine AS tester
# switch to existing non-root node user
USER node  
WORKDIR /app
ENV NODE_ENV=test
COPY --chown=node:node package.json yarn.lock ./
RUN --mount=type=cache,target=/home/node/.cache/yarn yarn install --frozen-lockfile
COPY --chown=node:node . .
CMD ["yarn","test:e2e"]