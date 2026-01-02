const fastify = require('fastify');
const env = require('dotenv');
const chessRoutes = require('./routes/chess.routes');
const chessDb = require('./database');
const opt = {
  logger: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
    },
  },
};

env.configDotenv();
const app = fastify(opt);
app.register(chessDb);
app.register(require('@fastify/websocket'));
app.register(chessRoutes);

app.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error }, 'Unhandled error');

  if (error.isOperational) {
    return reply.status(error.statusCode).send({
      status: error.status,
      message: error.message,
    });
  }

  const statusCode = error.statusCode || 500;
  return reply.status(statusCode).send({
    status: 'error',
    message: error.message || 'Internal Server Error',
  });
})

const start = async () => {
  try {
    await app.ready();
    const port = Number(process.env.PORT) || 9000;
    const host = process.env.HOST || '0.0.0.0';
    const addr = await app.listen({ port, host });
    app.log.info(`🚀 Server is running on ${addr}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

module.exports = app;
