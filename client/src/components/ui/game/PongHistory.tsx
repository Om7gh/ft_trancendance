import type { User } from '@/App';
import { PiPingPongBold } from 'react-icons/pi';

interface PongMatch {
  id: string;
  leftPlayer: User;
  rightPlayer: User;
  winner: string;
  score: string;
  createdAt: number;
}

interface PongHistoryProps {
  userData: User | null;
  matchData: {
    wins: number;
    loses: number;
    matches: PongMatch[];
  };
}

function ResultBadge({ win }: { win: boolean }) {
  return (
    <span
      className={`px-3 py-1 text-xs font-medium tracking-wide shadow-xl ${
        win
          ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
          : ' text-pink-300'
      }`}
    >
      {win ? 'VICTORY' : 'DEFEAT'}
    </span>
  );
}

function PongHistory({userData, matchData}: PongHistoryProps) {

  console.log(matchData)
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const totalGames = matchData?.wins || 0 + matchData?.loses || 0;

  return (
    <div className="relative border border-violet-500/30 bg-slate-950/30 p-6 shadow-xl shadow-slate-800 h-96 overflow-auto rounded-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,.15),transparent_60%)]" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-500/15 border border-violet-500/30">
              <PiPingPongBold className="text-xl text-violet-300" />
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-wide text-violet-200">
                Pong History
              </h3>
              <p className="text-xs text-slate-400">
                {totalGames} games
              </p>
            </div>
          </div>
        </div>

        {matchData?.matches?.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No pong games played yet
          </div>
        ) : (
          <div className="space-y-3">
            {matchData?.matches?.map((game) => {
              const isWinning = game?.winner === userData?.username || game?.winner === String(userData?.id);
              const opponent = game?.leftPlayer.id === userData?.id ? game?.rightPlayer.username : game?.leftPlayer.username;

              return (
                <div
                  key={game?.id}
                  className={`border p-4 transition-all hover:scale-[1.01] hover:shadow-xl ${
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
                        <p className="font-medium text-slate-100">{userData?.username}</p>
                        <p className="text-xs text-slate-400">vs {opponent}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-lg font-bold text-slate-100">
                        {game?.score}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">Final Score</p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-slate-400">{formatDate(game?.createdAt)}</span>
                      <ResultBadge win={isWinning} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PongHistory