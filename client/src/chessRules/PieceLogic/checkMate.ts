import type { Pieces } from '../../types';
import type { Teams } from '../../types/enums';
import {
    isKingInCheckWithUpdatedMoves,
    updatePossibleMoves,
} from './kingProtection';
import { ChessRules } from '../../classes/chessRules';

const isCheckMate = (board: Pieces[], team: Teams): boolean => {
    const king = board.find((p) => p.type === 'KING' && p.team === team);
    if (!king) return false;

    const boardWithUpdatedMoves = updatePossibleMoves(board);
    if (!isKingInCheckWithUpdatedMoves(team, boardWithUpdatedMoves))
        return false;

    const rules = new ChessRules();
    const army = board.filter((p) => p.team === team);

    for (const piece of army) {
        const legalMoves = rules.getPossibleMove(board, piece);
        if (legalMoves.length > 0) {
            return false;
        }
    }

    return true;
};

export { isCheckMate };
