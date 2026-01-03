FROM node:24-bullseye

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["npm", "run", "start"]
