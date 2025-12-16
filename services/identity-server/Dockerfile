FROM node:24-bullseye AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY src ./src


RUN npm run build

FROM node:24-bullseye AS final

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# CMD ["npx", "fastify", "start", "-l", "info", "--address", "0.0.0.0", "--port", "4000", "dist/app.js"]
CMD ["npx", "fastify", "start", "--address", "0.0.0.0", "--port", "4000", "--options", "dist/app.js"]
