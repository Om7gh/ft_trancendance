import type { GameUIProps } from '../types';
import Board from './Board';
import CheckMate from './CheckMate';
import PromotionModal from './PromotionModel';
import GameOver from './GameOver';
import { useEffect, useRef } from 'react';
import { chessSocket } from '../classes/chessWebsocket';
import { initBoard } from '../utils/initBoard';

export default function GameUI({
    pieces,
    setPieces,
    checkMate,
    promotionPending,
    setPromotionPending,
    handlePromotion,
    syncBoard,
    myTeam,
    opponentConnected,
    gameOver,
    setFindingMatch,
    clearRoom,
    rematch,
    requestRematch,
    acceptRematch,
    declineRematch,
}: GameUIProps) {
    const sentCheckmateRef = useRef(false);

    useEffect(() => {
        if (
            checkMate.isCheckmate &&
            checkMate.winner &&
            !sentCheckmateRef.current
        ) {
            sentCheckmateRef.current = true;
            chessSocket.announceCheckmate(checkMate.winner);
        }
        if (!checkMate.isCheckmate) {
            sentCheckmateRef.current = false;
        }
    }, [checkMate.isCheckmate, checkMate.winner]);

    const onRestart = () => {
        setPieces(initBoard());
        setPromotionPending(null);
        setFindingMatch(false);
        clearRoom();
    };

    const showGameOver = Boolean(gameOver && gameOver.winner);

    return (
        <>
            {!showGameOver && checkMate.isCheckmate && (
                <CheckMate
                    winner={checkMate.winner}
                    myTeam={myTeam}
                    onRestart={onRestart}
                />
            )}
            {showGameOver && (
                <GameOver
                    winner={gameOver!.winner}
                    onRestart={onRestart}
                    rematch={rematch}
                    requestRematch={requestRematch}
                    acceptRematch={acceptRematch}
                    declineRematch={declineRematch}
                />
            )}
            <Board
                pieces={pieces}
                setPieces={setPieces}
                setPromotionPending={setPromotionPending}
                checkmate={checkMate}
                syncBoard={syncBoard}
                myTeam={myTeam}
                opponentConnected={opponentConnected}
            />
            {promotionPending && (
                <PromotionModal
                    team={promotionPending.piece.team}
                    onSelect={handlePromotion}
                />
            )}
        </>
    );
}
