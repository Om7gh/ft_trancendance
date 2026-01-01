import { useContext, useState } from 'react';
import { useOnlineChess } from '../hooks/useOnlineChess';
import Referee from '@/components/Referee';
import MiniChat from '@/components/MiniChat';
import { GlobalContext } from '@/App';
import { useGetChessPiece } from '@/services/user/useGetChessPiece';

function Chess() {
  useGetChessPiece();
  const {
    roomId,
    myTeam,
    opponentConnected,
    opponentName,
    enterMatchmaking,
    leaveMatchmaking,
    syncBoard,
    isConnected,
    gameOver,
    clearRoom,
    rematch,
    requestRematch,
    acceptRematch,
    declineRematch,
  } = useOnlineChess();
  const [findingMatch, setFindingMatch] = useState(false);
  const {user} = useContext(GlobalContext)

  return (
    <div className="flex justify-center items-center h-full">
      <div className="">
        {!isConnected && (
          <p className="text-violet-500 text-lg font-bold">
            Reconnecting to the server...
          </p>
        )}

        {!roomId && isConnected && (
          <div className="flex items-center gap-6 h-[45vmax] flex-col-reverse md:flex-row lg:flex-row">
            <img src="/chessbg.png" />
            <div className="flex justify-center items-center text-center">
              {!findingMatch && (
                <button
                  onClick={() => {
                    enterMatchmaking();
                    setFindingMatch(true);
                  }}
                  className="md:px-6 md:py-3 px-4 py-2 rounded-lg shadow-xl  text-sm md:text-lg font-semibold bg-neon/60 text-violet-200 hover:border-4 hover:border-neon duration-200 cursor-pointer"
                >
                  Find Opponent
                </button>
              )}
              <div>
                {findingMatch && (
                  <p className="text-yellow-400 text-md md:text-lg">Finding a match...</p>
                )}
                {findingMatch && (
                  <button
                    onClick={() => {
                      leaveMatchmaking();
                      setFindingMatch(false);
                    }}
                    className="md:px-6 md:py-3 px-4 py-2 rounded-lg shadow-xl  text-sm md:text-lg font-semibold bg-neon/60 text-violet-200 hover:border-4 hover:border-neon duration-200 cursor-pointer"
                  >
                    Cancel Matchmaking
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {roomId && (
          <div className="flex items-center gap-6 flex-col  md:flex-row lg:flex-row ">
            <div className="flex flex-col gap-5 items-start">
              <div className="text-left flex justify-between text-slate-100">
                <h3 className=" text-lg  md:text-2xl lg:text-2xl font-bold text-slate-100">
                  <span className="text-violet-400">
                    {opponentConnected ? (user?.username === opponentName ? user?.username : opponentName) : 'Waiting...'}
                  </span>
                </h3>
              </div>
              <Referee
                key={roomId}
                myTeam={myTeam}
                syncBoard={syncBoard}
                opponentConnected={opponentConnected}
                gameOver={gameOver}
                clearRoom={clearRoom}
                roomId={roomId}
                setFindingMatch={setFindingMatch}
                rematch={rematch}
                requestRematch={requestRematch}
                acceptRematch={acceptRematch}
                declineRematch={declineRematch}
              />
              <div className="text-left flex justify-between w-full text-slate-100">
                <h3 className=" text-lg  md:text-2xl lg:text-2xl font-bold text-slate-100">
                  <span className="text-neon">{user?.username}</span>
                </h3>
              </div>
            </div>
            <div className="flex flex-col gap-6 max-w-72 md:w-auto lg:w-auto justify-center overflow-auto">
              <MiniChat />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chess;
