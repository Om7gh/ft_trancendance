import MenuButton from "./MenuButton.tsx";
import { FaBattleNet } from "react-icons/fa6";
import { TbTournament } from "react-icons/tb";
import { TbPingPong } from "react-icons/tb";
import { FaTableTennisPaddleBall } from "react-icons/fa6";


function StartMenu() {

  return (
    <div className="space-y-8 bg-linear-to-b from-slate-950/20 to-violet-900/30 w-full  md:w-1/2 lg:1/2 m-2 p-10 shadow-xl shadow-slate-900 text-center">
      <p className="bg-linear-to-l from-neon to-violet-400 bg-clip-text text-transparent text-xl md:text-3xl w-fit m-auto my-5 flex items-center gap-3 text-left">
        < FaBattleNet className="text-violet-500 text-5xl " />
          Choose your battle !
      </p>
      <div className="w-full space-y-12 flex flex-col text-center">
        <MenuButton destination="/dashboard/games/pingpong/local">
           < FaTableTennisPaddleBall className="text-4xl text-slate-900/80" />
        <div className="flex flex-col items-start">
             <h2 className="text-lg md:text-xl lg:text-xl">Play Local</h2>
           <span className="text-xs md:text-sm lg:text-sm text-left text-violet-950/70">Test Your skill offline</span>
        </div>
        </MenuButton>
        <MenuButton destination="/dashboard/games/pingpong/remote">
          < TbPingPong className="text-4xl text-slate-900/80" />
        <div className="flex flex-col items-start">
            <h2 className="text-lg md:text-xl lg:text-xl">Play Online</h2>
           <span className="text-xs md:text-sm lg:text-sm text-left text-violet-950/70">Play online games with random players</span>
        </div>
        </MenuButton>
        <MenuButton destination="/dashboard/games/tournament">
        < TbTournament className="text-4xl text-slate-900/80" />
        <div className="flex flex-col items-start">
          <h2 className="text-lg text-left md:text-xl lg:text-xl">Play Tournament</h2>
          <span className="text-xs md:text-sm lg:text-sm text-left text-violet-950/70">Join or create a tournament</span>
        </div>
        </MenuButton>
      </div>
    </div>
  );
}

export default StartMenu;
