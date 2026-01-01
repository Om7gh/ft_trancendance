
import MessageDisplayer from "./MessageDisplayer";
import { type ScoreType } from "../types/playMatch";
import { type MatchType, type PlayerType } from "../types/playWithSomeOne";

export type WinnerPropsType = {
    score: ScoreType | null;
    match: MatchType | null;
};

export default function RemoteWinner({ score, match }: WinnerPropsType) {
    let winner : PlayerType | null = null;

    if (score && match) {
        if (score.leftPlayer < score.rightPlayer)
            winner = match.rightPlayer;
        else (score.leftPlayer > score.rightPlayer)
            winner = match.leftPlayer
    }

    if (score && match) {
        return (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-linear-0 from-violet-400 z-555 to-neon flex justify-center items-center p-6 flex-col gap-2 rounded-lg">
                <img className="w-12 h-12 md:w-24 md:h-24" src={winner?.avatar} />
                <h2 className="text-center text-xs md:text-lg text-slate-800">
                    Winner is: {(winner && winner.username) || 'No Winner!!'}
                </h2>
            </div>
        );
    }
    return <MessageDisplayer message="Loading winner..." />;
}