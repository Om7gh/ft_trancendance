import type { TournamentPlayer, Tournaments } from '@/types/gameTypes';
import Participant from './Participant';


function DemiFinal({ players }: Tournaments) {
  let demiFinal = [];
  for (let i = 0; i < players.length; i++)
    if (i % 2) demiFinal.push(players[i]);
  return (
    <div className="flex flex-col gap-5">
      {demiFinal.map((player: TournamentPlayer, i: number) => (
        <>
          <Participant player={player} key={i} index={i} />
          {i % 2 === 0 && <p className="text-center text-slate-100">vs</p>}
        </>
      ))}
    </div>
  );
}

export default DemiFinal;
