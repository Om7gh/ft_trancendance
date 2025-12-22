import { useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';

import { pongGame } from './pongGame.tsx';
import { ScoreBar } from './ScoreBare.tsx';
import MessageDisplayer from '../component/MessageDisplayer.tsx';

export type PlayerType = {
  name          : string;
  points        : number;
};

export type ScoreType = {
  leftPlayer    : PlayerType;
  rightPlayer   : PlayerType;
};

type WinnerPropsType = {
  score: ScoreType;
};

export function Winner({ score }: WinnerPropsType) {
  const [winner, setWinner] = useState<PlayerType | null>(null);

  useEffect(() => {
    if (score) {
      if (score.leftPlayer.points < score.rightPlayer.points)
        setWinner(score.rightPlayer);
      else if (score.rightPlayer.points < score.leftPlayer.points)
        setWinner(score.leftPlayer);
    }
  }, []);

  return (
    <div className="border rounded absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tflex flex-col m-auto">
      <img
        className="w-1/4 m-auto my-4"
        src="https://avatar.iran.liara.run/public"
      />
      <h1 className="text-[1em] m-auto text-center  my-4">
        Winner is: {(winner && winner.name) || 'No Winner!!'}
      </h1>
    </div>
  );
}

type MatchPropsType = {
  matchState: string;
  setMatchState: (value: string) => void;
  setScore: (value: ((prev: ScoreType) => ScoreType)) => void;
};

function Match({ matchState, setMatchState, setScore }: MatchPropsType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderingContext = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    try {
      if (matchState === 'going') {
        if (!canvasRef.current) {
          setMatchState('Error canvasRef not initiate correctly!!');
          return;
        }

        renderingContext.current = canvasRef.current.getContext('2d');
        if (!renderingContext.current) {
          setMatchState('Error fail to get the rendering context!!');
          return;
        }

        return pongGame({
          canvas: canvasRef.current,
          context: renderingContext.current,
          setScore: setScore,
          setMatchState: setMatchState,
        });
      }
    } catch (error: any) {
      setMatchState(error.message);
    }
  }, [matchState]);

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
  const navigate                      = useNavigate();
  const [matchState, setMatchState]   = useState('going');
  const [score, setScore]             = useState<ScoreType>({
    leftPlayer: { name: 'LeftPlayer', points: 0 },
    rightPlayer: { name: 'RightPlayer', points: 0 },
  });

  if (matchState !== "done") {
    if ((6 < score.leftPlayer.points) || (6 < score.rightPlayer.points)) {
      setMatchState("done");
    }
  }

  if (matchState === 'going' || matchState === 'done') {
    return (
      <div className="relative">
        <ScoreBar score={score} />
        <Match
          setScore={setScore}
          matchState={matchState}
          setMatchState={setMatchState}
        />
        {matchState === 'done' && <Winner score={score} />}
        <button
          className="block border rounded w-1/3 my-4 p-4 m-auto"
          onClick={() => {
            navigate('/dashboard/games/pingpong');
          }}
        >
          Leave Match
        </button>
      </div>
    );
  }

  return <MessageDisplayer message={matchState} />;
}
