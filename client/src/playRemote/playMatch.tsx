import { useState, useRef, useEffect } from 'react';

import { Match } from './match.tsx';
import { MessageDisplayer } from './playWithSomeOne.tsx';

import type { MatchType } from './playWithSomeOne.tsx';

function messageHandler(
  event: MessageEvent,
  setMatchState: (value: string) => void,
  setScore: (value: ScoreType) => void
) {
  const message = JSON.parse(event.data);

  if (message.state != 'ok') {
    setMatchState(message.reason);
  } else if (message.data.event === 'matchState') {
    setMatchState(message.data.value);
  } else if (message.data.event === 'updateScore') {
    setScore({
      leftPlayer: message.data.leftPlayer,
      rightPlayer: message.data.rightPlayer,
    });
  }
}

function createConnection(
  connection: { ws: WebSocket | null },
  setMatchState: (value: string) => void,
  setScore: (value: ScoreType) => void,
  url: string
) {
  connection.ws = new WebSocket(url);

  if (!connection.ws) {
    setMatchState('Fail to establish connection to server!!');
  }

  connection.ws.onerror = () =>
    setMatchState('Error happens with connection!!');
  connection.ws.onopen = () => console.log('Connection is established');
  connection.ws.onclose = () => console.log('Connection is closed');
  connection.ws.onmessage = (event) =>
    messageHandler(event, setMatchState, setScore);

  return () => {
    if (connection.ws) {
      connection.ws.close(1000, 'Close socket');
    }
  };
}

export type ScoreType = {
  leftPlayer: number;
  rightPlayer: number;
};

type PlayMatchPropsType = {
  match: MatchType;
};

export function PlayMatch({ match }: PlayMatchPropsType) {
  const connection = useRef<{ ws: WebSocket | null }>({ ws: null });
  const [matchState, setMatchState] = useState('Waiting for Opponent to join match...');
  const [score, setScore] = useState<ScoreType | null>(null);
  const url = `http://localhost:8080/pongGame/remote/join?rid=${match.roomId}`;

  useEffect(() => {
    try {
      return createConnection(connection.current, setMatchState, setScore, url);
    } catch (err) {
      if (connection.current.ws) {
        connection.current.ws.close(1000, 'Close socket');
      }
      setMatchState('Error thrown on the match!!');
    }
  }, [url]);

  if (
    matchState === 'going' ||
    matchState === 'pause' ||
    matchState === 'done'
  ) {
    return (
      <Match
        connection={connection.current.ws!}
        score={score!}
        matchState={matchState}
        match={match}
        setScore={setScore}
        setMatchState={setMatchState}
      />
    );
  }

  return <MessageDisplayer message={matchState} />;
}
