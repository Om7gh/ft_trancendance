import type { Tournament } from '@/types/gameTypes';

function Participant({ player, index }: Tournament) {
  return (
    <div
      className={`flex items-center gap-5 px-4 py-2 w-52  rounded-lg shadow-2xl ${
        index && index % 2 === 0
          ? 'bg-gray-500'
          : 'bg-gradient-to-r from-violet-500 to-neon'
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
