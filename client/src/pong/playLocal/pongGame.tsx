import { Table, Ball, Paddle, Events } from './pongClasses.tsx';

import type { ScoreType } from './main.tsx';

var events: Events | null = null;
var table: Table | null = null;
var ball: Ball | null = null;
var left_paddle: Paddle | null = null;
var right_paddle: Paddle | null = null;

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

function calculateNextFrame() {
  if (events && table && left_paddle && right_paddle && ball) {
    events['arrowdown'] && right_paddle.moveDown(table);
    events['s'] && left_paddle.moveDown(table);
    events['w'] && left_paddle.moveUp();
    events['arrowup'] && right_paddle.moveUp();
    ball.getNextPosition(table, left_paddle, right_paddle);
  }
}

function initaiteGame() {
  events = new Events();
  table = new Table();
  ball = new Ball(350, 200, 'orange');
  left_paddle = new Paddle(20, 160, 'green');
  right_paddle = new Paddle(680, 160, 'red');
}

type pongGameArgsType = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  setScore: (input: (prev: ScoreType) => ScoreType) => void;
  setMatchState: (value: string) => void;
};

export function pongGame({
  canvas,
  context,
  setScore,
  setMatchState,
}: pongGameArgsType) {
  let animationId = 0;

  initaiteGame();

  if (table && ball && left_paddle && right_paddle && events) {
    table.setContext(context);
    table.setContextDimensions(canvas);

    function gameLoop() {
      calculateNextFrame();
      if (table && ball && left_paddle && right_paddle) {
        if (ball.x < 0 || table.width < ball.x) {
          if (ball.x < 0) {
            setScore((prev: ScoreType): ScoreType => {
              return {
                leftPlayer: { ...prev.leftPlayer },
                rightPlayer: {
                  ...prev.rightPlayer,
                  points: prev.rightPlayer.points + 1,
                },
              };
            });
          } else if (table.width < ball.x) {
            setScore((prev: ScoreType): ScoreType => {
              return {
                leftPlayer: {
                  ...prev.leftPlayer,
                  points: prev.leftPlayer.points + 1,
                },
                rightPlayer: { ...prev.rightPlayer },
              };
            });
          }
          ball.reset();
          ball.direction *= -1;
        }
        table.drawNewFrame(ball, left_paddle, right_paddle);
        animationId = requestAnimationFrame(gameLoop);
      }
    }

    animationId = requestAnimationFrame(gameLoop);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  } else {
    setMatchState('Fail to initiate the game!!');
  }
}
