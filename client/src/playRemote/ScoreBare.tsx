import type { ScoreType } from "./playMatch"

type PlayerPropsType = {
    children: React.ReactNode,
}

function LeftPlayer({ children }: PlayerPropsType) {
    return (
        <div className="relative flex h-1/1 m-auto">
            <img className="absolute top-1/2 -translate-y-1/2 left-1/4 -translate-x-1/2 w-2/6 m-auto" 
                src="https://avatar.iran.liara.run/public"
            />
            <h1 className='absolute text-[1em] top-1/2 -translate-y-1/2 left-2/4 w-2/6 m-auto'>
                {children}
            </h1>
        </div>
    )
}

function RightPlayer({ children }: PlayerPropsType) {
    return (
        <div className="relative flex h-1/1 m-auto">
            <img className="absolute top-1/2 -translate-y-1/2 left-3/4 -translate-x-1/2 w-2/6 m-auto" 
                src="https://avatar.iran.liara.run/public"
            />
            <h1 className='absolute text-[1em] top-1/2 -translate-y-1/2 left-1/8 w-2/6 m-auto'>
                {children}
            </h1>
        </div>
    )
}

type ScoreBarPropsType = {
    score: ScoreType;
}

export function ScoreBar({ score }: ScoreBarPropsType) {
    return (
        <div className="flex w-9/10 h-[100px] m-auto my-4">
            <div className="w-3/7 aspect-[3/1] m-auto my-4 py-2">
                <LeftPlayer>{score.leftPlayer.name}</LeftPlayer>
            </div>
            <div className="border rounded w-1/7 m-auto p-2 text-center">
                {score.leftPlayer.points} vs {score.rightPlayer.points}
            </div>
            <div className="w-3/7 aspect-[3/1] m-auto my-4 py-2">
                <RightPlayer>{score.rightPlayer.name}</RightPlayer>
            </div>
        </div>
    )
}