import { PiPingPongBold } from 'react-icons/pi';
import { FaChess } from 'react-icons/fa';
import { MdAutoAwesome } from 'react-icons/md';
import type { GamesStatisticsProps } from '@/types/gameTypes';

function Progress({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const pct = Math.round((value / Math.max(total, 1)) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between mb-4 text-slate-300">
        <span className="text-md md:text-lg self-end">{label}</span>
        <span className="text-lg md:text-xl bg-violet-700/40 shadow-xl w-7 md:w-10 h-7 md:h-10 grid place-items-center rounded-full">
          {value}
        </span>
      </div>
      <div className="h-4 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-pink-400 shadow-[0_0_10px_rgba(168,85,247,.6)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatHUD({
  title,
  icon: Icon,
  stats,
}: {
  title: string;
  icon: React.ElementType;
  stats: { win: number; lose: number; draw?: number };
}) {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  return (
    <div
      className={`relative  border border-violet-500/40 ${
        title !== 'CHESS' ? 'bg-slate-950/40' : 'bg-violet-950/30'
      } p-6 shadow-xl overflow-hidden shadow-slate-900/60`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(168,85,247,.15),_transparent_60%)]" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3  bg-violet-500/15 border border-violet-500/30">
            <Icon className="text-2xl md:text-5xl text-violet-300" />
          </div>
          <div>
            <h3 className="text-lg md:text-2xl font-semibold tracking-wide text-violet-200">
              {title}
            </h3>
            <p className="text-sm text-slate-400">Total matches: {total}</p>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(stats).map(([k, v]) => (
            <Progress key={k} label={k.toUpperCase()} value={v} total={total} />
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className=" bg-slate-900/60 border border-slate-800 p-3 text-center">
            <p className="text-lg text-slate-400">WIN RATE</p>
            <p className="text-xl font-bold text-violet-300">
              {Math.round(((stats.win || 0) / Math.max(total, 1)) * 100)}%
            </p>
          </div>
          <div className=" bg-slate-900/60 border border-slate-800 p-3 text-center">
            <p className="text-lg text-slate-400">LOSSES</p>
            <p className="text-xl font-bold text-rose-400">{stats.lose || 0}</p>
          </div>
          <div className=" bg-slate-900/60 border border-slate-800 p-3 text-center">
            <p className="text-lg text-slate-400">DRAWS</p>
            <p className="text-xl font-bold text-sky-400">{stats.draw || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GamesStatistics({ chessStats, pongStats }: GamesStatisticsProps) {
  const pong = { win: pongStats.wins, lose: pongStats.loses };
  const chess = { win: chessStats.wins, lose: chessStats.losses, draw: chessStats.draws };
  
  const totalWin = pong.win + chess.win;
  const totalLose = pong.lose + chess.lose;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <StatHUD title="PONG" icon={PiPingPongBold} stats={pong} />
      <StatHUD title="CHESS" icon={FaChess} stats={chess} />
      <StatHUD
        title="Total score"
        icon={MdAutoAwesome}
        stats={{ win: totalWin, lose: totalLose, draw: chess.draw }}
      />
    </div>
  );
}
