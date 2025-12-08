import { motion, AnimatePresence } from 'framer-motion';

interface GameOverProps {
  winner: string;
  onRestart: () => void;
  rematch: { incomingOffer: boolean; requested: boolean; declined: boolean };
  requestRematch: () => void;
  acceptRematch: () => void;
  declineRematch: () => void;
}

const GameOver = ({
  winner,
  onRestart,
  rematch,
  requestRematch,
  acceptRematch,
  declineRematch,
}: GameOverProps) => {
  const getMessage = () => {
    if (winner === 'DRAW') return "It's a draw!";
    return `${winner} wins the game`;
  };

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-9999 flex justify-center items-center bg-black/60 backdrop-blur-md"
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex flex-col items-center gap-6 bg-slate-950/70  shadow-2xl w-[25vmax] py-10 px-6 text-center border border-neon/20"
        >
          {/* Title */}
          <h2 className="text-3xl font-extrabold text-slate-100 drop-shadow-lg">
            Game Over
          </h2>

          <p
            className={`text-xl font-semibold ${
              winner === 'DRAW'
                ? 'text-slate-300'
                : winner === 'WHITE'
                ? 'text-violet-400'
                : 'text-violet-400'
            }`}
          >
            {getMessage()}
          </p>

          <div className="w-2/3 h-px bg-slate-700 my-2"></div>

          {/* Rematch UI */}
          <div className="flex flex-col gap-4 w-full px-4">
            {rematch.incomingOffer ? (
              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-neon px-4 py-2  text-slate-900 font-bold hover:bg-neon/50 transition-all duration-300"
                  onClick={acceptRematch}
                >
                  Accept rematch
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-violet-500 px-4 py-2  text-slate-100 font-bold hover:bg-violet-600 transition-all duration-300"
                  onClick={declineRematch}
                >
                  Decline
                </motion.button>
              </div>
            ) : rematch.requested ? (
              <p className="text-yellow-300">
                Rematch requested… waiting for opponent
              </p>
            ) : rematch.declined ? (
              <p className="text-violet-400">Opponent declined your rematch</p>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-neon px-4 py-2  text-slate-900 font-bold hover:bg-neon/80 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={requestRematch}
                disabled={rematch.requested}
              >
                {rematch.requested ? 'Rematch requested…' : 'Offer rematch'}
              </motion.button>
            )}

            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="bg-transparent border border-slate-300/40 text-slate-200 px-4 py-2  font-bold hover:bg-slate-200 hover:text-slate-900 transition-all duration-300"
            >
              Back to menu
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameOver;
