
export class Paddle {
    
    constructor(x, y, table) {
        this.x                  = x;
        this.y                  = y;
        this.speed              = 5;
        this.width              = 10;
        this.height             = 80;
        this.color              = "black";
        this.table              = table;
    }

    isInside(x, y) {
        if (x && y) {
            if (((this.x - (this.width / 2)) < x) && (x < (this.x + (this.width / 2))) && 
                (this.y < y) && (y < (this.y + this.height)))
               return true;
        }
        return false;
    }

    moveUp() {
        this.y = (0 < (this.y - this.speed)) ?
            (this.y - this.speed) : 0;
        return this.y;
    }

    moveDown() {
        this.y = ((this.y + this.height + this.speed) < this.table.height) ?
            (this.y + this.speed) : (this.table.height - this.height);
        return this.y;
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        }
    }
}

export class Ball {

    constructor(x, y) {
        this.x              = x;
        this.y              = y;
        this.direction      = 1;
        this.speed          = 5;
        this.radius         = 15;
        this.angle          = 0;
        this.lastHit        = "";
        this.color          = "orange";
    }

    generateRandomAngle() {
        return (((Math.random() * (190 - 170)) + 170) + ((0 < this.direction) ?  180 : 0));
    }

    reset() {
        this.x = 350;
        this.y = 200;
        this.speed = 7;
        this.lastHit = "";
        this.direction *= -1;
        this.angle = this.generateRandomAngle();
    }

    setAngle(angle) {
        if (angle < 0)
            this.angle = 360 + angle;
        else
            this.angle = angle;
    }

     addEffect(paddleCenterY) {
        if ((this.y < paddleCenterY) && (90 < this.angle) && (this.angle < 270))
            this.setAngle(this.angle + 2);
        else if ((this.y < paddleCenterY) && (this.angle < 90) || (270 < this.angle))
            this.setAngle(this.angle - 2);
        else if ((paddleCenterY < this.y) && (90 < this.angle) && (this.angle < 270))
            this.setAngle(this.angle - 2);
        else if ((paddleCenterY < this.y) && (this.angle < 90) || (270 < this.angle))
            this.setAngle(this.angle + 2);
    }

    isHitPaddle(paddle) {
        let angle = 0;
        let paddleCenterY = paddle.y + (paddle.height / 2);

        while (angle < 360) {
            let x = this.x + this.radius * Math.cos(angle * (Math.PI / 180));
            let y = this.y + this.radius * Math.sin(angle * (Math.PI / 180));

            if (paddle.isInside(x, y)) {
                if ((paddle.height / 4) < Math.abs(paddleCenterY - y))
                    this.addEffect(paddleCenterY);
                return true;
            }
            angle += 15;
        }
        return false;
    }
    
    getNextPosition(table, left_paddle, right_paddle) {
        if (((this.y - this.radius) <= 0) || (table.height <= (this.y + this.radius))) {
            this.setAngle(360 - this.angle);
            this.lastHit = "topOrBottom";
        } else if ((this.lastHit !== "right_paddle") && this.isHitPaddle(right_paddle)) {
            this.setAngle(180 - this.angle);
            this.lastHit = "right_paddle";
            this.speed += (this.speed < 15) ? 0.25 : 0;
        } else if ((this.lastHit !== "left_paddle") && this.isHitPaddle(left_paddle)) {
            this.setAngle(180 - this.angle);
            this.lastHit = "left_paddle";
            this.speed += (this.speed < 10) ? 0.25 : 0;
        }
        this.x += this.speed * Math.cos(this.angle * (Math.PI / 180))
        this.y += this.speed * Math.sin(this.angle * (Math.PI / 180))
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            radius: this.radius,
        }
    }
}

export class Player {
    constructor(id, socket) {
        this.id         = id;
        this.paddle     = null;
        this.rooms      = [];
    }

    inMatch() {
        if ((this.rooms.length !== 0) && this.socket)
            return (true);
        return (false);
    }

    inSameRoom(playerId) {
        for (let room of this.rooms) {
            if (room.isPlayer(playerId))
                return (true); 
        }
        return (false);
    }

    addRoom(room) {
        if (this.rooms.find((id) => id === room.id)) {
            this.rooms.push(room);
        }
    }

    roomsCleaner() {
        this.rooms = this.rooms.filter((room) => room.state !== "done");
    }
}

export class Room {
    constructor(id) {
        this.id             = id;
        this.intervalId     = null;
        this.state          = "waiting";

        this.ball           = new Ball(350, 200);
        this.table          = {width: 700, height: 400,};

        this.leftPlayer     = null;
        this.leftSocket     = null;
        this.leftPoints      = 0;
        this.leftPaddle     = new Paddle(20, 160, this.table);
        
        this.rightPlayer    = null;
        this.rightSocket    = null;
        this.rightPoints      = 0;
        this.rightPaddle    = new Paddle(680, 160, this.table);

        if (!this.ball || !this.leftPaddle || !this.rightPaddle) {
            throw new Error("Fail to instantiate room objects!!");
        }

    }

