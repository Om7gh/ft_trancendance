import { useState } from "react";

const LatestGames = [
  {
    id: 1,
    player: "omar",
    opponent: "karim",
    myPoint: 5,
    opponentPoint: 2,
    isWinning: true,
    date: "18 aug, 2025",
  },
  {
    id: 2,
    player: "omar",
    opponent: "ali",
    myPoint: 5,
    opponentPoint: 7,
    isWinning: false,
    date: "16 aug, 2025",
  },
  {
    id: 3,
    player: "omar",
    opponent: "otman",
    myPoint: 5,
    opponentPoint: 2,
    isWinning: true,
    date: "18 aug, 2025",
  },
];

export default function MyGamesHistory() {
  const [latestGames] = useState(LatestGames);

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">
          <span className="text-teal-400">Match</span> History
        </h3>
        <span className="text-sm bg-slate-800 px-3 py-1 rounded-full text-slate-300">
          Last {latestGames.length} games
        </span>
      </div>

      <div className="space-y-3">
        {latestGames.map((game) => (
          <div
            key={game.id}
            className={`p-4 rounded-lg transition-all hover:scale-[1.01] ${
              game.isWinning
                ? "bg-teal-900/20 border-l-4 border-teal-500"
                : "bg-rose-900/20 border-l-4 border-rose-500"
            }`}>
            <div className="grid grid-cols-3 items-center gap-4">
              {/* Players */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    game.isWinning ? "bg-teal-400" : "bg-rose-400"
                  }`}></div>
                <div>
                  <p className="font-medium text-white">{game.player}</p>
                  <p className="text-xs text-slate-400">vs {game.opponent}</p>
                </div>
              </div>

              <div className="text-center">
                <span
                  className={`text-2xl font-bold ${
                    game.isWinning ? "text-teal-400" : "text-rose-400"
                  }`}>
                  {game.myPoint}
                </span>
                <span className="mx-2 text-slate-400">:</span>
                <span className="text-2xl font-bold text-white">
                  {game.opponentPoint}
                </span>
              </div>

              {/* Date & Status */}
              <div className="flex flex-col items-end">
                <span className="text-sm text-slate-400">{game.date}</span>
                <span
                  className={`mt-1 text-xs px-2 py-1 rounded-full ${
                    game.isWinning
                      ? "bg-teal-500/20 text-teal-400"
                      : "bg-rose-500/20 text-rose-400"
                  }`}>
                  {game.isWinning ? "Victory" : "Defeat"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
