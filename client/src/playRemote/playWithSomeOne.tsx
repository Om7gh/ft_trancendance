import axios from 'axios';
import { useState, useEffect } from 'react';
import { PlayMatch } from './playMatch.tsx';

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

export type PlayerType = {
  name: string;
  avatar: string;
}

export type MatchType = {
  roomId: string;
  leftPlayer: PlayerType;
  rightPlayer: PlayerType;
};

function validatePlayer(player: PlayerType) {
  if (!player || !player.name || !player.avatar)
    return (false);
  return (true);
}

function validateMatch(match: MatchType) {
  if (!match || !match.roomId || !validatePlayer(match.leftPlayer) || !validatePlayer(match.rightPlayer))
    return (false);
  return (true);
}

type FetchMatchArgsType = {
  setMessage: (value: string) => void;
  setMatch: (value: MatchType) => void;
  ignored: { state: boolean };
  url: string;
};

async function fetchMatch({
  setMessage, setMatch, ignored,url, }: FetchMatchArgsType) {

  try {
    const response = await axios.get(url, {
      withCredentials: true
    });


    if (!ignored.state) {
      if (response.status === 200) {
        if (!validateMatch(response.data)) {
          setMessage('Error: fetched an invalid match!!');
          return;
        }
        setMatch(response.data);
      } else {
        setMessage('Waiting too long try after few seconds!!');
      }
    }
  } catch (err) {
    setMessage('Fail to fetch match!!');
  }
}

export function PlayWithSomeOne() {
  const [message, setMessage] = useState<string>('Waiting for Opponent...');
  const [match, setMatch] = useState<MatchType | undefined>(undefined);
  const url = `http://localhost:8080/pongGame/remote/someone`;
  
  useEffect(() => {
    const ignored = { state: false };

    fetchMatch({
      setMessage: setMessage,
      setMatch: setMatch,
      ignored: ignored,
      url: url,
    });

    return () => {
      ignored.state = true;
    };
  }, []);

  if (match) {
    return <PlayMatch match={match} />;
  }

  return <MessageDisplayer message={message} />;
}
