import { HORIZONTAL_AXIS, VERTICAL_AXIS } from '.';
import Tile from '../components/Tile';
import { isKingInCheckWithUpdatedMoves } from '../chessRules/PieceLogic/kingProtection';
import type { Position } from '../types';
import type { PieceType, Teams } from '../types/enums';

interface Piece {
    x: number;
    y: number;
    image: string;
    possibleMoves?: Position[];
    team: Teams;
    type: PieceType;
    isKingInCheck?: boolean | undefined;
}

interface Props {
    pieces: Piece[];
    activePieceCoords: {
        x: number;
        y: number;
    } | null;
    myTeam: 'WHITE' | 'BLACK' | null;
    prevMove: { from: Position; to: Position } | null;
}

const boardTile = ({ pieces, activePieceCoords, myTeam, prevMove }: Props) => {
    const board = [];
    for (let x = VERTICAL_AXIS.length - 1; x >= 0; x--) {
        for (let y = 0; y < HORIZONTAL_AXIS.length; y++) {
            let image = undefined;
            const boardX = myTeam === 'BLACK' ? 7 - x : x;
            const boardY = myTeam === 'BLACK' ? 7 - y : y;

            const currentPiece = pieces.find(
                (p) =>
                    p.x === activePieceCoords?.x && p.y === activePieceCoords?.y
            );

            const highlight = currentPiece?.possibleMoves
                ? currentPiece.possibleMoves.some(
                      (p) => p.x === boardX && p.y === boardY
                  )
                : false;

            const prevMoveHighlight =
                !!prevMove &&
                ((prevMove.from.x === boardX && prevMove.from.y === boardY) ||
                    (prevMove.to.x === boardX && prevMove.to.y === boardY));

            image = pieces.find((p) => p.x === boardX && p.y === boardY)?.image;

            const king = pieces.find(
                (p) => p.type === 'KING' && p.team === myTeam
            );
            const kingInCheck =
                king && myTeam
                    ? isKingInCheckWithUpdatedMoves(myTeam as any, pieces)
                    : false;

            const highlightKingInCheck =
                !!king && kingInCheck && king.x === boardX && king.y === boardY;

            board.push(
                <Tile
                    piece={image}
                    file={x}
                    rank={y}
                    key={`${x}-${y}`}
                    highlight={highlight}
                    prevMoveHighlight={prevMoveHighlight}
                    highlightKingInCheck={highlightKingInCheck}
                />
            );
        }
    }

    return board;
};

export { boardTile };
