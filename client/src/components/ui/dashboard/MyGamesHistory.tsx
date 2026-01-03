import type { User } from '@/App';
import ChessHistory from '../game/ChessHistory';
import PongHistory from '../game/PongHistory';

interface MyGamesHistoryProps {
  type: string;
  userData: User | null;
  matchData: any;
}

export default function MyGamesHistory({type, userData, matchData} : MyGamesHistoryProps) {
  if (type === "chess")
    return <ChessHistory userData={userData} matchData={matchData} />
  else
    return <PongHistory userData={userData} matchData={matchData} />
}
