import fastify from 'fastify';
import cookie from '@fastify/cookie';
import axios from 'fastify-axios';
import corsPlugin from './plugins/corsPlugin.js';
import notification from './routes/notification.js';
import validateUser from './plugins/validateUser.js';
import dataBase from './plugins/database.js';

const app = fastify({
  logger: {level: 'debug',transport: {target: 'pino-pretty',},},
});

app.register(axios);

app.register(cookie);
app.register(corsPlugin);
app.register(validateUser);
app.register(dataBase, {
  dpPath: "/var/local/notification"
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
