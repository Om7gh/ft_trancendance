import LocalGame  from './component/LocalGame.tsx';
import NormalGame from './component/NormalGame.tsx';
import Tournament from './component/Tournament.tsx';

function StartMenu() {

  return (
    <div className="flex justify-center gap-y-25 flex-col items-center h-full">
      <p className="bg-linear-30 from-neon to-violet-400 bg-clip-text text-transparent text-3xl text-shadow-md">
        Choose your battle !
      </p>
      <div className="space-y-12 flex flex-col text-center">
        <NormalGame />
        <Tournament />
        <div className="h-[0.5px] w-full bg-slate-100/20"></div>
        <LocalGame />
      </div>
    </div>
  );
}

export default StartMenu;
