import fastify from 'fastify';
import axios from 'fastify-axios';
import cookie from '@fastify/cookie';
import websocket from '@fastify/websocket';
import dataBase from './plugins/dataBase.js';
import statistics from './routes/statistics.js';
import errorHandler from "./plugins/errorHandler.js";
import validateUserPlugin from './plugins/validateUser.js';
import validateRoomPlugin from './plugins/validateRoom.js';

import pongGame from './routes/pongGame.js';

const app = fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      },
    },
});

app.register(axios);
app.register(websocket);

app.register(cookie);
app.register(errorHandler);
app.register(validateUserPlugin);
app.register(validateRoomPlugin);
app.register(dataBase, { dbPath: "/var/local/pong.db", });

app.register(pongGame);
app.register(statistics);

const start = async () => {
  try {
    await app.listen({
      port: 9001,
      host: '0.0.0.0',
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
