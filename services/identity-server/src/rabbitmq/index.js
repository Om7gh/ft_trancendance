const mq = require('amqplib');
const fp = require('fastify-plugin');

async function connectWithRetry(url, maxRetries = 10, delay = 5000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(
                `Attempting to connect to RabbitMQ (attempt ${
                    i + 1
                }/${maxRetries})...`
            );
            const connection = await mq.connect(url);
            console.log('Successfully connected to RabbitMQ');
            return connection;
        } catch (error) {
            console.error(`Failed to connect to RabbitMQ: ${error.message}`);
            if (i < maxRetries - 1) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                throw new Error(
                    'Max retries reached. Could not connect to RabbitMQ'
                );
            }
        }
    }
}

async function startIdentityConsumer(app) {
    try {
        const connection = await connectWithRetry('amqp://rabbitmq');
        const channel = await connection.createChannel();

        await channel.assertQueue('identity_requests', { durable: true });
        channel.prefetch(1);

        console.log('Identity service waiting for RPC requests...');

        channel.consume('identity_requests', async (msg) => {
            if (msg !== null) {
                try {
                    const request = JSON.parse(msg.content.toString());
                    const { action, payload } = request;

                    let response = null;

                    switch (action) {
                        // here we listen for event msg and generate response for it
                        default:
                            response = { error: 'Unknown action' };
                    }

                    channel.sendToQueue(
                        msg.properties.replyTo,
                        Buffer.from(JSON.stringify(response)),
                        {
                            correlationId: msg.properties.correlationId,
                        }
                    );

                    channel.ack(msg);
                } catch (error) {
                    console.error('Error processing request:', error);
                    channel.sendToQueue(
                        msg.properties.replyTo,
                        Buffer.from(
                            JSON.stringify({
                                error: error.message,
                            })
                        ),
                        {
                            correlationId: msg.properties.correlationId,
                        }
                    );
                    channel.ack(msg);
                }
            }
        });

        app.addHook('onClose', async () => {
            await channel.close();
            await connection.close();
        });

        process.on('SIGINT', async () => {
            await channel.close();
            await connection.close();
            process.exit(0);
        });
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
        process.exit(1);
    }
}

module.exports = fp(startIdentityConsumer);
