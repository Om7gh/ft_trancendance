import type { TournamentPlayer, Tournaments } from '@/types/gameTypes';
import Participant from './Participant';

function FirstRound({ players }: Tournaments) {
  return (
    <div className="flex flex-col gap-5">
      {players.map((player: TournamentPlayer, i: number) => (
        <>
          <Participant player={player} key={i} index={i} />
          {i % 2 === 0 && <p className="text-center text-slate-100">vs</p>}
          {i === 1 && <div className="h-[0.5px] bg-slate-200 w-full"></div>}
        </>
      ))}
    </div>
  );
}

export default FirstRound;
