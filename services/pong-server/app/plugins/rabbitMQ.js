import amqplib from 'amqplib';
import { v4 as uuid } from 'uuid';

async function rabbitMQPlugin(fastify, options) {
  const { connectionUrl, queue } = options;

  let connection, channel;

  fastify.addHook('onReady', async () => {
    try {
      connection  = await amqp.connect(connectionUrl);
      channel     = await connection.createChannel();
                    await channel.assertQueue(queue, { durable: true });
      console.log(`Connected to RabbitMQ and listening on ${queue}`);
    } catch (err) {
      fastify.log.error(`Connection to RabbitMQ fail with this erro: ${err}`);
    }
  });

  fastify.decorate('rabbitMQ', {
    async sendToQueue(queue, message) {
      correlation = uuid();
      if (channel) {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
          persistent  : true,
          replyTo     : 'pong_queue',
          correlation : correlation,
        });
        console.log(`Message sent to ${queue}`);
      }
    },

    async consumeQueue(queue, callback) {
      if (channel) {
        channel.consume(queue, (msg) => {
          if (msg) {
            const message = JSON.parse(msg.content.toString());
            callback(message);
            channel.ack(msg);
          }
        });
        console.log(`Started consuming from ${queue}`);
      }
    },
  });

  fastify.addHook('onClose', async (instance) => {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
  });
}

module.exports = rabbitMQPlugin;
