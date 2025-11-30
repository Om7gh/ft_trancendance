export default function CheckMate({
    winner,
    myTeam,
    onRestart,
}: {
    winner: 'WHITE' | 'BLACK' | 'DRAW' | null;
    myTeam: 'WHITE' | 'BLACK' | null;
    onRestart: () => void;
}) {
    if (winner === null) return <></>;

    const winning =
        winner === 'WHITE' && myTeam === 'WHITE'
            ? 'you win'
            : winner === 'BLACK' && myTeam === 'BLACK'
            ? 'you win'
            : 'you lose';

    const isDraw = winner === 'DRAW';

    return (
        <div className="fixed inset-0 flex justify-center items-center z-[9999] bg-black/60 backdrop-blur-md">
            <div className="relative flex flex-col items-center gap-6 bg-slate-950/70 rounded-2xl shadow-2xl w-[25vmax] py-10 px-6 text-center border border-neon animate-fadeIn">
                <h1 className="text-4xl font-extrabold text-slate-100 drop-shadow-lg">
                    {isDraw ? 'Stalemate' : 'Checkmate'}
                </h1>

                <p
                    className={`text-2xl font-semibold ${
                        isDraw
                            ? 'text-slate-300'
                            : winning === 'you win'
                            ? 'text-violet-400'
                            : 'text-violet-400'
                    } transition-colors duration-300`}
                >
                    {isDraw ? 'Game is a draw' : winning}
                </p>

                <div className="w-2/3 h-[1px] bg-slate-700 my-2"></div>

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={onRestart}
                        className="bg-neon text-slate-900 font-bold px-5 py-2 rounded-lg shadow-md hover:bg-slate-900 hover:text-neon transition-all duration-300 transform hover:scale-105"
                    >
                        Restart Game
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-transparent border border-neon/50 text-neon px-5 py-2 rounded-lg hover:bg-neon hover:text-slate-900 transition-all duration-300 transform hover:scale-105"
                    >
                        Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
