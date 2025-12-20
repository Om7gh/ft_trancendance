import type { Pieces } from '../types';

function simulateMove(
    board: Pieces[],
    piece: Pieces,
    newX: number,
    newY: number
): Pieces[] {
    return board
        .map((p) => {
            if (p.x === piece.x && p.y === piece.y) {
                return { ...p, x: newX, y: newY };
            }
            if (p.x === newX && p.y === newY && p.team !== piece.team) {
                return null;
            }
            return p;
        })
        .filter(Boolean) as Pieces[];
}

export { simulateMove };
