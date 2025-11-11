import { useState } from "react";

import useFetchAllPlayers from "@/services/useFetchAllPlayer";
import {
  IncommingTournament,
  PlayersPreview,
  ProfileOverview,
  Titles,
} from "@/components/ui";

export default function Games() {
  const [clickedPlayer, setClickedPlayer] = useState<string | number>("");
  const { players, isPending } = useFetchAllPlayers();

  function handleClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    setClickedPlayer(target.id);
  }

  if (players === undefined) return <p>error </p>;
  const currentPlayer = players.filter(
    ({ id }: { id: number }) => id === clickedPlayer
  );

  return (
    <div className="w-3/5 mx-auto py-8">
      <Titles title="Games" />

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <div className="flex-1 space-y-6">
          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 shadow-lg px-4 py-2">
            {isPending ? (
              <p className="text-center ">Loading ...</p>
            ) : (
              <PlayersPreview players={players} onClick={handleClick} />
            )}
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-lg p-6">
            <IncommingTournament />
          </div>
        </div>

        {/* {currentPlayer.length > 0 && ( */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 shadow-lg px-6 py-4 sticky top-6 w-96">
            <ProfileOverview data={currentPlayer} />
          </div>
        </div>
        {/* )} */}
      </div>

      {/* <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-lg p-6 my-5">
        <div className="flex justify-between items-center text-slate-200">
          <p>Tournament Historique</p>
          <p className="text-xl bg-orange-500 px-2 rounded-full py-1">&darr;</p>
        </div>
        <hr className="my-5 text-slate-200 opacity-10" />
        <div className="grid grid-cols-3">
          <div className="flex flex-col gap-5">
            <p className="text-slate-300">Tournament name</p>
            <p>Summer shudown</p>
          </div>
          <div>
            <p className="text-slate-300">date</p>
            <p>thu, aug 15, 06:00pm</p>
          </div>
          <div>
            <p className="text-slate-300">winners</p>
            <img
              src={players[0].avatar}
              className="w-12 h-12 object-cover rounded-full"
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}
