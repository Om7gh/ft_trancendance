import type { Pieces } from '../../types';
import type { PieceType, Teams } from '../../types/enums';
import { isCellAccessible } from '../utills';

const enPassant = (
    prevX: number,
    prevY: number,
    newX: number,
    newY: number,
    team: Teams,
    board: Pieces[],
    type: PieceType
): boolean => {
    if (type !== 'PAWN') return false;

    const direction = team === 'WHITE' ? 1 : -1;

    if (newX === prevX + direction && Math.abs(newY - prevY) === 1) {
        if (isCellAccessible(newX, newY, board)) {
            const targetPawn = board.find(
                (p) =>
                    p.x === prevX &&
                    p.y === newY &&
                    p.type === 'PAWN' &&
                    p.team !== team &&
                    p.isEmpassant
            );

            return targetPawn !== undefined;
        }
    }
    return false;
};

export { enPassant };
