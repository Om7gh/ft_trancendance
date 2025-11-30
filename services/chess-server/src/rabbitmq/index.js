const uuid = require('uuid').v4;

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

const rpcQueue = async function (app) {
    const connection = connectWithRetry('amqp://rabbitmq');
    const channel = await connection.createChannel();

    await channel.assertQueue('chess_requests', { durable: true });
    channel.prefetch(1);

    console.log('Identity service waiting for RPC requests...');

    try {
        const sendRequest = async (msg) => {
            const correlationId = uuid();
            channel.sendToQueue(
                'chess_requests',
                Buffer.from(JSON.stringify(correlationId, msg))
            );
        };

        app.decorate('sendRequest', sendRequest);
        app.addHook('onClose', async () => {
            await channel.close();
            await connection.close();
        });

        process.on('SIGINT', async () => {
            await channel.close();
            await connection.close();
            process.exit(0);
        });
    } catch (e) {
        throw e;
    }
};
