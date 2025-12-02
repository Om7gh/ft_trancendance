import fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { pongGame } from './routes/pongGame/pongGame.js';
import { notification } from './routes/notification/notification.js';

const app = fastify({
  logger: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
    },
  },
});

app.register(websocket);
app.register(cors, {
  origin: '*',
  methods: ['GET'],
  credentials: true,
});

app.decorate('notifications', new Map());

app.register(pongGame);
app.register(notification);

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
