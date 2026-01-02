import cookie from '@fastify/cookie';
import fastify from 'fastify';
import axios from 'fastify-axios';
import dataBase from './plugins/database.js';
import validateUser from './plugins/validateUser.js';
import notification from './routes/notification.js';

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
app.register(cookie);
app.register(validateUser);
app.register(dataBase, {
  dbPath: "/var/local/notification.db",
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
