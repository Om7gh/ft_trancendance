async function health(fastify) {
    fastify.route({
        url: '/health',
        method: 'GET',
        handler: async (request, reply) => {
            return { status: 'ok' };
        }
    })
}

export default health;
