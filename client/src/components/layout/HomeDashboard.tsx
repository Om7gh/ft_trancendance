import { useState } from 'react';
import MyGamesHistory from '../ui/dashboard/MyGamesHistory';
import PlayerChart from '../ui/dashboard/PlayerChart';
import PlayerStatistics from '../ui/dashboard/PlayerStatictics';
import TopPlayers from '../ui/dashboard/TopPlayers';
import DashboardWrapper from './DashboardWrapper';
import { GiChessQueen } from 'react-icons/gi';
import { FaTableTennisPaddleBall } from 'react-icons/fa6';

type GameType = 'pingpong' | 'chess';

export default function HomeDashboard() {
  const [activeGame, setActiveGame] = useState<GameType>('pingpong');

  return (
    <div className="h-full p-5 space-y-6 overflow-auto">
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveGame('pingpong')}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300
            ${
              activeGame === 'pingpong'
                ? 'bg-gradient-to-r from-violet-500 to-neon text-white shadow-lg shadow-violet-500/50'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
            }`}
        >
          PingPong Stats
        </button>
        <button
          onClick={() => setActiveGame('chess')}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300
            ${
              activeGame === 'chess'
                ? 'bg-gradient-to-r from-violet-500 to-neon text-white shadow-lg shadow-violet-500/50'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
            }`}
        >
          Chess Stats
        </button>
      </div>

      <DashboardWrapper
        isVisible={activeGame === 'pingpong'}
        title="PingPong Dashboard"
        icon={<FaTableTennisPaddleBall />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlayerChart />
          <PlayerStatistics />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <MyGamesHistory />
          <TopPlayers />
        </div>
      </DashboardWrapper>

      <DashboardWrapper
        isVisible={activeGame === 'chess'}
        title="Chess Dashboard"
        icon={<GiChessQueen />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlayerChart />
          <PlayerStatistics />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <MyGamesHistory />
          <TopPlayers />
        </div>
      </DashboardWrapper>
    </div>
  );
}
