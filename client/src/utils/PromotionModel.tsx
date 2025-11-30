import { Piece } from '.';
import { PieceType, type Teams } from '../types/enums';

const PromotionModal = ({
    team,
    onSelect,
}: {
    team: Teams;
    onSelect: (pieceType: PieceType) => void;
}) => {
    const promotionPieces: PieceType[] = [
        PieceType.QUEEN,
        PieceType.ROCK,
        PieceType.BISHOP,
        PieceType.KNIGHT,
    ];

    const teamType = team === 'WHITE' ? 0 : 1;

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 w-full m-auto">
            <div className="flex justify-evenly bg-neon-400/80 backdrop-blur-md rounded-lg w-[40vmax] py-8">
                {promotionPieces.map((pieceType) => {
                    let pieceImage;
                    switch (pieceType) {
                        case 'QUEEN':
                            pieceImage =
                                teamType === 0 ? Piece('wQ') : Piece('bQ');
                            break;
                        case 'ROCK':
                            pieceImage =
                                teamType === 0 ? Piece('wR') : Piece('bR');
                            break;
                        case 'BISHOP':
                            pieceImage =
                                teamType === 0 ? Piece('wB') : Piece('bB');
                            break;
                        case 'KNIGHT':
                            pieceImage =
                                teamType === 0 ? Piece('wN') : Piece('bN');
                            break;
                        default:
                            console.log('invalid piece');
                    }
                    return (
                        <button
                            key={pieceType}
                            onClick={() => onSelect(pieceType)}
                            className="hover:scale-110 transition-transform duration-200"
                        >
                            <img
                                src={pieceImage}
                                alt={pieceType}
                                className="w-[4vmax] h-[4vmax]"
                                onError={(e) => {
                                    (
                                        e.target as HTMLImageElement
                                    ).style.display = 'none';
                                }}
                            />
                            <div className="text-slate-200 font-semibold mt-2">
                                {pieceType}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PromotionModal;
