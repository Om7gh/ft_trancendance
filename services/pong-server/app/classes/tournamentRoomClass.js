import axios from 'axios';
import Room from "./roomClass.js";
import Invitation from "./invitationClass.js";

export default class TournamentRoom extends Room {
    constructor () {
        super();

        this.invitees = [];
    }

    isInvited(playerId) {
        for (let invitee of this.invitees) {
            if (invitee.id === playerId) {
                return (true);
            }
        }
        return (false);
    }

    addInvitee(playerId) {
        if (!this.isInvited(playerId) && (this.invitees.length < 2)) {
            this.invitees.push(playerId)
            return true;
        }
        return false;
    }

    joinMatch(user) {
        if (this.isInvited(user.id)) {
            this.addPlayer(user);
        }
    }

    async invitePlayers() {
        try {  
            const invitations = [];

            if (this.state !== "waiting")
                return ;

            for (let player of this.invitees) {
                let invitation = new Invitation("joinMatch", null, player.id, 60);
                invitations.push(invitation);
            }

            await axios.post('http://notification:9005/send', {
                data: invitations,
            })

            this.waitPlayersToJoin();
        } catch (error) {
            console.log(error);
            this.emit("error");
        }
    }

    waitPlayersToJoin() {
        let counter = 0;

        let intervalId = setInterval(() => {
            if (this.state === "going") {
                clearInterval(intervalId);
            } else if (60 < counter) {
                clearInterval(intervalId);
                this.stopMatch();
            }
            counter++;
        }, 1000);
    }

    setWinner() {
        if (!this.leftPlayer && !this.rightPlayer) {
            return ;
        } else if (this.leftPlayer < !this.rightPlayer) {
            this.winner = this.leftPlayer;
        } else if (this.leftPlayer.Points < this.rightPlayer.Points) {
            this.winner = this.rightPlayer;
        } else if (this.leftPlayer.Points > this.rightPlayer.Points) {
            this.winner = this.leftPlayer;
        }
    }

    // else if (this.leftPlayer.isJoined() && !this.rightPlayer.isJoined()) {
    //     this.winner = this.leftPlayer;
    //     this.LeftPoints = 7;
    // } else if (!this.leftPlayer.isJoined() && this.rightPlayer.isJoined()) {
    //     this.winner = this.rightPlayer;
    //     this.rightPoints = 7;
    // }
}