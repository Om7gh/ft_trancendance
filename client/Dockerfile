FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm i zustand framer-motion
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]