import type { User } from '@/App';
import { FaChess } from 'react-icons/fa';

interface ChessMatch {
  blackPlayerId: string,
      endedAt: number,
      id: number,
      opponent: string,
      moves: number,
      reason: string,
      result: string,
      roomId: string,
      startedAt: number,
      whitePlayerId: string,
      winnerTeam: string
}

interface ChessHistoryProps {
  userData: User | null;
  matchData: {
    stats: {
      totalGames: number;
      wins: number;
      losses: number;
      draws: number;
      winRate: string;
    },
    history: ChessMatch[]
  };
}

function ResultBadge({ win }: { win: boolean }) {
  return (
    <span
      className={`px-3 py-1 text-xs font-medium tracking-wide border shadow-xl ${
        win
          ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
          : 'bg-pink-500/15 text-pink-300 border-pink-500/30'
      }`}
    >
      {win ? 'VICTORY' : 'DEFEAT'}
    </span>
  );
}


function ChessHistory({userData, matchData}: ChessHistoryProps) {  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  console.log(matchData)

  return (
    <div className="relative  border border-violet-500/30 bg-slate-950/30 p-6  shadow-xl shadow-slate-800 h-96 overflow-auto">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(168,85,247,.15),_transparent_60%)]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3  bg-violet-500/15 border border-violet-500/30">
              <FaChess className="text-xl text-violet-300" />
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-wide text-violet-200">
                Chess History
              </h3>
              <p className="text-xs text-slate-400">
                {matchData?.stats.totalGames} games
              </p>
            </div>
          </div>
        </div>

        {matchData.history.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No chess games played yet
          </div>
        ) : (
        <div className="space-y-3">
          {matchData.history.map((game : ChessMatch) => {
            const isWinning = game.result === 'WIN';
            const playerName = userData?.username || '';
            
            return (
              <div
                key={game.id}
                className={` border p-4 transition-all hover:scale-[1.01] hover:shadow-xl ${
                  isWinning
                    ? 'border-violet-500/30 bg-violet-500/10'
                    : 'border-pink-500/50 bg-pink-500/10'
                }`}
              >
                <div className="grid grid-cols-3 items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 shadow-[0_0_10px] ${
                        isWinning
                          ? 'bg-violet-400 shadow-violet-400/60'
                          : 'bg-pink-400 shadow-pink-400/60'
                      }`}
                    />
                    <div>
                      <p className="font-medium text-slate-100">{playerName}</p>
                      <p className="text-xs text-slate-400">vs {game.opponent}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-lg font-bold text-slate-100">
                      {game.moves} moves
                    </span>
                    <p className="text-xs text-slate-400 mt-1">{game.reason}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-slate-400">{formatDate(game.startedAt)}</span>
                    <ResultBadge win={isWinning} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>)
}

export default ChessHistory