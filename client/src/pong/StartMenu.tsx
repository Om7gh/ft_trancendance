import LocalGame from '@/components/ui/game/LocalGame';
import NormalGame from '@/components/ui/game/NormalGame';
import Tournament from '@/components/ui/game/Tournament';
import { useTransStore } from '@/store/useTransStore';
import { Outlet } from 'react-router-dom';

function StartMenu() {
  const user = useTransStore((state) => state.user);
  console.log(user);
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
      <Outlet />
    </div>
  );
}

export default StartMenu;
