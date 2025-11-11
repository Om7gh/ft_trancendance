import { useState, useEffect } from "react";

const Players = [
  {
    username: "adil",
    wins: 56,
    loses: 44,
    draws: 10,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    username: "karim",
    wins: 60,
    loses: 50,
    draws: 10,
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    username: "mouha",
    wins: 13,
    loses: 77,
    draws: 10,
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    username: "jilali",
    wins: 40,
    loses: 44,
    draws: 16,
    avatar: "https://i.pravatar.cc/150?img=12",
  },
];

export default function TopPlayers() {
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    const sorted = [...Players].sort((a, b) => b.wins - a.wins).slice(0, 3);
    setTopPlayers(sorted);
  }, []);

  return (
    <div className="bg-slate-950/40 rounded-xl border border-slate-700 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-white">
          <span className="text-orange-400">Top</span> Players
        </h3>
        <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
          This Season
        </span>
      </div>

      <div className="space-y-4">
        {topPlayers.map((player, index) => (
          <div
            key={player.username}
            className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
            {/* Rank Badge */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                index === 0
                  ? "bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 font-bold"
                  : index === 1
                  ? "bg-gradient-to-br from-slate-400 to-slate-600 text-white"
                  : "bg-gradient-to-br from-amber-800 to-amber-900 text-white"
              }`}>
              #{index + 1}
            </div>

            {/* Player Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={player.avatar}
                alt={player.username}
                className="w-10 h-10 rounded-full border-2 border-teal-500/50"
              />
              <div className="min-w-0">
                <p className="font-medium text-white truncate">
                  {player.username}
                </p>
                <div className="flex gap-2 text-xs text-slate-400">
                  <span>{player.wins}W</span>
                  <span>{player.loses}L</span>
                  <span>{player.draws}D</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-bold text-teal-400">
                {Math.round(
                  (player.wins / (player.wins + player.loses + player.draws)) *
                    100
                )}
                %
              </div>
              <div className="text-xs text-slate-500">Win Rate</div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm font-medium rounded-lg bg-slate-800/50 border border-slate-700 text-teal-400 hover:bg-slate-800/70 transition-colors flex items-center justify-center gap-2">
        View Leaderboard
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
