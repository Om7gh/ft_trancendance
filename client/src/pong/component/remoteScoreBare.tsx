import type { ScoreType } from '../types/playMatch.ts';
import type { MatchType, PlayerType } from '../types/playWithSomeOne.ts';
import MessageDisplayer from './MessageDisplayer.tsx';

type PlayerPropsType = {
  player: PlayerType;
};

function LeftPlayer({ player }: PlayerPropsType) {
  return (
    <div className="flex flex-col items-center gap-2">
      <img
        className="w-12 h-12 md:w-25 md:h-25"
        src={player.avatar}
      />
      <h3 className="text-xs md:text-lg lg:text-lg">
        {player.username}
      </h3>
    </div>
  );
}

function RightPlayer({ player }: PlayerPropsType) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl">
      <img
        className="w-12 h-12 md:w-25 md:h-25"
        src={player.avatar}
      />
      <h3 className="text-xs md:text-lg lg:text-lg">
        {player.username}
      </h3>
    </div>
  );
}

type ScoreBarPropsType = {
  score: ScoreType | null;
  match: MatchType | null;
};

export default function RemoteScoreBar({ score, match }: ScoreBarPropsType) {
  if (score && match) {
    return (
      <div className=" flex justify-between md:justify-evenly items-center bg-slate-950/30 rounded-xl shadow-xl text-violet-200 p-3 w-full">
          <LeftPlayer player={match.leftPlayer} />
        <div className="bg-linear-to-l from-violet-500 to-neon p-2 bg-clip-text text-transparent text-sm md:text-xl">
          {score.leftPlayer} vs {score.rightPlayer}
        </div>
          <RightPlayer player={match.rightPlayer} />
      </div>
    );
  }
  return <MessageDisplayer message="Loading Score..." />;
}
