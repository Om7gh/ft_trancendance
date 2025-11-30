import type { Pieces, Position } from '../../types';
import { isCellOccupiedByMe } from '../utills';

export const getKnightPossibleMoves = (
    knight: Pieces,
    board: Pieces[]
): Position[] => {
    const knightPossibleMoves: Position[] = [];

    const knightMoves = [
        { x: 2, y: 1 }, // 2 up, 1 right
        { x: 2, y: -1 }, // 2 up, 1 left
        { x: -2, y: 1 }, // 2 down, 1 right
        { x: -2, y: -1 }, // 2 down, 1 left
        { x: 1, y: 2 }, // 1 up, 2 right
        { x: 1, y: -2 }, // 1 up, 2 left
        { x: -1, y: 2 }, // 1 down, 2 right
        { x: -1, y: -2 }, // 1 down, 2 left
    ];

    for (const move of knightMoves) {
        const targetX = knight.x + move.x;
        const targetY = knight.y + move.y;

        if (targetX >= 0 && targetX <= 7 && targetY >= 0 && targetY <= 7) {
            if (isCellOccupiedByMe(targetX, targetY, board, knight.team)) {
                knightPossibleMoves.push({ x: targetX, y: targetY });
            }
        }
    }

    return knightPossibleMoves;
};
