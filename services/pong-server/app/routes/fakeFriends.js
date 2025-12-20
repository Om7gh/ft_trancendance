export default function fakeFriends(fastify, options, done) {
    fastify.decorate("friendList", new Array());

    fastify.friendList.push({id: 11111, username: 'bramzil1', avatar: 'https://avatar.iran.liara.run/public'});
    fastify.friendList.push({id: 22222, username: 'bramzil2', avatar: 'https://avatar.iran.liara.run/public'});
    fastify.friendList.push({id: 33333, username: 'bramzil3', avatar: 'https://avatar.iran.liara.run/public'});
    fastify.friendList.push({id: 44444, username: 'bramzil4', avatar: 'https://avatar.iran.liara.run/public'});
    fastify.friendList.push({id: 55555, username: 'bramzil5', avatar: 'https://avatar.iran.liara.run/public'});
    fastify.friendList.push({id: 66666, username: 'bramzil6', avatar: 'https://avatar.iran.liara.run/public'});
    fastify.friendList.push({id: 77777, username: 'bramzil7', avatar: 'https://avatar.iran.liara.run/public'});
    fastify.friendList.push({id: 88888, username: 'bramzil8', avatar: 'https://avatar.iran.liara.run/public'});

    fastify.route({
        url: '/friends/list',
        method: 'GET',
        handler: async function friendsHandler(request, reply) {
            reply.send(JSON.stringify(this.friendList));
        }
    })
}