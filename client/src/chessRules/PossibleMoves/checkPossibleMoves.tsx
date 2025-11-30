import type { Pieces } from '../../types';
import type { Teams } from '../../types/enums';
import { ChessRules } from '../../classes/chessRules';

const checkPossibleMoves = (board: Pieces[], team: Teams): boolean => {
    const rules = new ChessRules();
    const army = board.filter((p) => p.team === team);
    if (army.length === 0) return true;

    for (const piece of army) {
        const legal = rules.getPossibleMove(board, piece);
        if (legal.length > 0) return false;
    }
    return true;
};

export { checkPossibleMoves };
