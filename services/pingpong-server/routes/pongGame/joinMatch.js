function joinMatchHandler(socket, req) {
    const uid       = req.query.uid;
    const rid       = req.query.rid;
    const room      = this.getRoomById(rid);
    const player    = this.getPlayerById(uid);

    if (!player || !room || !room.ready() || !room.player(uid)) {
        socket.send(JSON.stringify({
            state: "!ok",
            reason: "Currently you don't have any match to join!!"
        }));
        socket.close();
        return ;
    }

    room.setPlayerSocket(uid, socket);

    room.startMatch();

    socket.on('message', (message) => {
        let action = JSON.parse(message);

        if (action && action.move) {
            if (action.move === "up")
                player.paddle.moveUp();
            else if (action.move === "down")
                player.paddle.moveDown();
        }
    });

    socket.on('close', (code, raison) => {
        this.log.info("socket closed", code, raison);
        room.setPlayerSocket(uid, null);
    });

    socket.on('error', (err) => {
        this.log.error(err);
    });
}

export function joinMatch(fastify, options, done) {
    fastify.route({
        url: '/pongGame/remote/join',
        method: 'GET',
        websocket: true,
        handler: joinMatchHandler,
    })
    
    done();
}