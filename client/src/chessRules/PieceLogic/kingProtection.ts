import type { Pieces } from '../../types';
import type { Teams } from '../../types/enums';
import { getBishopPossibleMoves } from '../PossibleMoves/bishopPossibleMoves';
import { getKingPossibleMoves } from '../PossibleMoves/kingPossibleMoves';
import { getKnightPossibleMoves } from '../PossibleMoves/knightPossibleMoves';
import { getPawnPossibleMoves } from '../PossibleMoves/pawnPossibleMoves';
import { getQueenPossibleMoves } from '../PossibleMoves/queenPossibleMoves';
import { getRockPossibleMoves } from '../PossibleMoves/rockPossibleMoves';

const wouldKingBeInCheck = (
    prevX: number,
    prevY: number,
    newX: number,
    newY: number,
    team: Teams,
    board: Pieces[]
): boolean => {
    const tempBoard = board
        .map((piece) => {
            if (piece.x === prevX && piece.y === prevY) {
                return { ...piece, x: newX, y: newY };
            }
            if (piece.x === newX && piece.y === newY && piece.team !== team) {
                return null;
            }
            return piece;
        })
        .filter(Boolean) as Pieces[];

    const boardWithUpdatedMoves = updatePossibleMoves(tempBoard);
    return isKingInCheckWithUpdatedMoves(team, boardWithUpdatedMoves);
};

const wouldKingBeInCheckAfterEnPassant = (
    prevX: number,
    prevY: number,
    newX: number,
    newY: number,
    team: Teams,
    board: Pieces[]
): boolean => {
    const tempBoard = board
        .map((piece) => {
            if (piece.x === prevX && piece.y === prevY) {
                return { ...piece, x: newX, y: newY };
            }
            const captuvioletPawnX = prevX;
            const captuvioletPawnY = newY;

            if (
                piece.x === captuvioletPawnX &&
                piece.y === captuvioletPawnY &&
                piece.team !== team
            ) {
                return null;
            }
            return piece;
        })
        .filter(Boolean) as Pieces[];

    const boardWithUpdatedMoves = updatePossibleMoves(tempBoard);

    return isKingInCheckWithUpdatedMoves(team, boardWithUpdatedMoves);
};

const updatePossibleMoves = (board: Pieces[]): Pieces[] => {
    return board.map((piece) => {
        let possibleMoves = [] as { x: number; y: number }[];
        switch (piece.type) {
            case 'PAWN':
                possibleMoves = getPawnPossibleMoves(piece, board);
                break;
            case 'KING':
                possibleMoves = getKingPossibleMoves(piece, board);
                break;
            case 'KNIGHT':
                possibleMoves = getKnightPossibleMoves(piece, board);
                break;
            case 'QUEEN':
                possibleMoves = getQueenPossibleMoves(piece, board);
                break;
            case 'BISHOP':
                possibleMoves = getBishopPossibleMoves(piece, board);
                break;
            case 'ROCK':
                possibleMoves = getRockPossibleMoves(piece, board);
                break;
            default:
                possibleMoves = [];
        }

        return {
            ...piece,
            possibleMoves,
        };
    });
};

// lightweight attack check that does NOT call back into ChessRules.getPossibleMove
const isSquareAttacked = (
    team: Teams,
    board: Pieces[],
    targetX: number,
    targetY: number
): boolean => {
    // pawns: check if any enemy pawn attacks target
    const pawnAttackers = board.filter(
        (p) => p.type === 'PAWN' && p.team !== team
    );
    for (const pawn of pawnAttackers) {
        const dir = pawn.team === 'WHITE' ? 1 : -1;
        const attacks = [
            { x: pawn.x + dir, y: pawn.y + 1 },
            { x: pawn.x + dir, y: pawn.y - 1 },
        ];
        for (const a of attacks) {
            if (a.x === targetX && a.y === targetY) return true;
        }
    }

    // knights: check knight offsets
    const knightOffsets = [
        { x: 2, y: 1 },
        { x: 2, y: -1 },
        { x: -2, y: 1 },
        { x: -2, y: -1 },
        { x: 1, y: 2 },
        { x: 1, y: -2 },
        { x: -1, y: 2 },
        { x: -1, y: -2 },
    ];
    for (const off of knightOffsets) {
        const nx = targetX - off.x;
        const ny = targetY - off.y;
        const p = board.find(
            (b) =>
                b.x === nx &&
                b.y === ny &&
                b.type === 'KNIGHT' &&
                b.team !== team
        );
        if (p) return true;
    }

    // kings: adjacent squares
    const kingNeighbors = [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: -1, y: 1 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
    ];
    for (const n of kingNeighbors) {
        const kx = targetX + n.x;
        const ky = targetY + n.y;
        const kp = board.find(
            (b) =>
                b.x === kx && b.y === ky && b.type === 'KING' && b.team !== team
        );
        if (kp) return true;
    }

    // sliding pieces: rook/queen (orthogonal), bishop/queen (diagonal)
    const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: -1, y: -1 },
    ];

    for (const dir of directions) {
        let x = targetX + dir.x;
        let y = targetY + dir.y;
        while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
            const piece = board.find((b) => b.x === x && b.y === y);
            if (piece) {
                if (piece.team === team) break; // blocked by friendly
                // enemy piece: decide if it attacks along this direction
                const isDiagonal =
                    Math.abs(dir.x) === 1 && Math.abs(dir.y) === 1;
                const isOrthogonal = dir.x === 0 || dir.y === 0;
                if (piece.type === 'QUEEN') return true;
                if (isDiagonal && piece.type === 'BISHOP') return true;
                if (isOrthogonal && piece.type === 'ROCK') return true;
                // anything else blocks but doesn't attack along this ray
                break;
            }
            x += dir.x;
            y += dir.y;
        }
    }

    return false;
};

const isKingInCheckWithUpdatedMoves = (
    team: Teams,
    board: Pieces[]
): boolean => {
    const king = board.find(
        (piece) => piece.type === 'KING' && piece.team === team
    );
    if (!king) return false;
    return isSquareAttacked(team, board, king.x, king.y);
};

const BLACKPieceIsProtected = (
    newX: number,
    newY: number,
    team: Teams,
    board: Pieces[]
) => {
    const evaluatedBoard = updatePossibleMoves(board);
    const attackPieces = evaluatedBoard.filter((p) => p.team !== team);
    for (const piece of attackPieces) {
        if (!piece.possibleMoves) continue;
        for (const move of piece.possibleMoves) {
            if (move.x === newX && move.y === newY) return true;
        }
    }
    return false;
};

const isKingInCheck = (
    team: Teams,
    board: Pieces[],
    newX: number,
    newY: number
): boolean => {
    return isSquareAttacked(team, board, newX, newY);
};

const pawnCheck = (pawn: Pieces, newX: number, newY: number) => {
    const direction = pawn.team === 'WHITE' ? 1 : -1;
    const pawnAttackMoves = [
        {
            x: pawn.x + direction,
            y: pawn.y + 1,
        },
        {
            x: pawn.x + direction,
            y: pawn.y - 1,
        },
    ];

    for (const moves of pawnAttackMoves) {
        if (moves.x === newX && moves.y === newY) return true;
    }
    return false;
};

export {
    updatePossibleMoves,
    wouldKingBeInCheck,
    wouldKingBeInCheckAfterEnPassant,
    pawnCheck,
    isKingInCheck,
    isKingInCheckWithUpdatedMoves,
    BLACKPieceIsProtected,
};
