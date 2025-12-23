import axios from "fastify-axios";
import Invitation from "./invitationClass.js";

class TournamentRoom extends Room {
    constructor () {
        super();

        this.invitees = [];
        
    }

    isAlreadyInvited(playerId) {
        for (let invitee of this.invitees) {
            if (invitee.id === playerId) {
                return (true);
            }
        }
        return (false);
    }

    addInvitee(playerId) {
        if (!this.isAlreadyInvited(playerId) && (this.invitees.length < 2)) {
            this.invitees.push(playerId)
            return true;
        }
        return false;
    }

    async invitePlayers() {
        if (this.state !== "waiting")
            return ;
        if (this.leftPlayer && this.rightPlayer) {
            const invitation1 = new Invitation("joinMatch", null, this.leftPlayer.id, null);
            const invitation2 = new Invitation("joinMatch", null, this.rightPlayer.id, null);
            try {  
                await axios.post('http://notification:9005/send', {
                    data: [invitation1, invitation2, ],
                })
            } catch (error) {
                console.log(error);
                this.stopMatch();
            }
        } else if (this.leftPlayer && !this.rightPlayer) {

        }
    }

    async sendInvitation(playerId) {
        try {
            const invitation = new Invitation("joinMatch", null, {playerId}, 60);
            
            await axios.post('http://notification:9005/send', {
                data: [invitation, ],
            })
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    setWinner() {
        if (this.leftPlayer && !this.rightPlayer) {
            this.winner = this.leftPlayer;
        } else if (this.leftPlayer.isJoined() && !this.rightPlayer.isJoined()) {
            this.winner = this.leftPlayer;
            this.LeftPoints = 7;
        } else if (!this.leftPlayer.isJoined() && this.rightPlayer.isJoined()) {
            this.winner = this.rightPlayer;
            this.rightPoints = 7;
        } else if (this.leftPoints < this.rightPoints) {
            this.winner = this.rightPlayer;
        } else if (this.leftPoints > this.rightPoints) {
            this.winner = this.leftPlayer;
        }
    }
}