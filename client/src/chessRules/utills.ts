import type { Pieces } from '../types';
import type { Teams } from '../types/enums';

const isCellAccessible = (posX: number, posY: number, board: Pieces[]) => {
    const piece = board.find((p) => p.x === posX && p.y === posY);
    return piece === undefined;
};

const isCellOccupiedByMe = (
    posX: number,
    posY: number,
    board: Pieces[],
    team: Teams
) => {
    const piece = board.find((p) => p.x === posX && p.y === posY);
    if (piece) {
        if (piece.team === team) return false;
    }
    return true;
};

const isCellOccupiedByOpponent = (
    posX: number,
    posY: number,
    board: Pieces[],
    team: Teams
) => {
    const piece = board.find((p) => p.x === posX && p.y === posY);
    return piece !== undefined && piece.team !== team;
};

export { isCellAccessible, isCellOccupiedByMe, isCellOccupiedByOpponent };
