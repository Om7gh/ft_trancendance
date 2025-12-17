import fastify          from 'fastify';
import cors             from '@fastify/cors';
import axios            from 'fastify-axios';
import cookie           from '@fastify/cookie';

import notification     from './routes/notification.js';
import rabbitMQPlugin   from './plugins/rabbitMQ.js';

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

async function handler(content) {
  console.log(`notification service receive this message from rabbit mq: ${content}`);
  return ("Hello form notifiaction");
}

app.register(rabbitMQPlugin, {
  serverUrl     : 'amqp://rabbitmq',
  queue         : {
    name    : 'NOTIFICATION_QUEUE',
    options : {
      durable     : true,
      exclusive   : true,
    }
  },
  asyncHandler  : handler,
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
    process.exit(1);
  }
};

start();
