import { PiPingPongBold } from 'react-icons/pi';
import { FaChess } from 'react-icons/fa';
import { MdAutoAwesome } from 'react-icons/md';

const pong = {
  win: 5,
  lose: 2,
};

const chess = {
  win: 10,
  lose: 5,
  draw: 3,
};

function GamesStatistics() {
  const totalWin = pong.win + chess.win;
  const totalLose = pong.lose + chess.lose;
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-6 bg-gradient-to-b from-slate-800/50 to-violet-800/20">
        <div className="bg-slate-900/50 p-6 h-full">
          <h2 className="text-center text-2xl mb-4">
            <PiPingPongBold className="m-auto text-4xl mb-2 text-neon" />
            <p className="bg-linear-0 from-violet-600 to-neon bg-clip-text text-transparent ">
              Pong Score
            </p>
          </h2>
          <div className="text-slate-100">
            <div className="flex justify-evenly items-center">
              <p className="text-2xl text-violet-300">Wins</p>
              <p className="text-2xl text-violet-200">{pong.win}</p>
            </div>
            <div className="flex justify-evenly items-center">
              <p className="text-2xl text-violet-300">Lose</p>
              <p className="text-2xl text-violet-200">{pong.lose}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-b from-slate-800/50 to-violet-800/20">
        <div className="bg-slate-900/50 p-6 h-full">
          <h2 className="text-violet-200 text-center text-2xl mb-4">
            <FaChess className="m-auto text-4xl mb-2 text-neon" />
            <p className="bg-linear-0 from-violet-600 to-neon bg-clip-text text-transparent ">
              Chess Score
            </p>
          </h2>
          <div className="text-slate-100">
            <div className="flex justify-evenly items-center">
              <p className="text-2xl text-violet-300">Wins</p>
              <p className="text-2xl text-violet-200">{chess.win}</p>
            </div>
            <div className="flex justify-evenly items-center">
              <p className="text-2xl text-violet-300">Lose</p>
              <p className="text-2xl text-violet-200">{chess.lose}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-b from-slate-800/50 to-violet-800/20 ">
        <div className="bg-slate-900/50 p-6 h-full">
          <h2 className="text-violet-200 text-center text-2xl mb-4">
            <MdAutoAwesome className="m-auto text-4xl mb-2 text-neon" />
            <p className="bg-linear-0 from-violet-600 to-neon bg-clip-text text-transparent ">
              Total Score
            </p>
          </h2>
          <div className="text-slate-100">
            <div className="flex justify-evenly items-center">
              <p className="text-2xl text-violet-300">Wins</p>
              <p className="text-2xl text-violet-200">{totalWin}</p>
            </div>
            <div className="flex justify-evenly items-center">
              <p className="text-2xl text-violet-300">Lose</p>
              <p className="text-2xl text-violet-200">{totalLose}</p>
            </div>
            <div className="flex justify-evenly items-center">
              <p className="text-2xl text-violet-300">Draws</p>
              <p className="text-2xl text-violet-200">{chess.draw}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamesStatistics;
