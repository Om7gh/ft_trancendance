import fastify from 'fastify';
import websocket from '@fastify/websocket';
import cookie from '@fastify/cookie';
import axios from 'fastify-axios';
import corsPlugin from './plugins/corsPlugin.js';
import validateUser from './plugins/validateUser.js';

import pongGame from './routes/pongGame.js';

const app = fastify({
  logger: {level: 'debug',transport: {target: 'pino-pretty',},},
});

app.register(axios);
app.register(websocket);

app.register(cookie);
app.register(corsPlugin);
app.register(validateUser);
app.register(pongGame);

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
