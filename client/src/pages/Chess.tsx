import { useState } from 'react';
import { useOnlineChess } from '../hooks/useOnlineChess';
import Referee from '@/components/Referee';
import MiniChat from '@/components/MiniChat';

function Chess() {
  const {
    roomId,
    myTeam,
    opponentConnected,
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
  const isVideoPlayed = localStorage.getItem('video');

  console.log(isVideoPlayed);

  // if (!isVideoPlayed) {
  //   return (
  //     <div className="w-full h-full">
  //       <video className="w-full h-full" autoPlay controls>
  //         <source src="/chess.mp4" type="video/webm" />
  //       </video>
  //     </div>
  //   );
  // }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="">
        {!isConnected && (
          <p className="text-violet-500 text-lg font-bold">
            Reconnecting to the server...
          </p>
        )}

        {!roomId && isConnected && (
          <div className="flex items-center gap-6 h-[40vmax]">
            <img src="/chessbg.png" />
            <div className="bg-slate-950/50 h-full p-6 w-72 flex justify-center items-center">
              {!findingMatch && (
                <button
                  onClick={() => {
                    enterMatchmaking();
                    setFindingMatch(true);
                  }}
                  className="px-6 py-3  text-lg font-semibold bg-neon/50 text-white hover:border-4 hover:border-neon duration-200 cursor-pointer"
                >
                  Find Opponent
                </button>
              )}
              <div>
                {findingMatch && (
                  <p className="text-yellow-400 text-lg">Finding a match...</p>
                )}
                {findingMatch && (
                  <button
                    onClick={() => {
                      leaveMatchmaking();
                      setFindingMatch(false);
                    }}
                    className="px-6 py-3  text-lg font-semibold bg-violet-500 text-white hover:bg-violet-600 transition"
                  >
                    Cancel Matchmaking
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {roomId && (
          <div className="flex items-center gap-6">
            <div className="flex  flex-col gap-5 items-start">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white">
                  Opponent ID:{' '}
                  <span className="text-yellow-400">
                    {opponentConnected ? 'Opponent' : 'Waiting...'}
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
              <div className="text-left bg-slate-900 px-5 py-5  flex justify-between w-full text-slate-100">
                <h3 className="text-2xl font-bold text-slate-100">
                  Your ID: <span className="text-neon">{roomId}</span>
                </h3>
              </div>
            </div>
            <div className="flex flex-col gap-6 w-full justify-center">
              <MiniChat />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chess;
