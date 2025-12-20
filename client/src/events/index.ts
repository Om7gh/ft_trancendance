import React from 'react';

function draggableEvent(
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    boardRef: React.RefObject<HTMLDivElement | null>,
    setDraggablePiece: React.Dispatch<React.SetStateAction<HTMLElement | null>>,
    setActivePieceCoords: React.Dispatch<
        React.SetStateAction<{
            x: number;
            y: number;
        } | null>
    >,
    myTeam: 'WHITE' | 'BLACK' | null
) {
    if ('touches' in e)
        touchEvent(
            e,
            boardRef,
            setDraggablePiece,
            setActivePieceCoords,
            myTeam
        );
    else {
        const target = e.target as HTMLDivElement;
        const rect = boardRef.current?.getBoundingClientRect();
        if (target.classList.contains('piece') && rect) {
            const tileSize = rect.width / 8;
            const displayX = 7 - Math.floor((e.clientY - rect.top) / tileSize);
            const displayY = Math.floor((e.clientX - rect.left) / tileSize);

            let x = displayX;
            let y = displayY;
            if (myTeam === 'BLACK') {
                x = 7 - displayX;
                y = 7 - displayY;
            }

            setDraggablePiece(target);
            setActivePieceCoords({ x, y });

            target.style.position = 'absolute';
            target.style.width = '4vmax';
            target.style.height = '4vmax';
            target.style.pointerEvents = 'none';
            target.style.zIndex = '1000';

            const boardX = e.clientX - rect.left - target.offsetHeight / 2;
            const boardY = e.clientY - rect.top - target.offsetWidth / 2;

            target.style.left = `${boardX}px`;
            target.style.top = `${boardY}px`;
        }
    }
}

function touchEvent(
    e: React.TouchEvent<HTMLDivElement>,
    boardRef: React.RefObject<HTMLDivElement | null>,
    setDraggablePiece: React.Dispatch<React.SetStateAction<HTMLElement | null>>,
    setActivePieceCoords: React.Dispatch<
        React.SetStateAction<{
            x: number;
            y: number;
        } | null>
    >,
    myTeam: 'WHITE' | 'BLACK' | null
) {
    const target = e.touches[0].target as HTMLDivElement;
    const rect = boardRef.current?.getBoundingClientRect();

    if (target.classList.contains('piece') && rect) {
        const tileSize = rect.width / 8;
        const displayX =
            7 - Math.floor((e.touches[0].clientY - rect.top) / tileSize);
        const displayY = Math.floor(
            (e.touches[0].clientX - rect.left) / tileSize
        );

        let x = displayX;
        let y = displayY;
        if (myTeam === 'BLACK') {
            x = 7 - displayX;
            y = 7 - displayY;
        }

        setDraggablePiece(target);
        setActivePieceCoords({ x, y });

        target.style.position = 'absolute';
        target.style.width = '4vmax';
        target.style.height = '4vmax';
        target.style.pointerEvents = 'none';
        target.style.zIndex = '1000';

        const boardX =
            e.touches[0].clientX - rect.left - target.offsetHeight / 2;
        const boardY = e.touches[0].clientY - rect.top - target.offsetWidth / 2;

        target.style.left = `${boardX}px`;
        target.style.top = `${boardY}px`;
    }
}

export { draggableEvent };
