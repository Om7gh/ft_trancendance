import type { Pieces } from '../../types';
import type { Teams } from '../../types/enums';
import { getKingPossibleMoves } from '../PossibleMoves/kingPossibleMoves';
import { wouldKingBeInCheck } from './kingProtection';

const kingLogic = (
    team: Teams,
    prevX: number,
    prevY: number,
    newX: number,
    newY: number,
    board: Pieces[]
) => {
    const bishop = board.find(
        (p) =>
            p.type === 'KING' &&
            p.team === team &&
            p.x === prevX &&
            p.y === prevY
    );

    if (!bishop) return false;

    const possibleMoves = getKingPossibleMoves(bishop, board);

    return (
        possibleMoves.some((move) => move.x === newX && move.y === newY) &&
        !wouldKingBeInCheck(prevX, prevY, newX, newY, team, board)
    );
};

export { kingLogic };
