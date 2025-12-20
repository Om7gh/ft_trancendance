import type { Pieces, Position } from '../types';
import { type PieceType, type Teams } from '../types/enums';
import { bishopLogic } from './PieceLogic/bishopLogic';
import { castleLogic } from './PieceLogic/castleLogic';
import { kingLogic } from './PieceLogic/kingLogic';
import { knightLogic } from './PieceLogic/knightLogic';
import { pawnLogic } from './PieceLogic/pawnRules';
import { queenLogic } from './PieceLogic/queenLogic';
import { rookLogic } from './PieceLogic/rockLogic';
import { getBishopPossibleMoves } from './PossibleMoves/bishopPossibleMoves';
import { getKingPossibleMoves } from './PossibleMoves/kingPossibleMoves';
import { getKnightPossibleMoves } from './PossibleMoves/knightPossibleMoves';
import { getPawnPossibleMoves } from './PossibleMoves/pawnPossibleMoves';
import { getQueenPossibleMoves } from './PossibleMoves/queenPossibleMoves';
import { getRockPossibleMoves } from './PossibleMoves/rockPossibleMoves';

export class ChessRules {
    isValid = (
        prevX: number,
        prevY: number,
        newX: number,
        newY: number,
        team: Teams,
        type: PieceType,
        board: Pieces[]
    ) => {
        switch (type) {
            case 'PAWN':
                return pawnLogic(team, prevX, prevY, newX, newY, board, type);

            case 'KNIGHT':
                return knightLogic(team, prevX, prevY, newX, newY, board);

            case 'BISHOP':
                return bishopLogic(team, prevX, prevY, newX, newY, board);

            case 'ROCK':
                return rookLogic(team, prevX, prevY, newX, newY, board);

            case 'QUEEN':
                return queenLogic(team, prevX, prevY, newX, newY, board);

            case 'KING': {
                const castleResult = castleLogic(
                    prevX,
                    prevY,
                    newX,
                    newY,
                    board
                );
                if (castleResult.isValid && castleResult.updatedBoard) {
                    return castleResult.updatedBoard;
                }
                return kingLogic(team, prevX, prevY, newX, newY, board);
            }
        }
        return false;
    };

    getPossibleMove(board: Pieces[], piece: Pieces): Position[] {
        let possibleMoves: Position[] = [];
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
                return [];
        }
        const moves = this.filterMovesThatExposeKing(
            piece,
            possibleMoves,
            board
        );
        return moves;
    }

    private filterMovesThatExposeKing(
        piece: Pieces,
        possibleMoves: Position[],
        board: Pieces[]
    ): Position[] {
        return possibleMoves.filter((move) => {
            const tempBoard = board
                .map((p) => {
                    if (p.x === piece.x && p.y === piece.y) {
                        return { ...p, x: move.x, y: move.y };
                    }
                    if (
                        p.x === move.x &&
                        p.y === move.y &&
                        p.team !== piece.team
                    ) {
                        return null;
                    }
                    return p;
                })
                .filter(Boolean) as Pieces[];

            return !this.isKingInCheckAfterMove(piece.team, tempBoard);
        });
    }

    private isKingInCheckAfterMove(team: Teams, board: Pieces[]): boolean {
        const king = board.find((p) => p.type === 'KING' && p.team === team);
        if (!king) return false;

        const BLACKPieces = board.filter((p) => p.team !== team);

        for (const BLACKPiece of BLACKPieces) {
            const BLACKMoves = this.getBasicPossibleMoves(BLACKPiece, board);
            for (const move of BLACKMoves) {
                if (move.x === king.x && move.y === king.y) {
                    return true;
                }
            }
        }
        return false;
    }

    private getBasicPossibleMoves(piece: Pieces, board: Pieces[]): Position[] {
        switch (piece.type) {
            case 'PAWN':
                return getPawnPossibleMoves(piece, board);
            case 'KING':
                return getKingPossibleMoves(piece, board);
            case 'KNIGHT':
                return getKnightPossibleMoves(piece, board);
            case 'QUEEN':
                return getQueenPossibleMoves(piece, board);
            case 'BISHOP':
                return getBishopPossibleMoves(piece, board);
            case 'ROCK':
                return getRockPossibleMoves(piece, board);
            default:
                return [];
        }
    }
}
