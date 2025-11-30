import { enPassant } from '../chessRules/PieceLogic/enPassant';
import type { Pieces, Position } from '../types';

const getBoardCoordinates = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    boardRef: React.RefObject<HTMLDivElement | null>,
    myTeam: 'WHITE' | 'BLACK' | null
): { newX: number; newY: number; tileSize: number } | null => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return null;

    let clientX: number, clientY: number;

    if ('touches' in e) {
        const touch = e.touches[0] || e.changedTouches[0];
        if (!touch) return null;
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const tileSize = rect.width / 8;
    const displayX = 7 - Math.floor((clientY - rect.top) / tileSize);
    const displayY = Math.floor((clientX - rect.left) / tileSize);

    let newX = displayX;
    let newY = displayY;
    if (myTeam === 'BLACK') {
        newX = 7 - displayX;
        newY = 7 - displayY;
    }

    if (newX < 0 || newX > 7 || newY < 0 || newY > 7) return null;

    return { newX, newY, tileSize };
};

const getCurrentPiece = (
    activePieceCoords: { x: number; y: number } | null,
    pieces: Pieces[]
): Pieces | null => {
    if (!activePieceCoords) return null;

    return (
        pieces.find(
            (p) => p.x === activePieceCoords.x && p.y === activePieceCoords.y
        ) || null
    );
};

const validateTurn = (currentPiece: Pieces | null, turns: number): boolean => {
    if (!currentPiece) return false;

    if (currentPiece.team === 'WHITE' && turns % 2 === 0) return false;
    if (currentPiece.team === 'BLACK' && turns % 2 === 1) return false;

    return true;
};

const isPromotionMove = (currentPiece: Pieces, newX: number): boolean => {
    return (
        currentPiece.type === 'PAWN' &&
        ((currentPiece.team === 'WHITE' && newX === 7) ||
            (currentPiece.team === 'BLACK' && newX === 0))
    );
};

const updatePiecesForMove = (
    prevPieces: Pieces[],
    activePieceCoords: { x: number; y: number },
    newX: number,
    newY: number,
    currentPiece: Pieces,
    isEnPassantMove: boolean
): Pieces[] => {
    const resetEnPassantPieces = prevPieces.map((p) => ({
        ...p,
        isEmpassant: false,
    }));

    return resetEnPassantPieces
        .map((p) => {
            if (p.x === activePieceCoords.x && p.y === activePieceCoords.y) {
                const movedFlags =
                    p.type === 'KING'
                        ? { isKingMoving: true }
                        : p.type === 'ROCK'
                        ? { isRookMoving: true }
                        : {};
                if (
                    Math.abs(activePieceCoords.x - newX) === 2 &&
                    p.type === 'PAWN'
                ) {
                    return {
                        ...p,
                        x: newX,
                        y: newY,
                        isEmpassant: true,
                        ...movedFlags,
                    };
                } else {
                    return {
                        ...p,
                        x: newX,
                        y: newY,
                        isEmpassant: false,
                        ...movedFlags,
                    };
                }
            }

            if (p.x === newX && p.y === newY && p.team !== currentPiece.team) {
                return null;
            }

            if (
                isEnPassantMove &&
                p.x === activePieceCoords.x &&
                p.y === newY &&
                p.team !== currentPiece.team
            ) {
                return null;
            }

            return p;
        })
        .filter((p) => p !== null);
};

const handleValidMove = (
    validMove: boolean | Pieces[],
    activePieceCoords: { x: number; y: number },
    newX: number,
    newY: number,
    currentPiece: Pieces,
    pieces: Pieces[],
    setPieces: (pieces: Pieces[] | ((prev: Pieces[]) => Pieces[])) => void,
    setPromotionPending: (
        promotion: {
            piece: Pieces;
            newX: number;
            newY: number;
        } | null
    ) => void,
    setTurns: () => void,
    syncBoard: (
        board: Pieces[],
        currentTurn: 'WHITE' | 'BLACK',
        turns: number,
        prevMove: { from: Position; to: Position } | null
    ) => void,
    setCurrentTurn: () => void,
    currentTurn: 'WHITE' | 'BLACK',
    turns: number,
    // prevMove param is not used here; origin/destination are constructed inside the handler
    _prevMove: Position
): void => {
    const pieceMoved =
        activePieceCoords.x !== newX || activePieceCoords.y !== newY;

    if (Array.isArray(validMove)) {
        const newPieces = validMove.map((p) => ({
            ...p,
            isEmpassant: false,
        })) as Pieces[];
        setPieces(newPieces);
        if (pieceMoved) {
            setTurns();
            setCurrentTurn();
            // send both from (origin) and to (destination) so UI can highlight both
            syncBoard(newPieces, currentTurn, turns + 1, {
                from: activePieceCoords,
                to: { x: newX, y: newY },
            });
        }
    } else if (validMove === true) {
        if (isPromotionMove(currentPiece, newX)) {
            setPromotionPending({
                piece: currentPiece,
                newX,
                newY,
            });
        } else {
            const isEnPassantMove = enPassant(
                activePieceCoords.x,
                activePieceCoords.y,
                newX,
                newY,
                currentPiece.team,
                pieces,
                currentPiece.type
            );

            const newPieces = updatePiecesForMove(
                pieces,
                activePieceCoords,
                newX,
                newY,
                currentPiece,
                isEnPassantMove
            ) as Pieces[];

            setPieces(newPieces);
            if (pieceMoved) {
                setTurns();
                setCurrentTurn();
                // send both from (origin) and to (destination) so UI can highlight both
                syncBoard(newPieces, currentTurn, turns + 1, {
                    from: activePieceCoords,
                    to: { x: newX, y: newY },
                });
            }
        }
    }
};

export {
    getBoardCoordinates,
    getCurrentPiece,
    handleValidMove,
    updatePiecesForMove,
    validateTurn,
};
