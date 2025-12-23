import MenuButton from "./MenuButton.tsx";

function StartMenu() {

  return (
    <div className="border flex w-2/3 justify-center gap-y-25 flex-col items-center h-full">
      <p className="bg-linear-30 from-neon to-violet-400 bg-clip-text text-transparent text-3xl text-shadow-md">
        Choose your battle !
      </p>
      <div className="w-full space-y-12 flex flex-col text-center">
        <MenuButton destination="/dashboard/games/pingpong/local">
          Play Local
        </MenuButton>
        <MenuButton destination="/dashboard/games/pingpong/remote">
          One vs One
        </MenuButton>
        <div className="h-[0.5px] w-full bg-slate-100/20"></div>
        <MenuButton destination="/dashboard/games/tournament">
          Tournament
        </MenuButton>
      </div>
    </div>
  );
}

export default StartMenu;
