import type { TournamentPlayer, Tournaments } from '@/types/gameTypes';
import Participant from './Participant';

function FirstRound({ players }: Tournaments) {
  return (
    <div className="flex row-start-1 row-end-2 items-center gap-4">
      {players.map((player: TournamentPlayer, i: number) => (
        <>
          <Participant player={player} key={i} index={i} />
          {i % 2 === 0 && <p className="text-center text-violet-200 text-xl">vs</p>}
        </>
      ))}
    </div>
  );
}

export default FirstRound;
