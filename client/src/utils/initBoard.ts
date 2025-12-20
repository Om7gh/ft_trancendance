// initBoard.ts
import { Piece, pushKnight, pushKQ, pushPishop, pushRocks } from '.';
import type { Pieces } from '../types';
import { PieceType, Teams } from '../types/enums';

const initBoard = () => {
    const initBoardState: Pieces[] = [];

    for (let i = 0; i < 8; i++) {
        initBoardState.push({
            image: Piece('wP'),
            x: 1,
            y: i,
            team: Teams.WHITE,
            type: PieceType.PAWN,
        });
    }

    for (let i = 0; i < 8; i++) {
        initBoardState.push({
            image: Piece('bP'),
            x: 6,
            y: i,
            team: Teams.BLACK,
            type: PieceType.PAWN,
        });
    }

    pushRocks(initBoardState);
    pushKnight(initBoardState);
    pushPishop(initBoardState);
    pushKQ(initBoardState);

    return initBoardState;
};

export { initBoard };
