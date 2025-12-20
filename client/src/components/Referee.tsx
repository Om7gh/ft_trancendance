import { useState } from 'react';
import type { Pieces, Position } from '../types';
import { initBoard } from '../utils/initBoard';
import { useCheckmate } from '../hooks/useCheckmate';
import { usePromotion } from '../hooks/usePromotion';
import GameUI from './GameUi';

export default function Referee({
    myTeam,
    syncBoard,
    opponentConnected,
    gameOver,
    roomId,
    clearRoom,
    setFindingMatch,
    rematch,
    requestRematch,
    acceptRematch,
    declineRematch,
}: {
    setFindingMatch: React.Dispatch<React.SetStateAction<boolean>>;
    myTeam: 'WHITE' | 'BLACK' | null;
    syncBoard: (
        board: Pieces[],
        currentTurn: 'WHITE' | 'BLACK',
        turns: number,
        prevMove: {from: Position, to: Position} | null
    ) => void;
    clearRoom: () => void;
    opponentConnected: boolean;
    gameOver: {
        winner: string;
        message: string;
    } | null;
    roomId: string | null;
    rematch: { incomingOffer: boolean; requested: boolean; declined: boolean };
    requestRematch: () => void;
    acceptRematch: () => void;
    declineRematch: () => void;
}) {
    const [pieces, setPieces] = useState<Pieces[]>(initBoard());
    const checkMate = useCheckmate(pieces);
    const { promotionPending, setPromotionPending, handlePromotion } =
        usePromotion(setPieces, syncBoard);

    return (
        <>
            <GameUI
                pieces={pieces}
                setPieces={setPieces}
                checkMate={checkMate}
                promotionPending={promotionPending}
                setPromotionPending={setPromotionPending}
                handlePromotion={handlePromotion}
                syncBoard={syncBoard}
                myTeam={myTeam}
                opponentConnected={opponentConnected}
                gameOver={gameOver}
                roomId={roomId}
                clearRoom={clearRoom}
                setFindingMatch={setFindingMatch}
                rematch={rematch}
                requestRematch={requestRematch}
                acceptRematch={acceptRematch}
                declineRematch={declineRematch}
            />
        </>
    );
}
