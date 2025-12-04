import { useState, useRef, useEffect } from 'react';

import { Match } from './match.tsx';
import { MessageDisplayer } from './playWithSomeOne.tsx';

import type { MatchType } from './playWithSomeOne.tsx';

function messageHandler(
  event: MessageEvent,
  setMatchState: (value: string) => void
) {
  const message = JSON.parse(event.data);

  if (message.state != 'ok') {
    setMatchState(message.reason);
  } else if (message.data.event === 'startMatch') {
    setMatchState('going');
  }
}

function createConnection(
  connection: { ws: WebSocket | null },
  setMatchState: (value: string) => void,
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
  connection.ws.onmessage = (event) => messageHandler(event, setMatchState);

  return () => {
    if (connection.ws) {
      connection.ws.close(1000, 'Close socket');
    }
  };
}

type PlayMatchPropsType = {
  match: MatchType;
};

export function PlayMatch({ match }: PlayMatchPropsType) {
  const connection = useRef<{ ws: WebSocket | null }>({ ws: null });
  const [matchState, setMatchState] = useState(
    'Waiting for Opponent to join match...'
  );
  const url = `http://localhost:8080/pongGame/remote/join?uid=${match.uid}&rid=${match.rid}`;

  useEffect(() => {
    try {
      return createConnection(connection.current, setMatchState, url);
    } catch (err) {
      if (connection.current.ws) {
        connection.current.ws.close(1000, 'Close socket');
      }
      setMatchState('Error thrown on the match!!');
    }
  }, [url]);

  if (matchState === 'going' || matchState === 'done') {
    return (
      <Match
        connection={connection.current.ws!}
        matchState={matchState}
        setMatchState={setMatchState}
      />
    );
  }

  return <MessageDisplayer message={matchState} />;
}
