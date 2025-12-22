import { useState, useEffect } from "react";

import type { ScoreType } from "../types/playMatch";
import type { MatchType, PlayerType } from "../types/playWithSomeOne";
import MessageDisplayer from "./MessageDisplayer";

export type WinnerPropsType = {
    score: ScoreType | null;
    match: MatchType | null;
};

export default function Winner({ score, match }: WinnerPropsType) {
    const [winner, setWinner] = useState<PlayerType | null>(null);

    useEffect(() => {
        if (score && match) {
        if (score.leftPlayer < score.rightPlayer) setWinner(match.rightPlayer);
        else if (score.rightPlayer < score.leftPlayer)
            setWinner(match.leftPlayer);
        }
    }, []);

    if (score && match) {
        return (
            <div className="border rounded absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tflex flex-col m-auto">
                <img className="w-1/4 m-auto my-4" src={winner?.avatar} />
                <h1 className="text-[1em] m-auto text-center m-auto my-4">
                    Winner is: {(winner && winner.name) || 'No Winner!!'}
                </h1>
            </div>
        );
    }
    return <MessageDisplayer message="Loading winner..." />;
}