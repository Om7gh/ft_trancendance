import { useState} from 'react';

import type { MatchType } from '../types/playWithSomeOne.ts';

import PlayMatch from './playMatch.tsx';
import useFetchMatch from '../hooks/useFetchMatch.ts';
import MessageDisplayer from '../component/MessageDisplayer.tsx';

export default function PlayWithSomeOne() {
  const [error, setError] = useState<string | null>(null);
  const [match, setMatch] = useState<MatchType | null>(null);
  const url = `/pongGame/remote/someone`;

  useFetchMatch(url, setMatch, setError);

  if (error)
    return <MessageDisplayer message={error} />;
  else if (match)
    return <PlayMatch match={match} />;

  return <MessageDisplayer message={'Waiting for opponent...'} />;
}
