import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import AuthService from '../auth/auth.service';
import { useChessStore } from '@/store/useChessStore';

export function useUpdateChessPiece() {
  const setPieceSetName = useChessStore((s) => s.setPieceSetName);

  return useMutation({
    mutationKey: ['update-chess-piece'],
    mutationFn: AuthService.updateChessPiece,
    onSuccess: (_res: any, variables: any) => {
      setPieceSetName(variables.chess_piece);
      toast.success('Chess piece set updated');
    },
    onError: (err: any) => {
      toast.error(err?.message ?? 'Failed to update chess piece set');
    },
  });
}
