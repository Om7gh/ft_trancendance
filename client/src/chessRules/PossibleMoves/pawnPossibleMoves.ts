import type { Pieces, Position } from '../../types';
import { isCellAccessible, isCellOccupiedByOpponent } from '../utills';

export const getPawnPossibleMoves = (
    pawn: Pieces,
    board: Pieces[]
): Position[] => {
    const pawnPossibleMoves: Position[] = [];
    const direction = pawn.team === 'WHITE' ? 1 : -1;
    const startRow = pawn.team === 'WHITE' ? 1 : 6;

    const forwardOne = { x: pawn.x + direction, y: pawn.y };
    if (isCellAccessible(forwardOne.x, forwardOne.y, board)) {
        pawnPossibleMoves.push(forwardOne);

        if (pawn.x === startRow) {
            const forwardTwo = { x: pawn.x + 2 * direction, y: pawn.y };
            const intermediateCell = { x: pawn.x + direction, y: pawn.y };

            if (
                isCellAccessible(
                    intermediateCell.x,
                    intermediateCell.y,
                    board
                ) &&
                isCellAccessible(forwardTwo.x, forwardTwo.y, board)
            ) {
                pawnPossibleMoves.push(forwardTwo);
            }
        }
    }

    const leftDiagonal = { x: pawn.x + direction, y: pawn.y - 1 };
    const rightDiagonal = { x: pawn.x + direction, y: pawn.y + 1 };

    if (
        isCellOccupiedByOpponent(
            leftDiagonal.x,
            leftDiagonal.y,
            board,
            pawn.team
        )
    ) {
        pawnPossibleMoves.push(leftDiagonal);
    }

    if (
        isCellOccupiedByOpponent(
            rightDiagonal.x,
            rightDiagonal.y,
            board,
            pawn.team
        )
    ) {
        pawnPossibleMoves.push(rightDiagonal);
    }

    const leftEnPassantTarget = board.find(
        (p) =>
            p.x === pawn.x &&
            p.y === pawn.y - 1 &&
            p.type === 'PAWN' &&
            p.team !== pawn.team &&
            p.isEmpassant
    );
    if (
        leftEnPassantTarget &&
        isCellAccessible(leftDiagonal.x, leftDiagonal.y, board)
    ) {
        pawnPossibleMoves.push(leftDiagonal);
    }

    const rightEnPassantTarget = board.find(
        (p) =>
            p.x === pawn.x &&
            p.y === pawn.y + 1 &&
            p.type === 'PAWN' &&
            p.team !== pawn.team &&
            p.isEmpassant
    );
    if (
        rightEnPassantTarget &&
        isCellAccessible(rightDiagonal.x, rightDiagonal.y, board)
    ) {
        pawnPossibleMoves.push(rightDiagonal);
    }

    return pawnPossibleMoves.filter(
        (move) => move.x >= 0 && move.x <= 7 && move.y >= 0 && move.y <= 7
    );
};
