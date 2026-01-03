FROM node:24-bullseye

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci

COPY . .

CMD ["npm", "run", "start"]
