import amqp from 'amqplib';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

const RABBIT_URL = 'amqp://rabbitmq';
const IDENTITY_QUEUE = 'identity.requests';

declare module 'fastify' {
  interface FastifyInstance {
    mq: any;
  }
}

async function connectWithRetry(url: string, retries = 10, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await amqp.connect(url);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

async function setupRabbit(fastify: FastifyInstance) {
  const connection = await connectWithRetry(RABBIT_URL);
  const channel = await connection?.createChannel();

  await channel?.assertQueue(IDENTITY_QUEUE, { durable: true });
  channel?.prefetch(1);

  // chess -> identity : IDENTITY.REQUEST
  async function consume(handler: (h: any, msg: any) => void) {
    await channel?.consume(IDENTITY_QUEUE, async (msg: any) => {
      if (!msg) return;
      try {
        const content = JSON.parse(msg.content.toString());
        console.log(content, msg);
        await handler(content, msg);
        channel.ack(msg);
      } catch (err) {
        fastify.log.error(err);
        channel.nack(msg, false, false);
      }
    });
  }

  function produce(queue: string, payload: any, correlationId: string) {
    channel?.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
      correlationId,
      replyTo: IDENTITY_QUEUE,
    });
  }

  fastify.decorate('mq', {
    consume,
    produce,
  });

  fastify.addHook('onClose', async () => {
    await channel?.close();
    await connection?.close();
  });
}

export default fp(setupRabbit);
