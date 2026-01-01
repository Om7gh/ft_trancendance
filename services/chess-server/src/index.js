const fastify = require('fastify');
const env = require('dotenv');
const chessRoutes = require('./routes/chess.routes');
const chessDb = require('./database');
const onRequestHook = require('./plugin/onRequestHook');
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
app.register(onRequestHook) 
app.register(chessRoutes);

app.setErrorHandler((error, request, reply) => {
    if (error.isOperational) {
        reply.status(error.statusCode).send({
            status: error.status,
            message: error.message,
        })
    } else {
        reply.status(400).send({
            status: 'error',
            message: 'bad Request!',
        })
    }
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
