export default async function health(fastify, options) {
    instance.get('/health', async (request, reply) => {
        return { status: 'ok' };
    });
}