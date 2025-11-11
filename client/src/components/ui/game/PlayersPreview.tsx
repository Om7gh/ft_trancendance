type PlayersTypes = {
  username: string;
  avatar: string;
  id: string;
};

export default function PlayersPreview({
  players,
  onClick,
}: {
  players: PlayersTypes[];
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-slate-200 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
        Online Players
      </h3>

      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 w-10  to-transparent z-10 pointer-events-none" />

        <ul className="flex gap-4 pb-4 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar">
          {players?.map((player) => (
            <li
              key={player.id}
              className="cursor-pointer transition-transform hover:scale-105 flex-shrink-0 snap-start"
              onClick={onClick}>
              <div className="flex flex-col items-center">
                <img
                  src={player.avatar}
                  alt={player.username}
                  id={player.id}
                  className="w-16 h-16 rounded-full border-2 border-teal-500 object-cover hover:border-teal-300 transition-colors"
                />
                <p className="text-center text-sm text-slate-300 mt-1 max-w-[80px] truncate">
                  {player.username}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
