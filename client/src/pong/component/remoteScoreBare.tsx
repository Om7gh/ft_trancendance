import type { ScoreType } from '../types/playMatch.ts';
import type { MatchType, PlayerType } from '../types/playWithSomeOne.ts';
import MessageDisplayer from './MessageDisplayer.tsx';

type PlayerPropsType = {
  player: PlayerType;
};

function LeftPlayer({ player }: PlayerPropsType) {
  return (
    <div className="relative flex h-1/1 m-auto">
      <img
        className="absolute top-1/2 -translate-y-1/2 left-1/4 -translate-x-1/2 w-2/6 m-auto"
        src={player.avatar}
      />
      <h1 className="absolute text-[1em] top-1/2 -translate-y-1/2 left-2/4 w-2/6 m-auto">
        {player.name}
      </h1>
    </div>
  );
}

function RightPlayer({ player }: PlayerPropsType) {
  return (
    <div className="relative flex h-1/1 m-auto">
      <img
        className="absolute top-1/2 -translate-y-1/2 left-3/4 -translate-x-1/2 w-2/6 m-auto"
        src={player.avatar}
      />
      <h1 className="absolute text-[1em] top-1/2 -translate-y-1/2 left-1/8 w-2/6 m-auto">
        {player.name}
      </h1>
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
      <div className=" flex justify-center items-center bg-slate-950/60 shadow-xl text-violet-200">
        <div className="aspect-[3/1] m-auto my-4 py-2 w-72">
          <LeftPlayer player={match.leftPlayer} />
        </div>
        <div className="border m-auto text-center p-6">
          {score.leftPlayer} vs {score.rightPlayer}
        </div>
        <div className="aspect-[3/1] m-auto my-4 py-2 w-72">
          <RightPlayer player={match.rightPlayer} />
        </div>
      </div>
    );
  }
  return <MessageDisplayer message="Loading Score..." />;
}
