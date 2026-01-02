function matchHandler(socket, req) {
    const uid       = req.user.id;
    const rid       = req.query.rid;
    const room      = this.roomList.get(rid);

    if (!room || !room.isPlayer(uid) || room.isDone()) {
        socket.send(JSON.stringify({
            state: "!ok",
            reason: "Currently you don't have any match to join!!",
        }));

        return socket.close();
    }

    if (room.tournament && !room.tournament.isMember(uid)) {
        socket.send(JSON.stringify({
            state: "!ok",
            reason: "User is not member of room's tournament!!",
        }));

        return socket.close();
    }

    if (!room.setPlayerSocket(uid, socket)) {
        socket.send(JSON.stringify({
            state: "!ok",
            reason: "you are already in match!!",
        }));

        return socket.close();
    }
}

export default async function match(fastify) {
    fastify.route({
        url: '/pongGame/remote/match',
        method: 'GET',
        websocket: true,
        handler: matchHandler,
    })
}