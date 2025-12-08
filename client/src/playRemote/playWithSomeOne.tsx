import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { PlayMatch } from './playMatch.tsx';
import { useTransStore } from '@/store/useTransStore.ts';
import { GlobalContext } from '@/App.tsx';

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

function validateFetchedMatch(match: MatchType): boolean {
  if (!match.uid || typeof match.uid !== 'string') return false;
  else if (!match.oid || typeof match.oid !== 'string') return false;
  else if (!match.rid || typeof match.rid !== 'string') return false;
  return true;
}

export type MatchType = {
  uid: string | undefined;
  oid: string | undefined;
  rid: string | undefined;
};

type FetchMatchArgsType = {
  setMessage: (value: string) => void;
  setMatch: (value: MatchType) => void;
  ignored: { state: boolean };
  url: string;
};

async function fetchMatch({
  setMessage,
  setMatch,
  ignored,
  url,
}: FetchMatchArgsType) {
  try {
    const response = await axios.get(url);

    if (!ignored.state) {
      if (response.status === 200) {
        if (!validateFetchedMatch(response.data)) {
          setMessage('Invalid match was fetched!!');
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
  const { user } = useContext(GlobalContext) || {
    id: 'c23902d54bd696ea43b95e4c348007b3',
  };
  const [message, setMessage] = useState<string>('Waiting for Opponent...');
  const [match, setMatch] = useState<MatchType | undefined>(undefined);
  const url = `http://localhost:8080/pongGame/remote/someone?uid=${user?.id}`;
  console.log(user!);
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
