export default function fakeFriends(fastify, options, done) {
    fastify.decorate("friendList", new Array());

    fastify.friendList.push({id: "f0518f3321b8820a836ace90d2125a12", username: 'bramzil1', avatar: 'https://avatar.iran.liara.run/public'});
    fastify.friendList.push({id: 22222, username: 'omghazi', avatar: 'https://avatar.iran.liara.run/public'});
    fastify.friendList.push({id: 33333, username: 'alafdili', avatar: 'https://avatar.iran.liara.run/public'});
    fastify.friendList.push({id: 44444, username: 'mohimi', avatar: 'https://avatar.iran.liara.run/public'});
    fastify.friendList.push({id: 55555, username: 'aateika', avatar: 'https://avatar.iran.liara.run/public'});
    fastify.friendList.push({id: 66666, username: 'hmad', avatar: 'https://avatar.iran.liara.run/public'});
    fastify.friendList.push({id: 77777, username: 'said', avatar: 'https://avatar.iran.liara.run/public'});
    fastify.friendList.push({id: 88888, username: 'moha', avatar: 'https://avatar.iran.liara.run/public'});

    fastify.route({
        url: '/friends/list',
        method: 'GET',
        handler: async function friendsHandler(request, reply) {
            reply.send(JSON.stringify(this.friendList));
        }
    })
    done()
}
