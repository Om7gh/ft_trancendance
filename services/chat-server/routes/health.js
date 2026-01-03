import fp from 'fastify-plugin';

function healthRoute(instance) {
	instance.get('/health', async (request, reply) => {
		return { status: 'ok' };
	});
}

export default fp(healthRoute);
