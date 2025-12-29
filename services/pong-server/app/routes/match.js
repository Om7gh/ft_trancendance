function matchHandler(socket, req) {
    const uid       = req.user.id;
    const rid       = req.query.rid;
    const room      = this.roomList.get(rid);

    if (!room || !room.isPlayer(uid) || room.isDone()) {
        socket.send(JSON.stringify({
            state: "!ok",
            reason: "Currently you don't have any match to join!!",
        }));

        socket.close();
        return ;
    }
    room.setPlayerSocket(uid, socket);
}

export default async function match(fastify, options) {
    fastify.route({
        url: '/pongGame/remote/match',
        method: 'GET',
        websocket: true,
        handler: matchHandler,
    })
}