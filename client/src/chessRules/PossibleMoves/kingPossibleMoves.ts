import type { Pieces, Position } from '../../types';
import { isKingInCheck } from '../PieceLogic/kingProtection';
import { isCellAccessible, isCellOccupiedByOpponent } from '../utills';

export const getKingPossibleMoves = (
    king: Pieces,
    board: Pieces[]
): Position[] => {
    const kingPossibleMoves: Position[] = [];

    const directions = [
        { x: 1, y: 0 }, // right
        { x: 1, y: 1 }, // top-right
        { x: 0, y: 1 }, // top
        { x: -1, y: 1 }, // top-left
        { x: -1, y: 0 }, // left
        { x: -1, y: -1 }, // bottom-left
        { x: 0, y: -1 }, // bottom
        { x: 1, y: -1 }, // bottom-right
    ];

    for (const dir of directions) {
        const targetX = king.x + dir.x;
        const targetY = king.y + dir.y;

        if (targetX < 0 || targetX > 7 || targetY < 0 || targetY > 7) continue;

        if (
            isCellAccessible(targetX, targetY, board) ||
            isCellOccupiedByOpponent(targetX, targetY, board, king.team)
        ) {
            const newBoard = board.filter(
                (p) => !(p.x === targetX && p.y === targetY)
            );

            const movedKing = { ...king, x: targetX, y: targetY };
            const simulatedBoard = newBoard.map((p) =>
                p === king ? movedKing : p
            );

            if (!isKingInCheck(king.team, simulatedBoard, targetX, targetY)) {
                kingPossibleMoves.push({ x: targetX, y: targetY });
            }
        }
    }

    if (!king.isKingMoving) {
        const rooks = board.filter(
            (p) => p.type === 'ROCK' && p.team === king.team && !p.isRookMoving
        );

        const kingsideRook = rooks.find((p) => p.y > king.y);
        if (kingsideRook) {
            let pathClear = true;
            for (let y = king.y + 1; y < kingsideRook.y; y++) {
                if (isKingInCheck(king.team, board, king.x, y - 1)) {
                    pathClear = false;
                    break;
                }
                if (!isCellAccessible(king.x, y, board)) {
                    pathClear = false;
                    break;
                }
            }
            if (pathClear && isCellAccessible(king.x, king.y + 2, board)) {
                // allow clicking either the king destination (y+2) or the rook square (y+3)
                kingPossibleMoves.push({ x: king.x, y: king.y + 2 });
                kingPossibleMoves.push({ x: king.x, y: king.y + 3 });
            }
        }

        const queensideRook = rooks.find((p) => p.y < king.y);
        if (queensideRook) {
            let pathClear = true;
            for (let y = queensideRook.y + 1; y < king.y; y++) {
                if (isKingInCheck(king.team, board, king.x, y - 1)) {
                    pathClear = false;
                    break;
                }
                if (!isCellAccessible(king.x, y, board)) {
                    pathClear = false;
                    break;
                }
            }
            if (pathClear && isCellAccessible(king.x, king.y - 2, board)) {
                // allow clicking either the king destination (y-2) or the rook square (y-4)
                kingPossibleMoves.push({ x: king.x, y: king.y - 2 });
                kingPossibleMoves.push({ x: king.x, y: king.y - 4 });
            }
        }
    }

    return kingPossibleMoves;
};
