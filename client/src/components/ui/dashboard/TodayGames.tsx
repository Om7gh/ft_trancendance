import { useState, useMemo } from 'react';

interface GameData {
  date: string; // "YYYY-MM-DD"
  count: number; // number of games played
}

function TodayGames() {
  // Mock data
  const [gameData] = useState<GameData[]>([
    { date: '2025-01-05', count: 3 },
    { date: '2025-01-12', count: 5 },
    { date: '2025-01-20', count: 2 },
    { date: '2025-02-08', count: 4 },
    { date: '2025-02-15', count: 1 },
    { date: '2025-03-10', count: 6 },
    { date: '2025-03-22', count: 2 },
    { date: '2025-04-05', count: 3 },
    { date: '2025-05-18', count: 5 },
    { date: '2025-06-03', count: 4 },
  ]);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const maxGames = useMemo(() => {
    return Math.max(...gameData.map((g) => g.count), 1);
  }, [gameData]);

  const gameMap = useMemo(() => {
    const map: Record<string, number> = {};
    gameData.forEach((g) => {
      map[g.date] = g.count;
    });
    return map;
  }, [gameData]);

  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-slate-800/30 border-slate-700/30';

    const intensity = (count / maxGames) * 100;

    if (intensity <= 20) return 'bg-violet-900/40 border-violet-700/40';
    if (intensity <= 40) return 'bg-violet-700/60 border-violet-600/60';
    if (intensity <= 60) return 'bg-violet-600/80 border-violet-500/80';
    if (intensity <= 80) return 'bg-violet-500 border-violet-400';
    return 'bg-gradient-to-br from-violet-500 to-neon border-neon/50';
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full space-y-6 px-5 ">
      <h2 className="text-lg bg-linear-0 from-violet-500 to-neon bg-clip-text text-transparent">
        Games Activity {currentYear}
      </h2>

      <div className="overflow-x-auto pb-4 -mx-6 px-6">
        <div className="flex gap-8 min-w-max">
          {months.map((month, monthIndex) => (
            <div
              key={month}
              className="grid flex-col items-start space-y-3 hover:bg-slate-950/10 p-5"
            >
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider h-5">
                {month}
              </h3>

              <div className="grid gap-1 grid-cols-6">
                {Array.from({ length: daysInMonth[monthIndex] }, (_, i) => {
                  const day = i + 1;
                  const dateStr = `${currentYear}-${String(
                    monthIndex + 1
                  ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const gameCount = gameMap[dateStr] || 0;

                  return (
                    <div
                      key={`${month}-${day}`}
                      className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded border text-[10px] transition-all duration-200
                        ${getColorClass(gameCount)}
                        hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:scale-125
                        cursor-pointer group relative`}
                      title={`${month} ${day}: ${gameCount} ${
                        gameCount === 1 ? 'game' : 'games'
                      }`}
                    >
                      <span className="text-[9px] font-medium text-slate-200 group-hover:text-white">
                        {day}
                      </span>

                      {gameCount > 0 && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-violet-500 px-2 py-1 rounded text-xs text-white whitespace-nowrap pointer-events-none z-10">
                          {gameCount} {gameCount === 1 ? 'game' : 'games'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-700/30 flex-wrap">
        <span className="text-xs text-slate-400 font-medium">Activity:</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-800/30" />
          <span className="text-xs text-slate-400">None</span>
        </div>
        <div className="w-px h-4 bg-slate-700/30" />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-violet-900/40" />
          <span className="text-xs text-slate-400">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-violet-600/80" />
          <span className="text-xs text-slate-400">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-violet-500 to-neon" />
          <span className="text-xs text-slate-400">Very High</span>
        </div>
      </div>
    </div>
  );
}

export default TodayGames;
