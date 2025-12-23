import type { ScoreType } from "../types/playMatch";
import type { Paddle, Ball} from '../types/match.ts';

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

function drawPaddle(
  paddle: Paddle,
  context: CanvasRenderingContext2D,
) {
  if (paddle && context) {
    context.beginPath();
    context.strokeStyle = paddle.color;
    context.lineWidth = paddle.width;
    context.moveTo(paddle.x, paddle.y);
    context.lineTo(paddle.x, paddle.y + paddle.height);
    context.closePath();
    context.stroke();
  }
}

export default function messageHandler(
  event: MessageEvent,
  context: CanvasRenderingContext2D,
  setScore: (value: ScoreType) => void,
  setMatchState: (value: string) => void,
  setError: (value: string) => void
) {
  let message = JSON.parse(event.data);

  if (message.state === 'ok') {
    if (message.data.event === 'matchState') {
      setMatchState(message.data.value);
    } else if (message.data.event === 'updateScore') {
      setScore({
        leftPlayer: message.data.leftPlayer,
        rightPlayer: message.data.rightPlayer,
      });
    } else if (message.data.event === 'updateView') {
      context.clearRect(0, 0, 700, 400);
      drawBall(message.data.ball, context, 'orange');
      drawPaddle(message.data.leftPaddle, context);
      drawPaddle(message.data.rightPaddle, context);
    }
  } else {
    if (message.reason) {
      setError(message.reason);
    }
  }
}