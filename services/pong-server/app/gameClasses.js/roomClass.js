import { v4 as uuid } from "uuid";
import { EventEmitter } from 'events';

import Ball from "./ballClass.js";
import Player from "./playerClass.js";

export default class Room extends EventEmitter {

    constructor() {
        super();

        this.id             = uuid();
        this.state          = "waiting";
        this.winner         = null;
        this.date           = Math.floor(Date.now() / 1000);

        this.playingId      = null;
        this.waitingId      = null;
        this.pausingId      = null;

        this.ball           = new Ball(350, 200);
        this.table          = {width: 700, height: 400,};
        this.leftPlayer     = null;
        this.rightPlayer    = null;
    }

    getState() {
        return (this.state);
    }

    isPlayer(playerId) {
        if (this.leftPlayer && (this.leftPlayer.id === playerId))
            return (true);
        else if (this.rightPlayer && (this.rightPlayer.id === playerId))
            return (true);
        return (false);
    }

    addLeftPlayer(user) {
        this.leftPlayer = new Player(user, this.table);
        this.leftPlayer.setPaddleX(20);
        this.leftPlayer.on("leaveMatch", () => {
            this.rightPlayer.setPoints(7);
            this.stopMatch();
        });
        this.leftPlayer.on("socketClosed", () => {
            this.pause(this.leftPlayer.id);
        })
    }
    
    addRightPlayer(user) {
        this.rightPlayer = new Player(user, this.table);
        this.rightPlayer.setPaddleX(this.table.width - 20);
        this.rightPlayer.on("leaveMatch", () => {
            this.leftPlayer.setPoints(7);
            this.stopMatch();
        });
        this.rightPlayer.on("socketClosed", () => {
            this.pause(this.rightPlayer.id);
        })
        this.state = "ready";
    }

    addPlayer(user) {
        if ((this.state === "waiting") && user) {
            if (!this.leftPlayer || (this.leftPlayer.id === user.id)) {
                if (!this.leftPlayer) {
                    this.addLeftPlayer(user);
                }
                return (true);
            } else if ((!this.rightPlayer && !this.isPlayer(user.id)) || (this.rightPlayer.id === user.id)) {
                if (!this.rightPlayer) {
                    this.addRightPlayer(user);
                }
                return (true);
            }
        }
        return (false);
    }

    setPlayerSocket(playerId, socket) {
        if (this.leftPlayer && (this.leftPlayer.id === playerId)) {
            this.leftPlayer.setSocket(socket);
        } else if (this.rightPlayer && (this.rightPlayer.id === playerId)) {
            this.rightPlayer.setSocket(socket);
        }

        if ((this.state === "ready") && (this.leftPlayer.isJoind() && this.rightPlayer.isJoind())) {
            this.startMatch();
        } else if (this.state === "pause") {
            this.continue(playerId);
        }
    }
    
    updateScore() {
        if (this.ball.x < 0) {
            this.rightPlayer.incrementPoints();
        } else if (this.table.width < this.ball.x) {
            this.leftPlayer.incrementPoints();
        }
    }
    
    broadcastMessage(message) {
        if (this.leftPlayer) {
            this.leftPlayer.sendMessage(message);
        }
        if (this.rightPlayer) {
            this.rightPlayer.sendMessage(message);
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
        this.waitingId = setTimeout(() => {
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

    startMatch() {
        if ((this.state === "waiting") && this.ready()) {
            clearTimeout(this.waitingId);
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
            this.playingId = setInterval(() => {
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
            clearTimeout(this.pausingId);
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
            clearInterval(this.playingId);
            this.state = "pause";
            this.broadcastMatchState()
            this.pausingId = setTimeout(() => {
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
        if (this.leftPlayer.points < this.rightPlayer.points) {
            this.winner = this.rightPlayer;
        } else if (this.leftPlayer.points > this.rightPlayer.points) {
            this.winner = this.leftPlayer;
        }
    }

    getWinner() {
        return (this.winner);
    }
    
    stopMatch() {
        this.setWinner();
        this.state = "done";

        if (this.playingId) {
            this.broadcastScore();
            this.broadcastMatchState();
            clearInterval(this.playingId);
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
            winner          : this.winner,
        })
    }
}