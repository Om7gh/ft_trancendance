import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import type { MatchPropsType } from '../types/playMatch.ts';
import type { ScoreType, PlayMatchPropsType } from '../types/playMatch.ts';
import { onTouchEndHandler, onTouchStartHandler } from '../hooks/useSynchronization.ts';

import useWebSocket from '../hooks/useWebSocket.ts';
import CounterDown from '../component/CounterDown.tsx';
import RemoteWinner from '../component/remoteWinner.tsx';
import RemoteScoreBar from '../component/remoteScoreBare.tsx';
import useSynchronization from '../hooks/useSynchronization.ts';
import MessageDisplayer from '../component/MessageDisplayer.tsx';

function Match({match, connection, matchState, setMatchState, setError}: MatchPropsType) {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<ScoreType | null>(null);

  useSynchronization(connection, canvasRef, matchState,
    setScore, setMatchState, setError
  )

  return (
    <div>
      <RemoteScoreBar score={score} match={match} />
      <div
        className="relative flex flex-col m-auto my-10">
        <div 
          className='absolute border top-0 w-full h-1/3 z-10'
          onTouchStart={(e) => {
            e.stopPropagation();
            onTouchEndHandler("s");
            onTouchStartHandler("w");
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            onTouchEndHandler("w");
          }}
          onContextMenu={(e) => {
            e.preventDefault()
          }}
        ></div>
        <canvas
          width="700" height="400" ref={canvasRef}
          className="bg-slate-950/40 my-5 shadow-xl shadow-slate-900 w-72 h-72 md:w-full md:h-full"
        >
          Your browser does not support HTML canvas API!!
        </canvas>
        <div
          className='border absolute bottom-0 w-full h-1/3 z-10'
          onTouchStart={(e) => {
            e.stopPropagation();
            onTouchEndHandler("w");
            onTouchStartHandler("s");
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            onTouchEndHandler("s");
          }}
          onContextMenu={(e) => {
            e.preventDefault()
          }}
        ></div>
        {(matchState === 'paused') && <CounterDown />}
        {(matchState === 'done') && <RemoteWinner score={score} match={match} />}
      </div>
      <button
          className="m-auto block bg-slate-950/60 text-violet-200 px-6 py-3 text-xl shadow-xl w-1/2"
          onClick={() => {
            if (matchState === 'going') {
                connection.send(JSON.stringify({type: 'leave',data: true,}));
            }
            navigate('/dashboard/games/pingpong/remote');
          }}
      >Leave Match</button>
    </div>
  );
}

export default function PlayMatch({ match }: PlayMatchPropsType) {
  const [error, setError] = useState<string | null>(null);
  const [matchState, setMatchState] = useState<string | null>(null);
  const connection  = useRef<{ ws: WebSocket | null }>({ ws: null });
  
  const url = `${import.meta.env.VITE_API_URL}/pongGame/remote/match?rid=${match.id}`;

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