import type { Pieces, Position } from '../../types';
import { getBishopPossibleMoves } from './bishopPossibleMoves';
import { getRockPossibleMoves } from './rockPossibleMoves';

export const getQueenPossibleMoves = (
    queen: Pieces,
    board: Pieces[]
): Position[] => {
    const queenPossbileMove: Position[] = [];
    for (const moves of getBishopPossibleMoves(queen, board)) {
        queenPossbileMove.push(moves);
    }

    for (const moves of getRockPossibleMoves(queen, board)) {
        queenPossbileMove.push(moves);
    }
    return queenPossbileMove;
};
