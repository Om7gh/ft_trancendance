import { GlobalContext } from '@/App';
import { useContext } from 'react';
import ChessChart from '../game/ChessChart';
import PongChart from '../game/PongChart';

export default function PlayerChart({type}: {type: string}) {
  const {user} = useContext(GlobalContext)
  if (type === "chess")
   return <ChessChart user={user} />
  else if (type === "pingpong")
    return <PongChart user={user} />
}
