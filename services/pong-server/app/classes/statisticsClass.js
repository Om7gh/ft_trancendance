export default class Statistics {
    constructor(matches, uid) {
        this.matches =  matches;
        this.wins = 0;
        this.loses = 0;

        for (let matche of this.matches) {
            if (matche.winner === uid)
                this.wins += 1;
            else
                this.loses += 1;
        }
    }

    toJson() {
        return ({
            wins: this.wins,
            loses: this.loses,
            matches: this.matches,
        })
    }
}