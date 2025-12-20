import type { Pieces } from '../../types';
import type { Teams } from '../../types/enums';
import { getKnightPossibleMoves } from '../PossibleMoves/knightPossibleMoves';
import { wouldKingBeInCheck } from './kingProtection';

const knightLogic = (
    team: Teams,
    prevX: number,
    prevY: number,
    newX: number,
    newY: number,
    board: Pieces[]
) => {
    const knight = board.find(
        (p) =>
            p.type === 'KNIGHT' &&
            p.team === team &&
            p.x === prevX &&
            p.y === prevY
    );

    if (!knight) return false;

    const possibleMoves = getKnightPossibleMoves(knight, board);

    return (
        possibleMoves.some((move) => move.x === newX && move.y === newY) &&
        !wouldKingBeInCheck(prevX, prevY, newX, newY, team, board)
    );
};

export { knightLogic };
