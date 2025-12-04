import { Link } from 'react-router';

import type { ScoreType } from './match.tsx';

type MatchResultPropsType = {
  score: ScoreType;
};

function MatchResult({ score }: MatchResultPropsType) {
  return (
    <div className="flex flex-col border rounded w-4/5 h-3/6 m-auto text-[1em]">
      <div className="flex h-[100px] m-auto">
        <h1 className="m-auto">Match Result</h1>
      </div>
      <div className="flex w-full h-[100px] m-auto text-[1em]">
        <span className="border rounded w-2/7 text-center m-auto">
          Player A
        </span>
        <span className="m-auto w-2/7 text-center">
          {score.leftPlayer} __VS__ {score.rightPlayer}
        </span>
        <span className="border rounded w-2/7 text-center m-auto">
          Player B
        </span>
      </div>
      <div className="flex h-[100px] m-auto text-[1em]">
        <p className="m-auto">
          !!&#127881;
          {score.leftPlayer < score.rightPlayer ? 'Player B' : 'Player A'} is
          the winner&#127881;!!
        </p>
      </div>
    </div>
  );
}

type WinnerPropsType = {
  score: ScoreType;
};

export function Winner({ score }: WinnerPropsType) {
  return (
    <div className="flex flex-col border rounded w-9/10 h-[300px] m-auto my-4">
      <MatchResult score={score} />
      <div className="border rounded w-2/5 m-auto">
        <Link to="/pongGame" className="block text-center">
          Start Menu
        </Link>
      </div>
    </div>
  );
}
