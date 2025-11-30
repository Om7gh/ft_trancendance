import type { Pieces } from '../types';
import { PieceType, Teams } from '../types/enums';

export const VERTICAL_AXIS = new Array(8).fill(0).map((_, i) => i + 1);
export const HORIZONTAL_AXIS = new Array(8)
    .fill(0)
    .map((_, i) => String.fromCharCode(i + 97));

export const Piece = (type: string): string => {
    return `/assets/piece/fantasy/${type}.svg`;
};

export const pushRocks = (piece: Pieces[]) => {
    piece.push({
        image: Piece('wR'),
        x: 0,
        y: 0,
        team: Teams.WHITE,
        type: PieceType.ROCK,
        isRookMoving: false,
        isKingMoving: false,
    });
    piece.push({
        image: Piece('wR'),
        x: 0,
        y: 7,
        team: Teams.WHITE,
        type: PieceType.ROCK,
        isRookMoving: false,
        isKingMoving: false,
    });
    piece.push({
        image: Piece('bR'),
        x: 7,
        y: 0,
        team: Teams.BLACK,
        type: PieceType.ROCK,
        isRookMoving: false,
        isKingMoving: false,
    });
    piece.push({
        image: Piece('bR'),
        x: 7,
        y: 7,
        team: Teams.BLACK,
        type: PieceType.ROCK,
        isRookMoving: false,
        isKingMoving: false,
    });
};

export const pushKnight = (piece: Pieces[]) => {
    piece.push({
        image: Piece('wN'),
        x: 0,
        y: 1,
        team: Teams.WHITE,
        type: PieceType.KNIGHT,
    });
    piece.push({
        image: Piece('wN'),
        x: 0,
        y: 6,
        team: Teams.WHITE,
        type: PieceType.KNIGHT,
    });
    piece.push({
        image: Piece('bN'),
        x: 7,
        y: 1,
        team: Teams.BLACK,
        type: PieceType.KNIGHT,
    });
    piece.push({
        image: Piece('bN'),
        x: 7,
        y: 6,
        team: Teams.BLACK,
        type: PieceType.KNIGHT,
    });
};

export const pushPishop = (piece: Pieces[]) => {
    piece.push({
        image: Piece('wB'),
        x: 0,
        y: 2,
        team: Teams.WHITE,
        type: PieceType.BISHOP,
    });
    piece.push({
        image: Piece('wB'),
        x: 0,
        y: 5,
        team: Teams.WHITE,
        type: PieceType.BISHOP,
    });
    piece.push({
        image: Piece('bB'),
        x: 7,
        y: 2,
        team: Teams.BLACK,
        type: PieceType.BISHOP,
    });
    piece.push({
        image: Piece('bB'),
        x: 7,
        y: 5,
        team: Teams.BLACK,
        type: PieceType.BISHOP,
    });
};

export const pushKQ = (piece: Pieces[]) => {
    piece.push({
        image: Piece('wQ'),
        x: 0,
        y: 3,
        team: Teams.WHITE,
        type: PieceType.QUEEN,
    });
    piece.push({
        image: Piece('wK'),
        x: 0,
        y: 4,
        team: Teams.WHITE,
        type: PieceType.KING,
        isRookMoving: false,
        isKingMoving: false,
        isCheckMate: false,
        isKingInCheck: false,
    });
    piece.push({
        image: Piece('bQ'),
        x: 7,
        y: 3,
        team: Teams.BLACK,
        type: PieceType.QUEEN,
    });
    piece.push({
        image: Piece('bK'),
        x: 7,
        y: 4,
        team: Teams.BLACK,
        type: PieceType.KING,
        isRookMoving: false,
        isKingMoving: false,
        isCheckMate: false,
        isKingInCheck: false,
    });
};
