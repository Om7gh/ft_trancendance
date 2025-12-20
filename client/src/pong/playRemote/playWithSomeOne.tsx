import { useState, useEffect } from 'react';
import { PlayMatch } from './playMatch.tsx';
import { RxLapTimer } from 'react-icons/rx';

import axiosApiInstance from '@/axiosApiInstance.ts';

type MessageDisplayerPropsType = {
  message: string;
};

export type ErrorType = {
  reason: string;
  errorCode: string;
};

export function MessageDisplayer({ message }: MessageDisplayerPropsType) {
  return (
    <div className=" bg-slate-950/60 shadow-xl shadow-slate-900 text-violet-200 px-2 py-6 text-xl flex gap-5 justify-center items-center">
      <RxLapTimer className="w-8 h-8" />
      <p className="">{message}</p>
    </div>
  );
}

export type PlayerType = {
  id: string;
  name: string;
  avatar: string;
};

export type MatchType = {
  roomId: string;
  leftPlayer: PlayerType;
  rightPlayer: PlayerType;
};

export function validatePlayer(player: PlayerType) {
  if (!player || !player.id || !player.name)
    return false;
  return true;
}

export function validateMatch(match: MatchType) {
  console.log(match);
  if (
    !match ||
    !match.roomId ||
    !validatePlayer(match.leftPlayer) ||
    !validatePlayer(match.rightPlayer)
  )
    return false;
  return true;
}

export function PlayWithSomeOne() {
  const [error, setError] = useState<ErrorType | null>(null);
  const [match, setMatch] = useState<MatchType | undefined>(undefined);
  const url = `/pongGame/remote/someone`;

  useEffect(() => {
    let ignored = false;
    (async function fetchMatch() {
      try {
        const response = await axiosApiInstance.get(url);
        if (!ignored && response) {
          if (response.status === 200) {
            if (!validateMatch(response.data)) {
              setError({
                reason: 'Error: fetch invalid match',
                errorCode: 'E111',
              });
              return;
            }
            setMatch(response.data);
          } else
            setError(response.data);
        }
      } catch (err) {
        setError({ reason: 'Fail to fetch match!!', errorCode: 'E111' });
      }
    })();

    return () => {
      ignored = true;
    };
  }, []);

  if (error)
    return <MessageDisplayer message={error.reason + ' ' + error.errorCode} />;
  else if (match) return <PlayMatch match={match} />;

  return <MessageDisplayer message={'Waiting for opponent...'} />;
}
