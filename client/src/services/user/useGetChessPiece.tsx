import { useQuery } from '@tanstack/react-query';
import AuthService from '../auth/auth.service';
import { useChessStore } from '@/store/useChessStore';
import { useEffect } from 'react';

function normalizePieceSetName(data: unknown): string | null {
    if (typeof data === 'string') return data.trim() || null;
    if (!data || typeof data !== 'object') return null;

    const obj = data as Record<string, unknown>;
    const candidate =
        (obj.pieceSetName as string | undefined) ??
        (obj.pieceSet as string | undefined) ??
        (obj.chess_piece as string | undefined) ??
        (obj.name as string | undefined) ??
        (obj.piece as string | undefined);

    return typeof candidate === 'string' ? candidate.trim() || null : null;
}

export function useGetChessPiece() {
    const setPieceSetName = useChessStore((state) => state.setPieceSetName);
    const currentPieceSetName = useChessStore((state) => state.pieceSetName);

    const query = useQuery({
        queryKey: ['chessPiece'],
        queryFn: async (): Promise<string> => {
            const data = await AuthService.getChessPiece();
            return normalizePieceSetName(data) ?? 'fantasy';
        },
        placeholderData: currentPieceSetName,
    });

    useEffect(() => {
        if (query.data) setPieceSetName(query.data);
    }, [query.data, setPieceSetName]);

    return query;
}