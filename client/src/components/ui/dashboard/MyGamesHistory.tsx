import { GlobalContext } from '@/App';
import { useContext } from 'react';
import ChessHistory from '../game/ChessHistory';
import PongHistory from '../game/PongHistory';



export default function MyGamesHistory({type} : {type: string}) {
  const {user} = useContext(GlobalContext)
  if (type === "chess")
    return <ChessHistory user={user} />
  else
      return <PongHistory user={user} />
}
