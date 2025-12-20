import ChessCustomization from '@/components/ui/game/ChessCustomization';
import PingpongCustomization from '@/components/ui/game/PingpongCustomization';
import { TbSettingsDown } from 'react-icons/tb';

function Customization() {
  return (
    <div className="h-1/2 w-full flex flex-col justify-evenly items-center gap-10">
      <h2 className="text-center bg-linear-0 from-violet-500 to-neon bg-clip-text text-transparent text-4xl flex gap-5 items-center ">
        <TbSettingsDown className="w-16 h-16 text-violet-300 bg-slate-900/50 p-2 shadow-xl" />
        Game Settings
      </h2>
      <div className="flex justify-center items-center flex-col gap-6">
        <PingpongCustomization />
        <ChessCustomization />
      </div>
    </div>
  );
}

export default Customization;
