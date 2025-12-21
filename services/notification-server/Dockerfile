FROM node:24

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY app ./

RUN npm install && npm install better-sqlite3

CMD ["npm", "run", "dev"]
