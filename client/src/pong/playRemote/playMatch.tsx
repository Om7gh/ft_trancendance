import { useState, useRef, useEffect } from 'react';

import type { MatchPropsType } from '../types/playMatch.ts';
import type { ScoreType, PlayMatchPropsType } from '../types/playMatch.ts';

import Winner from '../component/Winner.tsx';
import ScoreBar from '../component/ScoreBare.tsx';
import LeaveMatch from '../component/LeavMatch.tsx';
import useWebSocket from '../hooks/useWebSocket.ts';
import CounterDown from '../component/CounterDown.tsx';
import useSynchronization from '../hooks/useSynchronization.ts';
import MessageDisplayer from '../component/MessageDisplayer.tsx';

function Match({match, connection, matchState, setMatchState, setError}: MatchPropsType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<ScoreType | null>(null);

  useSynchronization(connection, canvasRef, matchState,
    setScore, setMatchState, setError
  )

  return (
    <div className="relative">
      <ScoreBar score={score} match={match} />
      <div className="flex flex-col m-auto my-10">
        <canvas
          width="700"
          height="400"
          ref={canvasRef}
          className="border w-full aspec-[7/4] m-auto bg-slate-950/60"
        >
          Your browser does not support HTML canvas API!!
        </canvas>
        {(matchState === 'done') && <Winner score={score} match={match} />}
        {(matchState === 'pause') && <CounterDown />}
      </div>
      <LeaveMatch matchState={matchState} connection={connection} />
    </div>
  );
}

export default function PlayMatch({ match }: PlayMatchPropsType) {
  const connection  = useRef<{ ws: WebSocket | null }>({ ws: null });
  const [error, setError] = useState<string | null>(null);
  const [matchState, setMatchState] = useState<string | null>(null);
  const url = `http://localhost:8080/pongGame/remote/join?rid=${match.roomId}`;

  useWebSocket(url, connection.current, setMatchState, setError);

  if (error){
    return <MessageDisplayer message={error} />
  } else if (matchState) {
    return (
      <Match 
        match={match}
        connection={connection.current.ws!}
        matchState={matchState}
        setMatchState={setMatchState}
        setError={setError}
      />
    )
  }
  return <MessageDisplayer message="Establishing connection..." />;
}
