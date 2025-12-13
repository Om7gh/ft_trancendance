import fastify          from 'fastify';
import cors             from '@fastify/cors';
import websocket        from '@fastify/websocket';
import cookie           from '@fastify/cookie';
import axios            from 'fastify-axios'

import { pongGame }     from './routes/pongGame.js';

const app = fastify({
  logger: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
    },
  },
});

app.register(axios);

app.register(cookie);

app.register(websocket);

app.register(cors, {
  origin: '*',
  methods: ['GET'],
  credentials: true,
});

app.register(pongGame);

const start = async () => {
  try {
    await app.listen({
      port: 9001,
      host: '0.0.0.0',
    });
  } catch (err) {
    app.log.error(err);
    Process.exit(1);
  }
};

start();
