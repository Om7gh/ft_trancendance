import { useContext, useEffect, useState } from 'react';
import { getPiece } from '@/utils';
import { GlobalContext } from '@/App';
import { useChessStore } from '@/store/useChessStore';
import { useGetChessPiece } from '@/services/user/useGetChessPiece';
import { useUpdateChessPiece } from '@/services/user/useUpdateChessPiece';

const allPieces = [
  'alpha',
  'anarcandy',
  'caliente',
  'california',
  'cardinal',
  'cburnett',
  'celtic',
  'chess7',
  'chessnut',
  'companion',
  'cooke',
  'disguised',
  'dubrovny',
  'fantasy',
  'firi',
  'fresca',
  'gioco',
  'governor',
  'horsey',
  'icpieces',
  'kiwen-suwi',
  'kosal',
  'leipzig',
  'letter',
  'maestro',
  'merida',
  'monarchy',
  'mono',
  'mpchess',
  'pirouetti',
  'pixel',
  'reillycraig',
  'rhosgfx',
  'riohacha',
  'shapes',
  'spatial',
  'staunty',
  'tatiana',
  'xkcd',
];

function ChessSettings({close} : {close: () => void}) {
  useGetChessPiece();
  const { user } = useContext(GlobalContext);
  const pieceSetName = useChessStore((s) => s.pieceSetName);
  const updateChessPiece = useUpdateChessPiece();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!selected && pieceSetName) setSelected(pieceSetName);
  }, [pieceSetName, selected]);

  const pieces = allPieces.map((name) => ({
    name,
    url: getPiece('wK', name),
  }));

  return (
    <div>
      <div className="grid sm:grid-cols-3 md:grid-cols-6 grid-cols-2 gap-6 my-5">
        {pieces.map((piece) => (
          <button
            key={piece.name}
            type="button"
            onClick={() => setSelected(piece.name)}
            className={`flex flex-col items-center justify-center text-center  p-3 transition-all duration-200
              ${
                selected === piece.name
                  ? 'ring-2 ring-offset-2 ring-violet-500/60 bg-slate-800/60'
                  : 'hover:bg-slate-950/50'
              }`}
            aria-pressed={selected === piece.name}
          >
            <img
              src={piece.url}
              alt={piece.name}
              className="w-20 h-20 object-contain mx-auto mb-2 grayscale group-hover:grayscale-0 transition-all duration-300"
            />
            <span className="font-main text-xs text-violet-400 truncate">
              {piece.name}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <button
          type="button"
          disabled={!selected}
          className={`w-52 block m-auto text-xl  p-3 shadow-xl transition-all duration-200
            ${
              selected
                ? 'bg-gradient-to-r from-violet-600 to-neon text-white'
                : 'bg-slate-800/30 text-slate-400 cursor-not-allowed'
            }`}
          onClick={() => {
            if (!selected) return;
            if (!user?.id) return;
            updateChessPiece.mutate({ id: user.id, chess_piece: selected });
            close()
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default ChessSettings;
