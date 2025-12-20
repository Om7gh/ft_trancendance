export default class Tournament {

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
