import { useState } from 'react';
import type { TournamentPlayer } from '@/types/gameTypes';
import FirstRound from './FirstRound';
import DemiFinal from './DemiFinal';
import Final from './Final';

const mockPlayers = [
  {
    avatar: 'https://avatar.iran.liara.run/public/33',
    username: 'omar',
    gameStatus: 'idle', // 'idle' ´win´ ´lose´
    round: 3,
  },
  {
    avatar: 'https://avatar.iran.liara.run/public/34',
    username: 'karim',
    gameStatus: 'idle',
    round: 1,
  },
  {
    avatar: 'https://avatar.iran.liara.run/public/35',
    username: 'adil',
    gameStatus: 'idle',
    round: 1,
  },
  {
    avatar: 'https://avatar.iran.liara.run/public/36',
    username: 'ibrahim',
    gameStatus: 'idle',
    round: 1,
  },
];

function PlayTournament() {
  const [players, setPlayers] = useState<TournamentPlayer[]>(mockPlayers);
  return (
    <div className="grid place-items-center w-full h-1/2 overflow-auto">
      <div className="grid grid-cols-3 text-center text-slate-300 text-2xl w-[1200px] overflow-auto ">
        {players[0].round >= 1 && <p>Round 1</p>}
        {players[0].round >= 2 && <p>Demi Final</p>}
        {players[0].round == 3 && <p>Winner</p>}
      </div>
      <div className="grid grid-cols-3 place-items-center w-[1200px] overflow-auto">
        {players[0].round >= 1 && <FirstRound players={players} />}
        {players[0].round >= 2 && <DemiFinal players={players} />}
        {players[0].round >= 3 && <Final players={players} />}
      </div>
    </div>
  );
}

export default PlayTournament;
