import axios from 'axios';
import { v4 as uuid } from "uuid";
import { EventEmitter } from 'events';

import Ball from "./ballClass.js";
import Player from "./playerClass.js";

export default class GenericRoom extends EventEmitter {

    constructor() {
        super();

        this.id             = uuid();
        this.state          = "waiting";
        this.type           = "match";

        this.members        = [];
        this.counter        = 0;
        this.winner         = null;

        this.playingId      = null;
        this.waitingId      = null;
        this.pausingId      = null;

        this.ball           = new Ball(350, 200);
        this.table          = {width: 700, height: 400};
        this.leftPlayer     = null;
        this.rightPlayer    = null;
    }

    getState() {
        return (this.state);
    }

    addMember(user) {
        if ((this.state === "waiting") || (this.members.length < 2) || !this.isMember(user.id)) {
            this.members.push(user);
        }
    }

    isMember(userId) {
        for (let member of this.members) {
            if (member === userId) {
                return true;
            }
        }
        return false;
    }

    joinRoom(user) {
        if ((this.state === "waiting") && this.isMember(user.id)) {
            this.addPlayer(user);
            if (this.counter === 2) {
                this.startMatch();
            }
        }
    }

    isPlayer(playerId) {
        if (this.leftPlayer && (this.leftPlayer.id === playerId))
            return true;
        else if (this.rightPlayer && (this.rightPlayer.id === playerId))
            return true;
        return false;
    }

    addLeftPlayer(user) {
        this.leftPlayer = new Player(user, this.table);
        this.leftPlayer.setPaddleInTable("left");

        this.leftPlayer.on("leaveMatch", () => {
            this.rightPlayer.setPoints(7);
            this.stopMatch();
        });
        this.leftPlayer.on("socketClosed", () => {
            if (this.state === "pause")
                this.stopMatch();
            else
                this.pause(this.leftPlayer.id);
        })
    }
    
    addRightPlayer(user) {
        this.rightPlayer = new Player(user, this.table);
        this.rightPlayer.setPaddleInTable("right");

        this.rightPlayer.on("leaveMatch", () => {
            this.leftPlayer.setPoints(7);
            this.stopMatch();
        });
        this.rightPlayer.on("socketClosed", () => {
            if (this.state === "pause")
                this.stopMatch();
            else
                this.pause(this.rightPlayer.id);
        })
        this.state = "ready";
    }

    addPlayer(user) {
        if ((this.state === "waiting") && user) {
            if (!this.leftPlayer || (this.leftPlayer.id === user.id)) {
                this.addMember(user);
                if (!this.leftPlayer) {
                    this.addLeftPlayer(user);
                    this.counter += 1;
                }
                return (true);
            } else if ((!this.rightPlayer && !this.isPlayer(user.id)) || (this.rightPlayer.id === user.id)) {
                this.addMember(user);
                if (!this.rightPlayer) {
                    this.addRightPlayer(user);
                    this.counter += 1;
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

        if (this.state === "pause") {
            this.continue(playerId);
        } else if (this.leftPlayer.isJoind() && this.rightPlayer.isJoind()) {
            this.startMatch();
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
                leftPlayer: this.leftPlayer.getPoints(),
                rightPlayer: this.rightPlayer.getPoints(),
            }
        }));
    }

