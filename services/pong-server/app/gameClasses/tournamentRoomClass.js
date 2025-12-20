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