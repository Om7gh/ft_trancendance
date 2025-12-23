import { useEffect, useRef } from "react";

import type { RefObject } from "react";
import type { ScoreType } from "../types/playMatch";

import { Events } from "../playLocal/classes";
import messageHandler from "../utils/messageHandler";
import { createRenderingContext } from "../utils/utils";

const events = new Events();

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

function sendEvents(ws: WebSocket, matchState: string) {
  if (events && matchState === 'going') {
    if (events['w'] || events['arrowup']) {
      ws.send(JSON.stringify({
          type: 'move',
          data: { move: 'up' },
        })
      );
    }
    if (events['s'] || events['arrowdown']) {
      ws.send(JSON.stringify({
          type: 'move',
          data: { move: 'down' },
        })
      );
    }
  }
}

export default function useSynchronization(
  connection: WebSocket,
  canvas: RefObject<HTMLCanvasElement | null>,
  matchState: string,
  setScore: (value: ScoreType) => void,
  setMatchState: (value: string) => void,
  setError: (RxValue: string) => void 
) {
    const context = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        let intervalId = null;
        context.current = createRenderingContext(canvas.current);
        
        connection.onmessage = (event) => {
            messageHandler(
                event,
                context.current!,
                setScore,
                setMatchState,
                setError
            );
        };
        
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('keydown', handleKeyDown);
        intervalId = setInterval(() => sendEvents(connection, matchState), 30);
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            connection.onmessage = null;
            clearInterval(intervalId);
        };
    })
}
