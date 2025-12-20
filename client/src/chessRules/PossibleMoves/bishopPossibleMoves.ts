import type { Pieces, Position } from '../../types';
import { isCellAccessible, isCellOccupiedByOpponent } from '../utills';

export const getBishopPossibleMoves = (
    bishop: Pieces,
    board: Pieces[]
): Position[] => {
    const bishopMoves: Position[] = [];

    const directions = [
        { x: 1, y: 1 }, // top-right
        { x: 1, y: -1 }, // top-left
        { x: -1, y: 1 }, // bottom-right
        { x: -1, y: -1 }, // bottom-left
    ];

    for (const direction of directions) {
        for (let distance = 1; distance <= 7; distance++) {
            const targetX = bishop.x + direction.x * distance;
            const targetY = bishop.y + direction.y * distance;

            if (targetX < 0 || targetX > 7 || targetY < 0 || targetY > 7) {
                break;
            }

            if (isCellAccessible(targetX, targetY, board)) {
                bishopMoves.push({ x: targetX, y: targetY });
            } else if (
                isCellOccupiedByOpponent(targetX, targetY, board, bishop.team)
            ) {
                bishopMoves.push({ x: targetX, y: targetY });
                break;
            } else {
                break;
            }
        }
    }

    return bishopMoves;
};
