function joinMatchHandler(socket, req) {
    const uid       = req.user.id;
    const rid       = req.query.rid;
    const player    = this.getPlayerById(uid);
    const room      = player.getRoomById(rid);

    if (!player || !room || (room.full() && !room.player(uid))) {
        socket.send(JSON.stringify({
            state: "!ok",
            reason: "Currently you don't have any match to join!!"
        }));
        socket.close();
        return ;
    }

    room.setPlayerSocket(uid, socket);
    
    if (room.state === "pause") {
        room.continue(uid);
    } else
        room.startMatch();

    socket.on('message', (message) => {
        let event = JSON.parse(message);

        if (event) {
            if (event.type === "move") {
                if (event.data && event.data.move) {
                    if (event.data.move === "up")
                        player.paddle.moveUp();
                    else if (event.data.move === "down")
                        player.paddle.moveDown();
                }
            } else if (event.type === "leave") {
                if (event.data === true) {
                    room.playerLeave(uid);
                    room.stopMatch();
                }
            }
        }
    });

    socket.on('close', (code, raison) => {
        this.log.info("socket closed", code, raison);
        room.setPlayerSocket(uid, null);
        room.pause(uid);
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