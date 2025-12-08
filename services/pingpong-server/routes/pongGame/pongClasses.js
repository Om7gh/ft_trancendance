import { EventEmitter } from 'node:events'

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
        this.room       = null;
    }

    inMatch() {
        if (this.room)
            return (true);
        return (false);
    }

    inSameRoom(playerId) {
        if (this.room.player(playerId)) {
            return (true); 
        }
        return (false);
    }

    addRoom(room) {
        this.rooms = room
    }

    getRoomById(rid) {
        if (this.room.id === rid) {
            return (this.room);
        }

        return (null);
    }
}

export class Room extends EventEmitter {
    constructor(id) {
        super();

        this.id             = id;
        this.state          = "waiting";

        this.matchId        = null;
        this.waitId         = null;
        this.pauseId        = null;

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
    }

    full() {
        return (this.leftPlayer && this.rightPlayer);
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
        if (!this.full()) {
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

    playerLeave(playerId) {
        if (this.leftPlayer.id === playerId)
            this.rightPoints = 7;
        else if (this.rightPlayer.id === playerId)
            this.leftPoints = 7;
    }

    getOpponentId(playerId) {
        if (this.full()) {
            if (this.leftPlayer.id === playerId)
                return (this.rightPlayer.id);
            else if (this.rightPlayer.id === playerId)
                return (this.leftPlayer.id);
        }
        return (null);
    }

    setPlayerSocket(playerId, socket) {
        if (this.leftPlayer && (this.leftPlayer.id === playerId)) {
            this.leftSocket = socket;
        } else if (this.leftPlayer && (this.rightPlayer.id === playerId)) {
            this.rightSocket = socket;
        }
    }
    
    updateScore() {
        if (this.ball.x < 0)
            this.rightPoints += 1;
        else if (this.table.width < this.ball.x)
            this.leftPoints += 1;
    }
    
    broadcastMessage(message) {
        if (this.leftPlayer && this.leftSocket) {
            this.leftSocket.send(message);
        }
        if (this.rightPlayer && this.rightSocket) {
            this.rightSocket.send(message);
        }
    }

    broadcastScore() {
        this.updateScore();
        this.broadcastMessage(JSON.stringify({
            state: "ok",
            data: {
                event: "updateScore",
                leftPlayer: {id: this.leftPlayer.id,
                    name: "leftPlayer", imagePath: "", points: this.leftPoints,
                },
                rightPlayer: {id: this.rightPlayer.id,
                    name: "rightPlayer", imagePath: "", points: this.rightPoints,
                },
            }
        }));
    }

    broadcastView() {
        this.broadcastMessage(JSON.stringify({
            state: "ok",
            data: {
                event: "updateView",
                ball: this.ball.toJSON(),
                leftPaddle: this.leftPaddle.toJSON(),
                rightPaddle: this.rightPaddle.toJSON(),
            }
        }));
    }

    broadcastMatchState() {
        this.broadcastMessage(JSON.stringify({
            state: "ok", 
            data: {
                event: "matchState",
                value: this.state,
            }
        }));
    }

    waitOpponentToJoin() {
        this.waitId = setTimeout(() => {
            if (this.state === "waiting") {
                this.broadcastMessage(JSON.stringify({
                    state: "ok", 
                    data: {
                        event: "matchState",
                        value: "Wait for Opponent to join match too long try again!!",
                    }
                }))
                this.stopMatch();
            }
        }, 15000);
    }

    startMatch() {
        if (this.state === "waiting") {
            if ((this.leftPlayer && this.leftSocket) && (this.rightPlayer && this.rightSocket)) {
                clearTimeout(this.waitId);
                this.state = "going";
                this.broadcastScore();
                this.broadcastMatchState()
                this.matchLoop();
            } else {
                this.waitOpponentToJoin();
            }
        }
    }

    matchLoop() {
        if (this.state === "going") {
            this.matchId = setInterval(() => {
                if ((this.ball.x < 0) || (this.table.width < this.ball.x)) {
                    this.broadcastScore()
                    this.ball.reset();
                    if ((6 < this.leftPoints) || (6 < this.rightPoints)) {
                        this.broadcastView();
                        this.stopMatch();
                    }
                } else if (!this.leftSocket && !this.rightSocket) {
                    this.stopMatch();
                }
                this.ball.getNextPosition(this.table, this.leftPaddle, this.rightPaddle);
                this.broadcastView();
            }, 30);
        }
    }

    continue(playerId) {
        if ((this.state === "pause") && this.player(playerId)) {
            clearTimeout(this.pauseId);
            if (this.leftSocket && this.rightSocket) {
                this.state = "going";
                this.broadcastScore();
                this.broadcastMatchState()
                this.matchLoop();
            }
        }
    }

    pause(playerId) {
        if ((this.state === "going") && this.player(playerId)) {
            clearInterval(this.matchId);
            this.state = "pause";
            this.broadcastMatchState()
            this.pauseId = setTimeout(() => {
                if (this.state === "pause") {
                    if (this.leftPlayer.id === playerId)
                        this.rightPoints = 7;
                    else if (this.rightPlayer.id === playerId)
                        this.leftPoints = 7;
                    this.stopMatch();
                }
            }, 15000);
        }
    }
    
    stopMatch() {
        this.state = "done";

        if (this.matchId) {
            this.broadcastScore();
            this.broadcastMatchState();
            clearInterval(this.matchId);
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

        this.emit("done");
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