    ready() {
        return (this.leftPlayer && this.rightPlayer);
    }
    
    waitingForPlayer() {
        if (!this.leftPlayer || this.leftPlayer)
            return (true);
        return (false);
    }

    player(playerId) {
        if (this.leftPlayer && (this.leftPlayer.id === playerId))
            return (true);
        else if (this.rightPlayer && (this.rightPlayer.id === playerId))
            return (true);
        return (false);
    }

    addLeftPlayer(player) {
        this.leftPlayer = player;
        this.leftPlayer.paddle = this.leftPaddle;
    }

    addRightPlayer(player) {
        this.rightPlayer = player;
        this.rightPlayer.paddle = this.rightPaddle;
    }

    addPlayer(player) {
        if (this.waitingForPlayer()) {
            if (!this.leftPlayer) {
                this.addLeftPlayer(player);
                return (true);
            } else if (!this.rightPlayer && !this.player(player.id)) {
                this.addRightPlayer(player);
                this.startMatch();
                return (true);
            }
        }
        return (false);
    }

    getOpponentId(playerId) {
        if (this.ready()) {
            if (this.leftPlayer.id === playerId)
                return (this.rightPlayer.id);
            else if (this.rightPlayer.id === playerId)
                return (this.leftPlayer.id);
        }
        return (null);
    }

    setPlayerSocket(playerId, socket) {
        if (this.leftPlayer.id === playerId) {
            this.leftSocket = socket;
            if (!this.leftSocket && !this.rightPlayer) {
                this.state = "done";
            }
        } else if (this.rightPlayer.id === playerId) {
            this.rightSocket = socket;
        }
    }

    broadcastMessage(message) {
        if (this.leftPlayer && this.leftSocket) {
            this.leftSocket.send(message);
        }
        if (this.rightPlayer && this.rightSocket) {
            this.rightSocket.send(message);
        }
    }

    generateView() {
        return (JSON.stringify({
            state: "ok",
            data: {
                event: "updateView",
                ball: this.ball.toJSON(),
                leftPaddle: this.leftPaddle.toJSON(),
                rightPaddle: this.rightPaddle.toJSON(),
            }
        }))
    }

    updateScore() {
        if (this.ball.x < 0)
            this.rightPoints += 1;
        else if (this.table.width < this.ball.x)
            this.leftPoints += 1;
    }

    generateScore() {
        return (JSON.stringify({
            state: "ok",
            data: {
                event: "updateScore",
                leftPlayer: this.leftPoints,
                rightPlayer: this.rightPoints,
            }
        }))
    }

    generateMatchStart() {
        return (JSON.stringify({
            state: "ok", 
            data: {
                event: "startMatch",
            }
        }))
    }

    startMatch() {
        if (this.state === "waiting") {
            if ((this.leftPlayer && this.leftSocket) && 
                (this.rightPlayer && this.rightSocket)) {
                this.state = "going";
                this.broadcastMessage(this.generateMatchStart());
                this.matchLoop();
            }
        }
    }

    matchLoop() {
        this.intervalId = setInterval(() => {
            if ((this.ball.x < 0) || (this.table.width < this.ball.x)) {
                this.updateScore()
                this.broadcastMessage(this.generateScore());
                if ((6 < this.leftPoints) || (6 < this.rightPoints)) {
                    this.stopMatch();
                }
                this.ball.reset();
            } else if (!this.leftSocket && !this.rightSocket) {
                this.stopMatch();
            }
            this.ball.getNextPosition(this.table, this.leftPaddle, this.rightPaddle);
            this.broadcastMessage(this.generateView());
        }, 30);
    }

    generateMatchEnd() {
        return (JSON.stringify({
            state: "ok",
            data: {
                event: "done",
            }
        }));
    }
    
    stopMatch() {
        this.state = "done";

        if (this.intervalId) {
            this.broadcastMessage(this.generateMatchEnd());
            clearInterval(this.intervalId);
        }

        if (this.leftPlayer) {
            if (this.leftSocket) {
                this.leftSocket.close();
            }
        }

        if (this.rightPlayer) {
            if (this.rightSocket) {
                this.rightSocket.close();
            }
        }
    }
}

export class Invitation {
    constructor(id, sender, receiver, room) {
        this.id         = id;
        this.sender     = sender;
        this.receiver   = receiver;
        this.room       = room;
        this.sendTime   = Math.floor(Date.now() / 1000);
    }

    invited(id) {
        if (this.receiver === id)
            return true;
        return false;
    }

    expired() {
        if (60 < ((Math.floor(Date.now() / 1000)) - this.time))
            return (true);
        return (false);
    }
}