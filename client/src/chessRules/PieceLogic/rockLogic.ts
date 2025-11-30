import type { Pieces } from '../../types';
import type { Teams } from '../../types/enums';
import { getRockPossibleMoves } from '../PossibleMoves/rockPossibleMoves';
import { wouldKingBeInCheck } from './kingProtection';

const rookLogic = (
    team: Teams,
    prevX: number,
    prevY: number,
    newX: number,
    newY: number,
    board: Pieces[]
) => {
    const rock = board.find(
        (p) =>
            p.type === 'ROCK' &&
            p.team === team &&
            p.x === prevX &&
            p.y === prevY
    );

    if (!rock) return false;

    const possibleMoves = getRockPossibleMoves(rock, board);

    return (
        possibleMoves.some((move) => move.x === newX && move.y === newY) &&
        !wouldKingBeInCheck(prevX, prevY, newX, newY, team, board)
    );
};

export { rookLogic };
