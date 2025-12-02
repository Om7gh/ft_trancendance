import LocalGame from '@/components/ui/game/LocalGame';
import NormalGame from '@/components/ui/game/NormalGame';
import Tournament from '@/components/ui/game/Tournament';
import TournamentHistory from '@/components/ui/game/TournamentHistory';
import { Outlet } from 'react-router-dom';

function PingPong() {
  return (
    <div className="flex justify-center gap-y-25 flex-col items-center h-full">
      <p className="bg-gradient-to-r from-neon to-violet-400 bg-clip-text text-transparent text-3xl text-shadow-md">
        Choose your battle !
      </p>
      <div className="space-y-12 flex flex-col text-center">
        <NormalGame />
        <Tournament />
        <div className="h-[0.5px] w-full bg-slate-100/80"></div>
        <TournamentHistory />
        <LocalGame />
      </div>
      <Outlet />
    </div>
  );
}

export default PingPong;
