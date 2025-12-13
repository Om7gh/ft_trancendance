import type { ScoreType } from "./playMatch.js"
import type { MatchType, PlayerType} from "./playWithSomeOne.tsx"

type PlayerPropsType = {
    player: PlayerType;
}

function LeftPlayer({ player }: PlayerPropsType) {
    return (
        <div className="relative flex h-1/1 m-auto">
            <img className="absolute top-1/2 -translate-y-1/2 left-1/4 -translate-x-1/2 w-2/6 m-auto" 
                src={player.avatar}
            />
            <h1 className='absolute text-[1em] top-1/2 -translate-y-1/2 left-2/4 w-2/6 m-auto'>
                {player.name}
            </h1>
        </div>
    )
}

function RightPlayer({ player }: PlayerPropsType) {
    return (
        <div className="relative flex h-1/1 m-auto">
            <img className="absolute top-1/2 -translate-y-1/2 left-3/4 -translate-x-1/2 w-2/6 m-auto" 
                src={player.avatar}
            />
            <h1 className='absolute text-[1em] top-1/2 -translate-y-1/2 left-1/8 w-2/6 m-auto'>
                {player.name}
            </h1>
        </div>
    )
}

type ScoreBarPropsType = {
    score: ScoreType;
    match: MatchType;
}

export function ScoreBar({ score, match }: ScoreBarPropsType) {
    return (
        <div className="flex w-9/10 h-[100px] m-auto my-4">
            <div className="w-3/7 aspect-[3/1] m-auto my-4 py-2">
                <LeftPlayer player={match.leftPlayer} />
            </div>
            <div className="border rounded w-1/7 m-auto p-2 text-center">
                {score.leftPlayer} vs {score.rightPlayer}
            </div>
            <div className="w-3/7 aspect-[3/1] m-auto my-4 py-2">
                <RightPlayer player={match.rightPlayer} />
            </div>
        </div>
    )
}