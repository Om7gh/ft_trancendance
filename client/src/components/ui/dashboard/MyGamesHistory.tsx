import { useState } from 'react';
import { PiPingPongBold } from 'react-icons/pi';

const LatestGames = [
  {
    id: 1,
    player: 'omar',
    opponent: 'karim',
    myPoint: 5,
    opponentPoint: 2,
    isWinning: true,
    date: '18 Aug, 2025',
  },
  {
    id: 2,
    player: 'omar',
    opponent: 'ali',
    myPoint: 5,
    opponentPoint: 7,
    isWinning: false,
    date: '16 Aug, 2025',
  },
  {
    id: 3,
    player: 'omar',
    opponent: 'otman',
    myPoint: 5,
    opponentPoint: 2,
    isWinning: true,
    date: '18 Aug, 2025',
  },
];

function ResultBadge({ win }: { win: boolean }) {
  return (
    <span
      className={`px-3 py-1 text-xs font-medium tracking-wide border shadow-xl ${
        win
          ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
      }`}
    >
      {win ? 'VICTORY' : 'DEFEAT'}
    </span>
  );
}

export default function MyGamesHistory() {
  const [latestGames] = useState(LatestGames);

  return (
    <div className="relative  border border-violet-500/30 bg-slate-950/60 p-6 shadow-xl overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(168,85,247,.15),_transparent_60%)]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3  bg-violet-500/15 border border-violet-500/30">
              <PiPingPongBold className="text-xl text-violet-300" />
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-wide text-violet-200">
                Match History
              </h3>
              <p className="text-xs text-slate-400">
                Last {latestGames.length} games
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {latestGames.map((game) => (
            <div
              key={game.id}
              className={` border p-4 transition-all hover:scale-[1.01] hover:shadow-xl ${
                game.isWinning
                  ? 'border-violet-500/30 bg-violet-500/10'
                  : 'border-rose-500/30 bg-rose-500/10'
              }`}
            >
              <div className="grid grid-cols-3 items-center gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 shadow-[0_0_10px] ${
                      game.isWinning
                        ? 'bg-violet-400 shadow-violet-400/60'
                        : 'bg-rose-400 shadow-rose-400/60'
                    }`}
                  />
                  <div>
                    <p className="font-medium text-slate-100">{game.player}</p>
                    <p className="text-xs text-slate-400">vs {game.opponent}</p>
                  </div>
                </div>

                <div className="text-center">
                  <span
                    className={`text-2xl font-bold ${
                      game.isWinning ? 'text-violet-300' : 'text-rose-300'
                    }`}
                  >
                    {game.myPoint}
                  </span>
                  <span className="mx-2 text-slate-500">:</span>
                  <span className="text-2xl font-bold text-slate-100">
                    {game.opponentPoint}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-slate-400">{game.date}</span>
                  <ResultBadge win={game.isWinning} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
