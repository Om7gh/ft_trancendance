import { v4 as uuid } from 'uuid';
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

export class Player extends EventEmitter {

    constructor(user, socket) {
        super();

        this.id         = user.id;
        this.name       = user.first_name;
        this.avatar     = user.avatar;
        this.paddle     = null;
        this.room       = null;
        this.tournament = null;
    }

    inMatch() {
        if (this.room)
            return (true);
        return (false);
    }

    inTournament() {
        if (this.tournament)
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

    getRoom() {
        return (this.room);
    }

    leaveRoom() {
        this.room = null;
        this.emit("leaveRoom");
    }

    addTournament(tournament) {
        this.tournament = tournament;
    }

    getTournament() {
        return (this.tournament);
    }

    leaveTournament() {
        this.tournament = null;
        this.emit("leaveTournament");
    }

    toJSON() {
        return ({
            id      : this.id,
            name    : this.name,
            avatar  : this.avatar,
        });
    }
}

export class Room extends EventEmitter {

    constructor() {
        super();

        this.id             = uuid();
        this.state          = "waiting";
        this.winner         = null;
        this.date           = Math.floor(Date.now() / 1000);

        this.matchId        = null;
        this.waitId         = null;
        this.pauseId        = null;

        this.ball           = new Ball(350, 200);
        this.table          = {width: 700, height: 400,};

        this.leftPlayer     = null;
        this.leftSocket     = null;
        this.leftJoin       = false;
        this.leftPoints     = 0;
        this.leftPaddle     = new Paddle(20, 160, this.table);
        
        this.rightPlayer    = null;
        this.rightSocket    = null;
        this.rightJoin      = false;
        this.rightPoints    = 0;
        this.rightPaddle    = new Paddle(680, 160, this.table);
    }

    getState() {
        return (this.state);
    }

    ready() {
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
        this.leftPlayer.on("leaveRoom", () => {
            this.rightPoints = 7;
        });
    }
    
    addRightPlayer(player) {
        this.rightPlayer = player;
        this.rightPlayer.paddle = this.rightPaddle;
        this.rightPlayer.on("leaveRoom", () => {
            this.leftPoints = 7;
        });
    }

    addPlayer(player) {
        if (!this.ready() && player) {
            if (!this.leftPlayer || (this.leftPlayer.id === player.id)) {
                if (!this.leftPlayer) {
                    this.addLeftPlayer(player);
                }
                return (true);
            } else if ((!this.rightPlayer && !this.player(player.id)) || (this.rightPlayer.id === player.id)) {
                if (!this.rightPlayer) {
                    this.addRightPlayer(player);
                }
                return (true);
            }
        }
        return (false);
    }

