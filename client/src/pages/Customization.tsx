import { Titles } from '@/components/ui';
import ChessCustomization from '@/components/ui/game/ChessCustomization';
import PingpongCustomization from '@/components/ui/game/PingpongCustomization';
import { GiGamepad } from 'react-icons/gi';
function Customization() {
  return (
    <div className="h-full w-full">
      <Titles title="game Settings" icon={<GiGamepad />} />
      <div className="h-full flex justify-center items-center flex-col gap-6">
        <PingpongCustomization />
        <ChessCustomization />
      </div>
    </div>
  );
}

export default Customization;
