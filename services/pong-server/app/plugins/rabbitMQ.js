import amqplib from 'amqplib';
import { v4 as uuid } from 'uuid';

async function rabbitMQPlugin(fastify, options) {
  const { connectionUrl }       = options;
  const TIMEOUT_CHECK_INTERVAL  = 1500;

  const pendingRequests = new Map();
  const rabbitConfig    = { connection: null, channel: null, replyQueue: null };

  function registerRequest(correlationId, resolve, reject, timeoutMs) {
    pendingRequests.set(correlationId, {
      resolve,
      reject,
      expiresAt: Date.now() + timeoutMs,
    });
  }

  async function consumeReplyQueue() {
    if (!rabbitConfig.channel || !rabbitConfig.replyQueue)
      return;

    rabbitConfig.channel.consume(
      rabbitConfig.replyQueue,
      (msg) => {
        if (!msg)
          return;
        const correlationId = msg.properties.correlationId;
        const request       = pendingRequests.get(correlationId);
        if (request) {
          try {
            const content = JSON.parse(msg.content.toString());
            request.resolve(content);
          } catch (err) {
            request.reject(err);
          }
          pendingRequests.delete(correlationId);
        }
      },
      { noAck: true }
    );

    console.log(`Started consuming internal reply queue: ${rabbitConfig.replyQueue}`);
  }

  fastify.addHook('onReady', async () => {
    try {
      rabbitConfig.connection = await amqplib.connect(connectionUrl);
      rabbitConfig.channel    = await rabbitConfig.connection.createChannel();

      const { queue: replyQueue } = await rabbitConfig.channel.assertQueue('', {
        exclusive: true,
      });

      rabbitConfig.replyQueue = replyQueue;

      console.log(`Connected to RabbitMQ. Internal reply queue: ${replyQueue}`);
      await consumeReplyQueue();
    } catch (err) {
      fastify.log.error(`RabbitMQ connection failed: ${err.message}`);
      throw err;
    }
  });

  fastify.decorate('sendToQueue', {

    async sendToQueue(to_queue, message, messageProperties = {}, timeoutMs = 60000) {
      if (!rabbitConfig.channel) {
        throw new Error('Invalid channel. RabbitMQ not ready.');
      }

      const correlationId = uuid();

      const sendOptions = {
        correlationId,
        replyTo: rabbitConfig.replyQueue,
        persistent: true, 
      };

      const sent = rabbitConfig.channel.sendToQueue(
        to_queue,
        Buffer.from(JSON.stringify(message)),
        sendOptions
      );

      if (!sent) {
        return Promise.reject(new Error('Failed to send message, channel buffer full'));
      }

      return new Promise((resolve, reject) => {
        registerRequest(correlationId, resolve, reject, timeoutMs);
      });
    },
  });

  const sweeperIntervalId = setInterval(() => {
    const now = Date.now();
    for (const [id, req] of pendingRequests) {
      if (req.expiresAt <= now) {
        req.reject(new Error('Timeout: no response received'));
        pendingRequests.delete(id);
      }
    }
  }, TIMEOUT_CHECK_INTERVAL);

  fastify.addHook('onClose', async () => {
    clearInterval(sweeperIntervalId);

    for (const [, req] of pendingRequests) {
      req.reject(new Error('Connection closed'));
    }
    pendingRequests.clear();

    if (rabbitConfig.channel)
      await rabbitConfig.channel.close();
    if (rabbitConfig.connection)
      await rabbitConfig.connection.close();
  });
}

module.exports = rabbitMQPlugin;