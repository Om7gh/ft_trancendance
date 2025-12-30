FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm i zustand framer-motion axios
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]