    broadcastView() {
        this.broadcastMessage(JSON.stringify({
            state: "ok",
            data: {
                event: "updateView",
                ball: this.ball.toJSON(),
                leftPaddle: this.leftPlayer.paddle.toJSON(),
                rightPaddle: this.rightPlayer.paddle.toJSON(),
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

    startMatch() {
        if (this.state === "ready") {
            clearTimeout(this.waitingId);
            if (this.leftPlayer.isJoind() && this.rightPlayer.isJoind()) {
                this.state = "going";
                this.broadcastMatchState();
                this.broadcastScore();
                this.matchLoop();
                return ;
            }
            this.waitOpponentToJoin();
        }
    }

    waitOpponentToJoin() {
        if (this.state === "ready") {
            this.waitingId = setTimeout(() => {
                this.broadcastMessage(JSON.stringify({
                    state: "ok", 
                    data: {
                        event: "matchState",
                        value: "Wait for Opponent to join match too long!!",
                    }
                }))
                this.stopMatch();
            }, 60000);
        }
    }

    async inviteMembers() {
        const invitations = [];
        if (this.state === "waiting") {
            try {
                for (let member of this.members) {
                    invitations.push({
                        id: uuid(),
                        type: "joinMatch",
                        sender: {id: this.id, username: "", avatar: ""},
                        receiver: {id: member},
                        expire: (Math.floor(Date.now() / 1000) + 60),
                    });
                }
                await axios.post("http://notification:9005/send", {
                    data: invitations,
                });
                this.waitMembersToJoin();
            } catch (error) {
                console.log(error);
                this.cancelMatch();
                this.emit("error");
            }
        }
    }

    waitMembersToJoin() {
        this.waitingId = setTimeout(() => {
            if (this.state === "waiting") {
                if (!this.leftPlayer && !this.rightPlayer) {
                    this.cancelMatch();
                    return ;
                }
                this.stopMatch();
            }
        }, 60000);
    }

    cancelMatch() {
        if (this.state === "waiting") {
            this.state = "canceled";
            this.emit("done");
        }
    }

    stopMatch() {
        this.state = "done";
        this.setWinner();

        if (this.playingId) {
            clearInterval(this.playingId);
            this.broadcastMatchState();
            this.broadcastScore();
        }

        if (this.leftPlayer) {
            this.leftPlayer.closeSocket();
        }

        if (this.rightPlayer) {
            this.rightPlayer.closeSocket();
        }

        this.emit("done");
    }

    matchLoop() {
        if (this.state === "going") {
            this.playingId = setInterval(() => {
                if ((this.ball.x < 0) || (this.table.width < this.ball.x)) {
                    this.broadcastScore()
                    this.ball.reset();
                    if ((6 < this.leftPlayer.getPoints()) || (6 < this.rightPlayer.getPoints())) {
                        this.broadcastView();
                        this.stopMatch();
                    }
                } else if (!this.leftPlayer.socket && !this.rightPlayer.socket) {
                    this.stopMatch();
                }
                this.ball.getNextPosition(this.table, this.leftPlayer.paddle, this.rightPlayer.paddle);
                this.broadcastView();
            }, 30);
        }
    }

    continue(playerId) {
        if ((this.state === "pause") && this.isPlayer(playerId)) {
            clearTimeout(this.pausingId);
            this.state = "going";
            this.broadcastScore();
            this.broadcastMatchState()
            this.matchLoop();
        }
    }

    pause(playerId) {
        if ((this.state === "going") && this.isPlayer(playerId)) {
            clearInterval(this.playingId);
            this.state = "pause";
            this.broadcastMatchState()
            this.pausingId = setTimeout(() => {
                if (this.state === "pause") {
                    if (this.leftPlayer.id === playerId)
                        this.rightPlayer.setPoints(7);
                    else if (this.rightPlayer.id === playerId)
                        this.leftPlayer.setPoints(7);
                    this.stopMatch();
                }
            }, 15000);
        }
    }

    setWinner() {
        if (this.state === "done") {
            if (this.leftPlayer && !this.rightPlayer) {
                this.leftPlayer.setPoints(7);
                this.winner = this.leftPlayer;
            } else if (this.leftPlayer.getPoints() < this.rightPlayer.getPoints())
                this.winner = this.rightPlayer;
            else if (this.leftPlayer.getPoints() > this.rightPlayer.getPoints())
                this.winner = this.leftPlayer;
        }
    }

    getWinner() {
        return (this.winner);
    }

    toJSON() {
        return ({
            id : this.id,
            state : this.state,
            ...((this.state === "waiting") && {
                ...((0 < this.members.length) && {leftPlayer: this.members[0]}),
                ...((1 < this.members.length) && {rightPlayer: this.members[1]}),
            }),
            ...((this.state !== "going") && {
                leftPlayer: this.leftPlayer.toJSON(),
                rightPlayer: this.rightPlayer.toJSON(),
            }),
            ...((this.state === "done") && {winner : this.winner}),
        })
    }
}