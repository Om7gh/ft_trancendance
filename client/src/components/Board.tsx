import type { BoardUpdateData, Position, Props } from '../types';
import { useEffect, useRef, useState } from 'react';
import { ChessRules } from '../classes/chessRules';
import { boardTile } from '../utils/boardTiles';
import { draggableEvent } from '../events';
import {
    getBoardCoordinates,
    getCurrentPiece,
    handleValidMove,
    validateTurn,
} from '../events/dropEvent';
import { useChessStore } from '../store/useChessStore';

export default function Board({
    pieces,
    setPieces,
    setPromotionPending,
    checkmate,
    syncBoard,
    opponentConnected,
    myTeam,
}: Props) {
    const [lastValidBoardCoords, setLastValidBoardCoords] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const currentTurn = useChessStore((state) => state.currentTurn);
    const setCurrentTurn = useChessStore((state) => state.setCurrentTurn);
    const boardRef = useRef<HTMLDivElement | null>(null);
    const [draggablePiece, setDraggablePiece] = useState<HTMLElement | null>(
        null
    );
    const [activePieceCoords, setActivePieceCoords] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const turns = useChessStore((state) => state.turns);
    const setTurns = useChessStore((state) => state.setTurns);
    const rules = new ChessRules();
    const prevMove = useChessStore((state) => state.prevMove);

    const resetDraggablePiece = () => {
        if (draggablePiece) {
            draggablePiece.style.position = '';
            draggablePiece.style.width = '';
            draggablePiece.style.height = '';
            draggablePiece.style.pointerEvents = '';
            draggablePiece.style.zIndex = '';
            draggablePiece.style.left = '';
            draggablePiece.style.top = '';
        }
        setDraggablePiece(null);
        setActivePieceCoords(null);
    };

    useEffect(() => {
        const handleSyncBoard = (event: CustomEvent<BoardUpdateData>) => {
            const { board, currentTurn, turns, prevMove } =
                event.detail as BoardUpdateData & { prevMove?: Position };
            setPieces(board);

            let normalizedPrev: { from: Position; to: Position } | null = null;
            if (prevMove) {
                // already has from/to
                if ((prevMove as any).from && (prevMove as any).to) {
                    normalizedPrev = prevMove as {
                        from: Position;
                        to: Position;
                    };
                } else if ((prevMove as any).x !== undefined) {
                    normalizedPrev = {
                        from: prevMove as Position,
                        to: prevMove as Position,
                    };
                }
            }

            useChessStore.setState({
                currentTurn,
                turns,
                prevMove: normalizedPrev ?? useChessStore.getState().prevMove,
            });
        };
        window.addEventListener('syncBoard', handleSyncBoard as EventListener);

        return () => {
            window.removeEventListener(
                'syncBoard',
                handleSyncBoard as EventListener
            );
        };
    }, [setPieces]);

    function updateMoves() {
        setPieces((prev) => {
            return prev.map((p) => {
                const possibleMoves = rules.getPossibleMove(prev, p);
                return {
                    ...p,
                    possibleMoves,
                };
            });
        });
    }

    const dragPiece = (
        e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
        if (checkmate.isCheckmate || !opponentConnected) return;
        const boardPos = getBoardCoordinates(e, boardRef, myTeam);
        if (!boardPos) return;
        const { newX, newY } = boardPos;
        const pieceUnderCursor = pieces.find(
            (p) => p.x === newX && p.y === newY
        );
        if (!pieceUnderCursor) return;
        if (!myTeam || pieceUnderCursor.team !== myTeam) return;

        updateMoves();
        draggableEvent(
            e,
            boardRef,
            setDraggablePiece,
            setActivePieceCoords,
            myTeam
        );
    };

    const movePiece = (
        e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
        if (checkmate.isCheckmate || !opponentConnected) return;

        const rect = boardRef.current?.getBoundingClientRect();
        if (!draggablePiece || !rect) return;

        const { x: clientX, y: clientY } =
            'touches' in e
                ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
                : { x: e.clientX, y: e.clientY };

        const px = clientX - rect.left - draggablePiece.offsetWidth / 2;
        const py = clientY - rect.top - draggablePiece.offsetHeight / 2;
        draggablePiece.style.left = `${px}px`;
        draggablePiece.style.top = `${py}px`;

        const coords = getBoardCoordinates(e, boardRef, myTeam);
        if (coords) {
            setLastValidBoardCoords({ x: coords.newX, y: coords.newY });
        }
    };

    const dropPiece = (
        e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
        if (checkmate.isCheckmate || !opponentConnected) return;

        if (!draggablePiece || !activePieceCoords) return resetDraggablePiece();

        const boardCoords = getBoardCoordinates(e, boardRef, myTeam);
        const finalCoords = boardCoords
            ? { x: boardCoords.newX, y: boardCoords.newY }
            : lastValidBoardCoords;

        if (!finalCoords) {
            return resetDraggablePiece();
        }

        const { x: newX, y: newY } = finalCoords;
        const currentPiece = getCurrentPiece(activePieceCoords, pieces);

        if (!currentPiece || !validateTurn(currentPiece, turns))
            return resetDraggablePiece();

        const validMove = rules.isValid(
            activePieceCoords.x,
            activePieceCoords.y,
            newX,
            newY,
            currentPiece.team,
            currentPiece.type,
            pieces
        );

        if (validMove) {
            handleValidMove(
                validMove,
                activePieceCoords,
                newX,
                newY,
                currentPiece,
                pieces,
                setPieces,
                setPromotionPending,
                setTurns,
                syncBoard,
                setCurrentTurn,
                currentTurn,
                turns,
                activePieceCoords
            );
        }
        resetDraggablePiece();
        setLastValidBoardCoords(null);
    };

    const boardTiles = boardTile({
        pieces,
        activePieceCoords,
        myTeam,
        prevMove,
    });

    return (
        <div
            ref={boardRef}
            id="board"
            onMouseDown={dragPiece}
            onMouseMove={movePiece}
            onMouseUp={dropPiece}
            onTouchStart={dragPiece}
            onTouchMove={movePiece}
            onTouchEnd={dropPiece}
            className="relative"
        >
            {boardTiles}
        </div>
    );
}
