const amqp = require('amqplib');
const fp = require('fastify-plugin');
const uuid = require('uuid').v4;
const RABBIT_URL = 'amqp://rabbitmq';
const CHESS_QUEUE = 'chess.reply';

async function connectWithRetry(url, retries = 10, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await amqp.connect(url);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

async function setupRabbit(fastify) {
  const connection = await connectWithRetry(RABBIT_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(CHESS_QUEUE, { durable: true });
  channel.prefetch(1);
  let correlationId = null;

  // chess -> identity : IDENTITY.REQUEST

  async function consume(handler) {
    await channel.consume(CHESS_QUEUE, async (msg) => {
      if (!msg) return;
      if (msg.properties.correlationId !== correlationId)
          return ;
      try {
        const content = JSON.parse(msg.content.toString());
        await handler(content, msg);
        channel.ack(msg);
      } catch (err) {
        fastify.log.error(err);
        channel.nack(msg, false, false);
      }
    });
  }

  function produce(queue, payload) {
    correlationId = uuid();
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
      correlationId,
      replyTo: CHESS_QUEUE,
    });
  }

  fastify.decorate('mq', {
    consume,
    produce,
  });

  fastify.addHook('onClose', async () => {
    await channel.close();
    await connection.close();
  });
}

module.exports = fp(setupRabbit);
