import React from 'react';
import { useState, useRef, useEffect } from 'react';

import { Winner } from './winner.tsx';
import { pongGame } from './pongGame.tsx';
// import { MessageDisplayer } from '../playRemote/playWithSomeOne.tsx';

type MessageDisplayerPropsType = {
  message: string;
};

export function MessageDisplayer({ message }: MessageDisplayerPropsType) {
  return (
    <div className="border rounded flex flex-col w-9/10 h-[300px] m-auto my-4">
      <p className="m-auto">{message}</p>
    </div>
  );
}

export type ScoreType = {
  playerA: number;
  playerB: number;
};

type PlayerPropsType = {
  children: React.ReactNode;
};

function Player({ children }: PlayerPropsType) {
  return (
    <div className="flex border rounded w-4/9 h-9/10 m-auto my-4 text-center">
      <h1 className="text-[1.2em] m-auto">{children}</h1>
    </div>
  );
}

type ScoreBarPropsType = {
  score: ScoreType;
};

function ScoreBar({ score }: ScoreBarPropsType) {
  return (
    <div className="flex w-9/10 h-[80px] m-auto my-4">
      <Player>Player A: {score.playerA}</Player>
      <Player>Player B: {score.playerB}</Player>
    </div>
  );
}

type MatchPropsType = {
  setMatchState: (value: string) => void;
  setScore: (value: ScoreType) => void;
};

function Match({ setScore, setMatchState }: MatchPropsType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderingContext = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    try {
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
    } catch (error: any) {
      setMatchState(error.message);
    }
  }, []);

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
  const [score, setScore] = useState<ScoreType>({ playerA: 0, playerB: 0 });
  const [matchState, setMatchState] = useState<string>('going');

  if (matchState === 'going') {
    return (
      <div>
        <ScoreBar score={score} />
        {/* <Player>Player A: {score.playerA}</Player>
                <Player>Player B: {score.playerB}</Player> */}
        <Match setMatchState={setMatchState} setScore={setScore} />
      </div>
    );
  } else if (matchState === 'done') {
    return <Winner score={score} setScore={setScore} />;
  }

  return <MessageDisplayer message={matchState} />;
}
