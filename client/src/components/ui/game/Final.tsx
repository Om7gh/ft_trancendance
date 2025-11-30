import type { Tournaments } from '@/types/gameTypes';
import Participant from './Participant';
import { GiChessKing } from 'react-icons/gi';

function DemiFinal({ players }: Tournaments) {
  let final = [];
  for (let i = 0; i < players.length; i++)
    if (i === players.length - 1) final.push(players[i]);
  return (
    <div className="flex flex-col gap-5 relative">
      <GiChessKing className="absolute text-4xl text-amber-500 -top-5 -left-5 -rotate-45" />
      <Participant player={final[0]} />
    </div>  
  );
}

export default DemiFinal;
