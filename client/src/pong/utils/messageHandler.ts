import type { CustomizationType, ScoreType } from "../types/playMatch";
import type { Paddle, Ball} from '../types/match.ts';

function drawBall(
  ball: Ball,
  context: CanvasRenderingContext2D | null,
  color: string,
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
  color: string,
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

function drawTableEdges(
  context: CanvasRenderingContext2D,
  color: string,
) {

  context.strokeStyle = color;
  context.lineWidth = 4;
  context.strokeRect(0, 0, 700, 400);

  context.beginPath();
  context.moveTo(350, 0);
  context.lineTo(350, 400);
  context.stroke();
}

export default function messageHandler(
  event: MessageEvent,
  context: CanvasRenderingContext2D,
  setScore: (value: ScoreType) => void,
  setMatchState: (value: string) => void,
  setError: (value: string) => void,
  customization: CustomizationType | null,
) {
  let message = JSON.parse(event.data);

  if (message && (message.state === 'ok')) {
    if (message.data.event === 'matchState') {
      setMatchState(message.data.value);
    } else if (message.data.event === 'updateScore') {
      setScore({
        leftPlayer: message.data.leftPlayer,
        rightPlayer: message.data.rightPlayer,
      });
    } else if (message.data.event === 'updateView') {
      context.clearRect(0, 0, 700, 400);
      drawTableEdges(context, customization?.table_edges_color ?? "white");
      drawBall(message.data.ball, context, customization?.ball_color ?? "orange");
      drawPaddle(message.data.leftPaddle, context, customization?.left_paddle_color ?? "green");
      drawPaddle(message.data.rightPaddle, context, customization?.right_paddle_color ?? "red");
    }
  } else {
      setError("Error during the match!!");
  }
}