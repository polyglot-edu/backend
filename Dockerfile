FROM node:20-alpine AS builder

WORKDIR /backend

# Install against the lockfile before copying sources so that editing a source
# file doesn't invalidate the dependency layer.
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci --ignore-scripts

COPY src ./src
RUN npx tsc


FROM node:20-alpine AS runner

WORKDIR /backend

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /backend/dist ./dist

# Uploads are written here by multer. Created up front so the directory exists
# and is writable by `node` even before a persistent volume is mounted over it.
RUN mkdir -p /backend/uploads && chown -R node:node /backend/uploads

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/api/health || exit 1

CMD ["node", "./dist/server.js"]
