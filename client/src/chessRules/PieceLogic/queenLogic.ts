import type { Pieces } from '../../types';
import type { Teams } from '../../types/enums';
import { getQueenPossibleMoves } from '../PossibleMoves/queenPossibleMoves';
import { wouldKingBeInCheck } from './kingProtection';

const queenLogic = (
    team: Teams,
    prevX: number,
    prevY: number,
    newX: number,
    newY: number,
    board: Pieces[]
) => {
    const queen = board.find(
        (p) =>
            p.type === 'QUEEN' &&
            p.team === team &&
            p.x === prevX &&
            p.y === prevY
    );

    if (!queen) return false;

    const possibleMoves = getQueenPossibleMoves(queen, board);

    return (
        possibleMoves.some((move) => move.x === newX && move.y === newY) &&
        !wouldKingBeInCheck(prevX, prevY, newX, newY, team, board)
    );
};

export { queenLogic };
