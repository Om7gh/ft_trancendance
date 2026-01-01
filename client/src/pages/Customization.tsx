import { Logo } from '@/assets';
import ChessCustomization from '@/components/ui/game/ChessCustomization';
import PingpongCustomization from '@/components/ui/game/PingpongCustomization';

function Customization() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-10">
      <img src={Logo} alt="logo" className='w-55 h-55' />
      <div className="flex justify-center items-center flex-col gap-6">
        <PingpongCustomization />
        <ChessCustomization />
      </div>
    </div>
  );
}

export default Customization;
