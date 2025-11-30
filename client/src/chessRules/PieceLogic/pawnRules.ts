import type { Pieces } from '../../types';
import type { PieceType, Teams } from '../../types/enums';
import { getPawnPossibleMoves } from '../PossibleMoves/pawnPossibleMoves';
import { wouldKingBeInCheck } from './kingProtection';

const pawnLogic = (
    team: Teams,
    prevX: number,
    prevY: number,
    newX: number,
    newY: number,
    board: Pieces[],
    type: PieceType
) => {
    const pawn = board.find(
        (p) =>
            p.type === type && p.team === team && p.x === prevX && p.y === prevY
    );

    if (!pawn) return false;

    const possibleMoves = getPawnPossibleMoves(pawn, board);

    return (
        possibleMoves.some((move) => move.x === newX && move.y === newY) &&
        !wouldKingBeInCheck(prevX, prevY, newX, newY, team, board)
    );
};

export { pawnLogic };
