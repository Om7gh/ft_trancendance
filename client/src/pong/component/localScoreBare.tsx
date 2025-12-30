import { type ScoreType } from "../playLocal/main.tsx"
import MessageDisplayer from "../component/MessageDisplayer.tsx"

type PlayerPropsType = {
    children: React.ReactNode,
}

function LeftPlayer({ children }: PlayerPropsType) {
    return (
        <div className="flex flex-col items-center gap-3">
            <img className="w-10 h-10 md:w-16 md:h-16" 
                src="https://avatar.iran.liara.run/public"
            />
            <h2 className=''>
                {children}
            </h2>
        </div>
    )
}

function RightPlayer({ children }: PlayerPropsType) {
    return (
        <div className="flex flex-col items-center gap-3">
            <img className="w-10 h-10 md:w-16 md:h-16" 
                src="https://avatar.iran.liara.run/public"
            />
            <h1 className=''>
                {children}
            </h1>
        </div>
    )
}

type ScoreBarPropsType = {
    score: ScoreType | null;
}

export default function LocalScoreBar({ score }: ScoreBarPropsType) {
    if (score) {
        return (
            <div className="flex justify-evenly items-center w-full ">
                <div className="">
                    <LeftPlayer>{score.leftPlayer.name}</LeftPlayer>
                </div>
                <div className="">
                    {score.leftPlayer.points} vs {score.rightPlayer.points}
                </div>
                <div className="">
                    <RightPlayer>{score.rightPlayer.name}</RightPlayer>
                </div>
            </div>
        )
    }
    return <MessageDisplayer message="Loading score..." />
}