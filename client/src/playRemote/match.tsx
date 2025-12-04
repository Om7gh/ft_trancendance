import React from 'react';
import { useState, useRef, useEffect } from 'react';

import { Winner } from './winner.tsx';
import { Events } from '../playLocal/pongClasses.tsx';

const events = new Events();

export type ScoreType = {
  leftPlayer: number;
  rightPlayer: number;
};

type PlayerPropsType = {
  children: React.ReactNode;
};

function Player({ children }: PlayerPropsType) {
  return (
    <div className="flex border rounded w-4/9 h-9/10 m-auto text-center">
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
      <Player>Player A: {score.leftPlayer}</Player>
      <Player>Player B: {score.rightPlayer}</Player>
    </div>
  );
}

function handleKeyDown(event: KeyboardEvent) {
  const key = event.key.toLowerCase();
  if (key === 'w' || key === 's' || key === 'arrowup' || key === 'arrowdown') {
    event.preventDefault();
    if (events) {
      events[key] = true;
    }
  }
}

function handleKeyUp(event: KeyboardEvent) {
  const key = event.key.toLowerCase();
  if (key === 'w' || key === 's' || key === 'arrowup' || key === 'arrowdown') {
    event.preventDefault();
    if (events) {
      events[key] = false;
    }
  }
}

function sendEvents(ws: WebSocket) {
  if (events) {
    if (events['w'] || events['arrowup']) {
      ws.send(
        JSON.stringify({
          move: 'up',
        })
      );
    }
    if (events['s'] || events['arrowdown']) {
      ws.send(
        JSON.stringify({
          move: 'down',
        })
      );
    }
  }
}

type Ball = {
  x: number;
  y: number;
  radius: number;
};

function drawBall(
  ball: Ball,
  context: CanvasRenderingContext2D | null,
  color = 'orange'
) {
  if (ball && context) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
    context.fill();
  }
}

type Paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function drawPaddle(
  paddle: Paddle,
  context: CanvasRenderingContext2D,
  color = 'black'
) {
  if (paddle && context) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = paddle.width;
    context.moveTo(paddle.x, paddle.y);
    context.lineTo(paddle.x, paddle.y + paddle.height);
    context.closePath();
    context.stroke();
  }
}

type MessageHandlerType = {
  event: MessageEvent;
  context: CanvasRenderingContext2D;
  setScore: (value: ScoreType) => void;
  setMatchState: (value: string) => void;
};

function messageHandler({
  event,
  context,
  setScore,
  setMatchState,
}: MessageHandlerType) {
  let message = JSON.parse(event.data);

  if (message.state === 'ok') {
    if (message.data.event === 'updateView') {
      context.clearRect(0, 0, 700, 400);
      drawBall(message.data.ball, context, 'orange');
      drawPaddle(message.data.leftPaddle, context, 'green');
      drawPaddle(message.data.rightPaddle, context, 'red');
    } else if (message.data.event === 'updateScore') {
      setScore({
        leftPlayer: message.data.leftPlayer,
        rightPlayer: message.data.rightPlayer,
      });
    } else if (message.data.event === 'done') {
      setMatchState('done');
    }
  }
}

type synchronizePongStateType = {
  connection: WebSocket;
  context: CanvasRenderingContext2D;
  setScore: (value: ScoreType) => void;
  setMatchState: (value: string) => void;
};

function synchronizePongState({
  connection,
  context,
  setScore,
  setMatchState,
}: synchronizePongStateType) {
  let intervalId = null;

  connection.onmessage = (event) => {
    messageHandler({
      event: event,
      context: context,
      setScore: setScore,
      setMatchState: setMatchState,
    });
  };

  intervalId = setInterval(() => sendEvents(connection), 30);
  document.addEventListener('keyup', handleKeyUp);
  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    connection.onmessage = null;
    clearInterval(intervalId);
  };
}

type MatchPropsType = {
  connection: WebSocket;
  matchState: string;
  setMatchState: (value: string) => void;
};

export function Match({
  connection,
  matchState,
  setMatchState,
}: MatchPropsType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderingContext = useRef<CanvasRenderingContext2D | null>(null);
  const [score, setScore] = useState<ScoreType>({
    leftPlayer: 0,
    rightPlayer: 0,
  });

  useEffect(() => {
    if (!canvasRef.current) {
      setMatchState('Error canvasRef not initiate correctly!!');
      return;
    }

    renderingContext.current = canvasRef.current.getContext('2d');
    if (!renderingContext.current) {
      setMatchState('Error fail to get the rendring context!!');
      return;
    }

    return synchronizePongState({
      connection: connection,
      context: renderingContext.current!,
      setScore: setScore,
      setMatchState: setMatchState,
    });
  }, []);

  if (matchState === 'going') {
    return (
      <div>
        <ScoreBar score={score} />
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
      </div>
    );
  }

  return <Winner score={score} />;
}
