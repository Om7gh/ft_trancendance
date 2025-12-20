// src/components/Referee/useCheckmate.ts
import { useEffect, useState } from 'react';
import type { CheckMateProps, Pieces } from '../types';
import { isCheckMate } from '../chessRules/PieceLogic/checkMate';
import { checkPossibleMoves } from '../chessRules/PossibleMoves/checkPossibleMoves';
import { isKingInCheckWithUpdatedMoves } from '../chessRules/PieceLogic/kingProtection';
import { useChessStore } from '../store/useChessStore';
import type { Teams } from '../types/enums';

export function useCheckmate(pieces: Pieces[]) {
    const [checkMate, setCheckMate] = useState<CheckMateProps>({
        isCheckmate: false,
        winner: null,
    });

    useEffect(() => {
        const { currentTurn } = useChessStore.getState();
        const sidePieces = pieces.filter((p) => p.team === currentTurn);
        const king = sidePieces.find((p) => p.type === 'KING');
        if (!king) return;

        setCheckMate({ isCheckmate: false, winner: null });

        setTimeout(() => {
            if (isCheckMate(pieces, currentTurn as Teams)) {
                const winner = currentTurn === 'WHITE' ? 'BLACK' : 'WHITE';
                setCheckMate({ isCheckmate: true, winner });
                return;
            }

            const inCheck = isKingInCheckWithUpdatedMoves(
                currentTurn as Teams,
                pieces
            );
            const noMoves = checkPossibleMoves(pieces, currentTurn as Teams);
            if (!inCheck && noMoves) {
                setCheckMate({ isCheckmate: true, winner: 'DRAW' });
            }
        }, 0);
    }, [pieces]);

    return checkMate;
}
