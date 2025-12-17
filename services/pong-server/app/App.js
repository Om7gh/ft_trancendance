import fastify            from 'fastify';
import cors               from '@fastify/cors';
import websocket          from '@fastify/websocket';
import cookie             from '@fastify/cookie';
import axios              from 'fastify-axios'

import { pongGame }       from './routes/pongGame.js';
import rabbitMQPlugin     from './plugins/rabbitMQ.js';

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

async function handler (content) {
  console.log(`pong service receive this message from rabbit mq: ${content}`);
  return ("Hello form pong game");
}

app.register(rabbitMQPlugin, {
  serverUrl     : 'amqp://rabbitmq',
  queue         : {
    name    : 'PONG_QUEUE',
    options : {
      durable     : true,
      exclusive   : true,
    }
  },
  asyncHandler  : handler,
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
    process.exit(1);
  }
};

start();
