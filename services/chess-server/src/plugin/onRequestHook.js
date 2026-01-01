const fp = require('fastify-plugin');

module.exports = fp(async function onRequestHook(fastify) {
    fastify.addHook('onRequest', async function (request, reply) {
        const cookie = request.headers.cookie;

        if (!cookie) {
            return reply.code(401).send('No cookie');
        }

        try {
            const res = await fetch('http://identity:4000/auth/userinfo', {
                method: 'GET',
                headers: {
                    cookie,
                },
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                return reply.code(401).send(text || 'Refresh your access token');
            }

            const user = await res.json().catch(() => null);

            if (!user || typeof user !== 'object' || !user.id) {
                return reply.code(401).send('Invalid session');
            }

            request.user = user;
        } catch (err) {
            request.log?.error({ err }, 'Failed to validate user via identity');
            return reply.code(401).send('Refresh your access token');
        }
    });
});
