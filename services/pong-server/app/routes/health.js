export default async function health(fastify) {
    fastify.get('/health', async (request, reply) => {
        return { status: 'ok' };
    });
}