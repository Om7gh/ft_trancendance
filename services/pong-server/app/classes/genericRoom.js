import axios from 'axios';
import { v4 as uuid } from "uuid";
import { EventEmitter } from 'events';

import Ball from "./ballClass.js";
import Player from "./playerClass.js";

export default class GenericRoom extends EventEmitter {

    constructor(tournament = null) {
        super();

        this.id             = uuid();
        this.state          = "waiting";

        this.members        = [];
        this.winner         = null;
        this.tournament     = tournament;

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

    isReady() {
        return (this.state === "ready");
    }

    isWaiting() {
        return (this.state === "waiting");
    }

    isGoing() {
        return (this.state === "going");
    }

    isPaused() {
        return (this.state === "paused");
    }
    
    isCanceled() {
        return (this.state === "canceled")
    }
    
    isDone() {
        return (this.state === "done");
    }

    addMember(userId) {
        if (this.isWaiting() || (this.members.length < 2) || !this.isMember(userId)) {
            this.members.push(userId);
        }
    }

    removeMember(memberId) {
        this.members = this.members.filter((id) => {
            if (id && (id !== memberId)) {
                return (id);
            }
        })
    }

    isMember(userId) {
        for (let member of this.members) {
            if (member && (member === userId)) {
                return true;
            }
        }
        return false;
    }

    joinRoom(user) {
        if (this.isWaiting() && this.isMember(user.id)) {
            this.addPlayer(user);
        }
    }

    isPlayer(playerId) {
        if (this.leftPlayer && (this.leftPlayer.id === playerId))
            return true;
        else if (this.rightPlayer && (this.rightPlayer.id === playerId))
            return true;
        return false;
    }

    createNewPlayer(user, side) {
        const player = new Player(user, this.table);

        this.addMember(user.id);

        player.setPaddleInTable(side);

        player.on("leaveMatch", () => {
            this.removeMember(player.id);
            if (this.leftPlayer && (this.leftPlayer.id === player.id)){
                if (this.rightPlayer && this.isMember(this.rightPlayer.id)) {
                    this.rightPlayer.points = 7;
                }
            } else if (this.rightPlayer && (this.rightPlayer.id === player.id)) {
                if (this.leftPlayer && this.isMember(this.leftPlayer.id)) {
                    this.leftPlayer.points = 7;
                }
            }
            this.stopMatch();
        });

        player.on("socketClosed", () => {
            if (this.isPaused())
                this.stopMatch();
            else
                this.pause(player.id);
        })

        return player;
    }

    addPlayer(user) {
        if (user && this.isWaiting()) {
            if (!this.leftPlayer) {
                this.leftPlayer = this.createNewPlayer(user, "left");
            } else if (!this.rightPlayer && (this.leftPlayer.id !== user.id)) {
                this.rightPlayer = this.createNewPlayer(user, "right");
            }

            if (this.leftPlayer && this.rightPlayer) {
                this.state = "ready";
            }
            return true;
        }
        return (false);
    }

    setPlayerSocket(playerId, socket) {
        if (this.leftPlayer && (this.leftPlayer.id === playerId)) {
            this.leftPlayer.setSocket(socket);
        } else if (this.rightPlayer && (this.rightPlayer.id === playerId)) {
            this.rightPlayer.setSocket(socket);
        }

        if (this.isPaused()) {
            this.continue(playerId);
        } else if (this.leftPlayer.socket && this.rightPlayer.socket) {
            this.startMatch();
        }
    }

    startMatch() {
        if (this.isReady()) {
            clearTimeout(this.waitingId);
            if (this.leftPlayer.socket && this.rightPlayer.socket) {
                this.state = "going";
                this.broadcastMatchState();
                this.broadcastScore();
                this.matchLoop();
                return ;
            }
        }
    }

    generateInvitations() {
        const invitations = [];

        for (let member of this.members) {
            if (member) {
                invitations.push({
                    id: uuid(),
                    type: "joinMatch",
                    sender: {id: this.id, username: "", avatar: ""},
                    receiver: {id: member},
                    expireTime: (Math.floor(Date.now() / 1000) + 60),
                });
            }
        }
        return (invitations);
    }

    async inviteMembers() {
        try {
            if (this.isWaiting()) {
                const invitations = this.generateInvitations();

                await axios.post("http://notification:9005/send", {
                    data: invitations,
                });
                this.waitMembersToJoin();
            }
        } catch (error) {
            console.log(error);
            this.emit("error");
            this.cancelMatch();
        }
    }

    waitMembersToJoin() {
        this.waitingId = setTimeout(() => {
            if (this.isWaiting()) {
                if (!this.leftPlayer && !this.rightPlayer) {
                    this.cancelMatch();
                    return ;
                }
                this.stopMatch();
            }
        }, 60000);
    }

    matchLoop() {
        if (this.isGoing()) {
            this.playingId = setInterval(() => {
                if ((this.ball.x < 0) || (this.table.width < this.ball.x)) {
                    this.broadcastScore()
                    this.ball.reset();
                    if ((6 < this.leftPlayer.getPoints()) || (6 < this.rightPlayer.getPoints())) {
                        this.broadcastView();
                        this.stopMatch();
                    }
                } else if (!this.leftPlayer.socket && !this.rightPlayer.socket) {
                    this.cancelMatch();
                }
                this.ball.getNextPosition(this.table, this.leftPlayer.paddle, this.rightPlayer.paddle);
                this.broadcastView();
            }, 30);
        }
    }

    continue(playerId) {
        if (this.isPaused() && this.isPlayer(playerId)) {
            clearTimeout(this.pausingId);
            this.state = "going";
            this.broadcastScore();
            this.broadcastMatchState()
            this.matchLoop();
        }
    }

    pause(playerId) {
        if ((this.isGoing()) && this.isPlayer(playerId)) {
            clearInterval(this.playingId);
            this.state = "paused";
            this.broadcastMatchState()
            this.pausingId = setTimeout(() => {
                if (this.isPaused()) {
                    if (this.leftPlayer.id === playerId)
                        this.rightPlayer.setPoints(7);
                    else if (this.rightPlayer.id === playerId)
                        this.leftPlayer.setPoints(7);
                    this.stopMatch();
                }
            }, 15000);
        }
    }

    cancelMatch() {
        if (this.isWaiting()) {
            this.state = "done";
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

    setWinner() {
        if (this.isDone()) {
            if (this.leftPlayer && !this.rightPlayer) {
                this.winner = this.leftPlayer.toJSON();
                this.leftPlayer.setPoints(7);
            } else if (this.leftPlayer.getPoints() < this.rightPlayer.getPoints())
                this.winner = this.rightPlayer.toJSON();
            else if (this.leftPlayer.getPoints() > this.rightPlayer.getPoints())
                this.winner = this.leftPlayer.toJSON();
        }
    }

    getWinnerId() {
        if (this.winner) {
            return (this.winner.id);
        }
        return null;
    }

    getWinner() {
        return (this.winner);
    }

        
    broadcastMessage(message) {
        if (this.leftPlayer) {
            this.leftPlayer.sendMessage(message);
        }
        if (this.rightPlayer) {
            this.rightPlayer.sendMessage(message);
        }
    }

    updateScore() {
        if (this.ball.x < 0) {
            this.rightPlayer.incrementPoints();
        } else if (this.table.width < this.ball.x) {
            this.leftPlayer.incrementPoints();
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

    toJSON() {
        return ({
            id : this.id,
            state : this.state,
            ...(this.leftPlayer && {leftPlayer:  this.leftPlayer.toJSON()}),
            ...(this.rightPlayer && {rightPlayer:  this.rightPlayer.toJSON()}),
            ...((this.isDone()) && {winner : this.winner})
        })
    }
}
