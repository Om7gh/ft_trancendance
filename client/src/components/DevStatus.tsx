// no explicit React import needed with modern TSX
import { useChessStore } from '../store/useChessStore';

export function DevStatus({
    myTeam,
    opponentConnected,
    roomId,
}: {
    myTeam: 'WHITE' | 'BLACK' | null;
    opponentConnected: boolean;
    roomId: string | null;
}) {
    const currentTurn = useChessStore((s) => s.currentTurn);
    const turns = useChessStore((s) => s.turns);

    if (import.meta.env.PROD) return null;

    return (
        <div className="fixed bottom-2 left-2 z-50 text-xs text-slate-200 bg-slate-900/70 border border-slate-700 rounded px-3 py-2">
            <div>
                roomId: <span className="text-yellow-400">{roomId ?? '—'}</span>
            </div>
            <div>
                myTeam: <span className="text-neon">{myTeam ?? '—'}</span>
            </div>
            <div>
                opponent:{' '}
                <span
                    className={
                        opponentConnected
                            ? 'text-violet-400'
                            : 'text-violet-400'
                    }
                >
                    {opponentConnected ? 'connected' : 'waiting'}
                </span>
            </div>
            <div>
                turn: <span className="text-amber-300">{currentTurn}</span> (#
                {turns})
            </div>
        </div>
    );
}

export default DevStatus;
