import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { PlayMatch } from './playMatch.tsx';
import { GlobalContext } from './main.tsx';
import { useNavigate } from 'react-router-dom';

type MessageDisplayerPropsType = {
  message: string;
};

export function MessageDisplayer({ message }: MessageDisplayerPropsType) {
  return (
    <div className="bg-slate-900/20 shadow-lg shadow-slate-900 text-violet-100 text-center px-2 py-6 my-5 ">
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
  const navigate = useNavigate();
  const { userId } = useContext(GlobalContext);
  const [message, setMessage] = useState<string>('Waiting for Opponent...');
  const [match, setMatch] = useState<MatchType | undefined>(undefined);
  const url = `http://localhost:8080/pongGame/remote/someone?uid=${userId}`;

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

  return (
    <div>
      <MessageDisplayer message={message} />
      <button
        className="m-auto block bg-slate-950 text-violet-500 px-4 py-2  shadow-lg shadow-slate-900/50 cursor-pointer  hover:scale-[1.1] duration-200 w-72"
        onClick={() => navigate(-1)}
      >
        back
      </button>
    </div>
  );
}
