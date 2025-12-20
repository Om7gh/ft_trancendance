import type { Pieces, Position } from '../../types';
import { isCellAccessible, isCellOccupiedByOpponent } from '../utills';

export const getRockPossibleMoves = (rock: Pieces, board: Pieces[]) => {
    const rockPossibleMoves: Position[] = [];
    const directions = [
        { x: 0, y: 1 }, // top
        { x: 1, y: 0 }, // left
        { x: 0, y: -1 }, // bottom
        { x: -1, y: 0 }, // right
    ];

    for (const direction of directions) {
        for (let distance = 1; distance <= 7; distance++) {
            const targetX = rock.x + direction.x * distance;
            const targetY = rock.y + direction.y * distance;

            if (targetX < 0 || targetX > 7 || targetY < 0 || targetY > 7) {
                break;
            }

            if (isCellAccessible(targetX, targetY, board)) {
                rockPossibleMoves.push({ x: targetX, y: targetY });
            } else if (
                isCellOccupiedByOpponent(targetX, targetY, board, rock.team)
            ) {
                rockPossibleMoves.push({ x: targetX, y: targetY });
                break;
            } else {
                break;
            }
        }
    }

    return rockPossibleMoves;
};
