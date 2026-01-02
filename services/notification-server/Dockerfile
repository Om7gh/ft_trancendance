FROM node:24-bullseye

WORKDIR /usr/src/app

COPY . ./

RUN npm ci

CMD ["npm", "run", "start"]
