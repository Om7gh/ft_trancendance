import amqplib        from 'amqplib';
import { v4 as uuid } from 'uuid';
import fp             from 'fastify-plugin'

/* plugin options type object with properties:
    - serverUrl     : an amqp url to server type string;
    - queue         : object with properties:
      . name    : queue name type string.
      . options : queue options type object.
    - asyncHandler  : an asynchronous function for handle consumed messages
      with signature "async function asyncHandler(content)".

  this plugin will decorate fastify instance with sendToQueue function
  with signature "async function sendToQueue(destination, message, timeout)":
      - destination : expects the queue name (string) of the destination sevice.
      - message     : (object) with the following properties
        . content   : for the message payload.
        . properties: (object) for message properties.
        . rpc       : (boolean) indicate either the sender wait for response or not.
      - timeout     : a number in milliseconds after which message must consedired expired.
    return a promise that will be:
      if (message sent successfully)
        - resolved with true if the sen message property rpc is false.
        - resolved with reply content, if the sent message property rpc is true, and
          other service replyed before message expire.
        - reject with timeout if the other service did not reply before the message expire.
      else
        reject with false.
*/      

export default fp(async function rabbitMQPlugin(fastify, options) {

  const { serverUrl, queue, asyncHandler } = options;
  
  const TIMEOUT_CHECK_INTERVAL = 1500;
  const pendingRequests = new Map();
  const rabbitConfig    = { connection: null, channel: null};

  async function consumeServiceQueue() {
    if (rabbitConfig.channel && queue.name) {
      rabbitConfig.channel.consume(
        queue.name,
        async (msg) => {
          if (msg) {
            const correlationId = msg.properties.correlationId;
            const request       = pendingRequests.get(correlationId);

            try {
              const content = JSON.parse(msg.content.toString());

              if (request) {
                request.resolve(content);
                pendingRequests.delete(correlationId);
              } else {
                const answer  = await asyncHandler(content);
                const replyTo = msg.properties.replyTo;

                if (replyTo && (replyTo !== queue.name)) {
                  rabbitConfig.channel.sendToQueue(
                    replyTo,
                    Buffer.from(JSON.stringify(answer)),
                    msg.properties
                  );
                }
              }
            } catch (err) {
              if (request)
                request.reject(err);
              else
                console.log(err);
            }
          }
        },
        { noAck: false }
      );
    }
    console.log(`Started consuming internal reply queue: ${queue.name}`);
  }

  fastify.addHook('onReady', async () => {
    try {
      rabbitConfig.connection = await amqplib.connect(serverUrl);
      rabbitConfig.channel    = await rabbitConfig.connection.createChannel();
                                await rabbitConfig.channel.assertQueue(queue.name, queue.options);

      console.log(`Connected to RabbitMQ. Internal reply queue: ${queue.name}`);
      await consumeServiceQueue();
    } catch (err) {
      fastify.log.error(`RabbitMQ connection failed: ${err.message}`);
      throw err;
    }
  });

  function registerRequest(correlationId, resolve, reject, timeoutMs) {
    pendingRequests.set(correlationId, {
      resolve,
      reject,
      expiresAt: Date.now() + timeoutMs,
    });
  }

  fastify.decorate('rabbitMQ', {
    async sendToQueue(to_queue, message, timeoutMs = 60000) {
      let sendOptions       = null;
      const correlationId   = uuid();
      const { rpc = false } = message;

      if (!rabbitConfig.channel) {
        throw new Error('Invalid channel. RabbitMQ not ready.');
      }

      if (rpc) {
        sendOptions = {
          correlationId,
          replyTo: queue.name,
          ...message.properties,
        };
      } else {
        sendOptions = message.properties;
      }

      const state = rabbitConfig.channel.sendToQueue(
        to_queue,
        Buffer.from(JSON.stringify(message.content)),
        sendOptions,
      );

      if (!state || !rpc) {
        return Promise.resolve(state);
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
});