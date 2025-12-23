import ChessHistory from '../game/ChessHistory';
import PongHistory from '../game/PongHistory';

interface UserData {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface MyGamesHistoryProps {
  type: string;
  userData: UserData;
  matchData: any;
}

export default function MyGamesHistory({type, userData, matchData} : MyGamesHistoryProps) {
  if (type === "chess")
    return <ChessHistory userData={userData} matchData={matchData} />
  else
    return <PongHistory userData={userData} matchData={matchData} />
}
