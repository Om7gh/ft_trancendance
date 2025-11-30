import { create } from 'zustand';
import type { Position } from '../types';

type PrevMove = { from: Position; to: Position } | null;

type Store = {
    turns: number;
    setTurns: () => void;
    currentTurn: 'WHITE' | 'BLACK';
    setCurrentTurn: () => void;
    isKingInCheck: boolean;
    setIsKingInCheck?: () => void;
    prevMove: PrevMove;
    setPrevMove: (pm: PrevMove) => void;
};

const useChessStore = create<Store>()((set) => ({
    prevMove: null,
    setPrevMove: (pm: PrevMove) => set(() => ({ prevMove: pm })),
    currentTurn: 'WHITE',
    isKingInCheck: false,
    setIsKingInCheck: () =>
        set((state) => ({
            isKingInCheck: state.isKingInCheck === true ? false : true,
        })),
    turns: 1,
    setTurns: () => set((state) => ({ turns: state.turns + 1 })),
    setCurrentTurn: () =>
        set((state) => ({
            currentTurn: state.currentTurn === 'WHITE' ? 'BLACK' : 'WHITE',
        })),
}));

export { useChessStore };