    generateMatch() {
        return ({
            roomId: this.id,
            leftPlayer: {
                name: this.leftPlayer.name,
                avatar: this.leftPlayer.avatar,
            },
            rightPlayer: {
                name: this.rightPlayer.name,
                avatar: this.rightPlayer.avatar,
            }
        })
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
        if (this.leftPlayer && (this.leftPlayer.id === playerId)) {
            this.leftSocket     = socket;
            this.leftJoin       = true;
        } else if (this.leftPlayer && (this.rightPlayer.id === playerId)) {
            this.rightSocket    = socket;
            this.rightJoin       = true;
        }

        if (this.rightJoin && this.leftJoin) {
            this.startMatch();
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
                leftPlayer: this.leftPoints,
                rightPlayer: this.rightPoints,
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
                        value: "Wait for Opponent to join match too!!",
                    }
                }))
                this.stopMatch();
            }
        }, 15000);
    }

    startMatch() {
        if ((this.state === "waiting") && this.ready()) {
            clearTimeout(this.waitId);
            if (this.leftJoin && this.rightJoin) {
                this.state = "going";
                this.broadcastScore();
                this.broadcastMatchState();
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

    setWinner() {
        if (this.leftPoints < this.rightPoints) {
            this.winner = this.rightPlayer;
        } else if (this.leftPoints > this.rightPoints) {
            this.winner = this.leftPlayer;
        }
    }

    getWinner() {
        return (this.winner);
    }
    
    stopMatch() {
        this.setWinner();
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

    toJSON() {
        return ({
            state           : this.state,
            leftPlayer      : this.leftPlayer.toJSON(),
            rightPlayer     : this.rightPlayer.toJSON(),
            score           : {
                leftPlayer  : this.leftPoints,
                rightPlayer : this.rightPoints,
            },
            winner          : this.winner,
        })
    }
}

export class Invitation {

    constructor(type, sender, receiver, room) {
        this.id         = uuid();
        this.type       = type;
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

    getRoom() {
        return (this.room);
    }

    toJSON() {
        return ({
            id          : this.id,
            type        : this.type,
            sender      : this.sender,
            receiver    : this.receiver,
        })
    }
}

class TournamentRoom extends Room {
    constructor () {
        super();
    }

    setWinner() {
        if (this.rightPlayer) {
            this.winner = this.leftPlayer;
        } else if (!this.leftJoin && this.rightJoin) {
            this.winner = this.rightPlayer;
            this.rightPoints = 7;
        } else if (this.leftJoin && !this.rightJoin) {
            this.winner = this.leftPlayer;
            this.leftPoints = 7;
        } else if (this.leftPoints < this.rightPoints) {
            this.winner = this.rightPlayer;
        } else if (this.leftPoints > this.rightPoints) {
            this.winner = this.leftPlayer;
        }
    }
}

class Round extends EventEmitter {

    constructor() {
        this.id         = uuid();
        this.state      = "waiting";
        this.players    = null;
        this.rooms      = [];
        this.counter    = 0;
    }

    getState() {
        return (this.state);
    }

    setPlayers(players) {
        if (this.state === "waiting") {
            this.players = players;
        }
    }

    prepareRound() {
        if ((this.state === "waiting")) {
            for (let i = 0; i < this.players.length; i += 2) {
                const room = new TournamentRoom();
                room.on("done", () => {
                    this.counter++;
                    if (this.counter === this.rooms.length) {
                        this.state = "done";
                        this.emit("done");
                    }
                })
                this.rooms.push(room);
            }
            this.state === "ready";
        }
    }

    startRound() {
        let j = 0;

        this.prepareRound();
        for (let i = 0; i < this.players.length; i++) {
            this.rooms[j].addPlayer(this.players[i]);
            if (i % 2) {
                this.rooms[j].startMatch();
                j++;
            }
        }
        this.state = "going";
        return (null);
    }

    getWinners() {
        const winners = [];
        if (this.state === "done") {
            for (let i = 0; i < this.rooms.length; i++) {
                if (this.rooms[i].getState() === "done") {
                    winners.push(this.rooms[i].getWinner());
                }
            }
            return (winners);
        }
        return (null);
    }

    toJSON() {
        const rooms = [];

        for (let i = 0; i < this.rooms.length; i++) {
            rooms.push(this.rooms[i].toJSON());
        }
        return ({
            id      : this.id,
            state   : this.state,
            matchs  : rooms,
        })
    }

}

export class Tournament {

    constructor() {
        this.id             = uuid;
        this.state          = "waiting";

        this.currentRound   = null;
        this.winner         = null;

        this.players        = [];
        this.rounds         = [];
    }

    addPlayer(player) {
        if (this.state === "waiting") {
            this.players.push(player);
            if (this.players.length === 4) {
                this.state === "going";
            }
        }
    }

    removePlayer(playerId) {
        if (this.state === "waiting") {
            this.players = this.players.filter((item) => item.id !== playerId);
        }
    }

    startTournament() {
        if (this.state === "waiting") {
            if (this.players.length === 4) {
                this.currentRound = new Round();
                this.currentRound.setPlayers(this.players);
                this.currentRound.on("done", () => {
                    this.nextRound();
                });
                this.rounds.push(this.currentRound);
                this.currentRound.startRound();
            }
        }
        return (null);
    }

    nextRound() {
        const winners = this.currentRound.getWinners();

        if (1 < winners.length) {
            this.currentRound = new Round();
            this.currentRound.setPlayers(winners);
            this.currentRound.on("done", () => {
                this.nextRound();
            });
            this.rounds.push(this.currentRound);
            this.currentRound.startRound();
        } else {
            this.winner = winners[0];
            this.state === "done";
        }
    }
}


export class PongError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    toJSON() {
        return ({
            reason      : this.message,
            errorCod    : this.errorCode,
        })
    }
}