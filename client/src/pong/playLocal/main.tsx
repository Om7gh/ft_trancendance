import { useNavigate } from 'react-router';
import { useState, useRef} from 'react';

import useLocalMatch from '../hooks/useLocalMatch.ts';
import LocalWinner from '../component/localWinner.tsx';
import LocalScoreBar from '../component/localScoreBare.tsx';
import MessageDisplayer from '../component/MessageDisplayer.tsx';

export type PlayerType = {
  name          : string;
  points        : number;
};

export type ScoreType = {
  leftPlayer    : PlayerType;
  rightPlayer   : PlayerType;
};

type MatchPropsType = {
  setError: (value: string) => void;
  setMatchState: (value: string) => void;
  setScore: (value: ScoreType | null) => void;
};

function Mattch({setError, setMatchState, setScore }: MatchPropsType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useLocalMatch(canvasRef, setError, setMatchState, setScore);
  
  return (
    <div className="flex flex-col w-9/10 m-auto my-4">
      <canvas
        width="700"
        height="400"
        ref={canvasRef}
        className="border rounded w-1/1 aspec-[7/4] m-auto"
      >
        Your browser does not support HTML canvas API!!
      </canvas>
    </div>
  );
}

export function PlayLocal() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<ScoreType | null>(null);
  const [matchState, setMatchState] = useState('waiting');

  if (error)
    return <MessageDisplayer message={error} />
  return (
    <div className="relative">
      <LocalScoreBar score={score} />
      <Mattch
        setError={setError}
        setScore={setScore}
        setMatchState={setMatchState}
      />
      {matchState === 'done' && <LocalWinner score={score} />}
      <button
          className="m-auto block bg-slate-950/60 text-violet-200 px-6 py-3 text-xl shadow-xl w-1/2"
          onClick={() => {
            navigate('/dashboard/games/pingpong');
          }}
      >Leave Match</button>
    </div>
  );
}
