import type { Tournament } from '@/types/gameTypes';

function Participant({ player, index }: Tournament) {
  return (
    <div
      className={`flex flex-col items-center gap-5 px-4 py-2 w-60 shadow-xl shadow-slate-900 ${
        index && index % 2 === 0
          ? 'bg-gray-500'
          : 'bg-gradient-to-b from-violet-500 to-neon'
      }`}
    >
      <img
        src={player.avatar}
        className={`w-10 h-10 ${
          index! % 2 === 0 && player.round > 1 ? 'grayscale' : null
        }`}
      />
      <span className="text-sm text-slate-800">{player.username}</span>
    </div>
  );
}

export default Participant;
