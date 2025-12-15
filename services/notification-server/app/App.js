import fastify          from 'fastify';
import cors             from '@fastify/cors';
import axios            from 'fastify-axios';
import cookie           from '@fastify/cookie';

import notification     from './routes/notification.js';

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

app.register(cors, {
  origin: '*',
  methods: ['GET'],
  credentials: true,
});

app.register(notification);

const start = async () => {
  try {
    await app.listen({
      port: 9005,
      host: '0.0.0.0',
    });
  } catch (err) {
    app.log.error(err);
    Process.exit(1);
  }
};

start();
