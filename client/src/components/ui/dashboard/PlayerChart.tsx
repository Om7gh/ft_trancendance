import ChessChart from '../game/ChessChart';
import PongChart from '../game/PongChart';

export default function PlayerChart({type, data}: {type: string, data: any}) {
  if (type === "chess")
   return <ChessChart gameState={data} />
  else if (type === "pingpong")
    return <PongChart gameState={data}  />
}
