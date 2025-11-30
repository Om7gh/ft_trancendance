import { useState } from 'react';
import PingpongSettings from './customization/PingpongSettings';
import { GiPingPongBat } from 'react-icons/gi';
import Modal from '@/components/layout/Modal';

function PingpongCustomization() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <PingpongSettings />
        </Modal>
      )}
      <div
        className="group relative px-8 py-6 overflow-hidden bg-slate-900/50       backdrop-blur-sm w-80 sm:w-96 md:w-[28rem]
      [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]
      before:[clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]
      hover:before:shadow-[0_0_20px_rgba(139,92,246,0.6)]
      before:transition-all before:duration-300"
        onClick={() => setOpenModal(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-neon opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>

        <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-neon transform -skew-y-6 group-hover:w-2 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300"></div>
        <div className="absolute -right-1 top-0 bottom-0 w-1 bg-gradient-to-b from-neon to-violet-500 transform skew-y-6 group-hover:w-2 group-hover:shadow-[0_0_15px_var(--color-neon)] transition-all duration-300"></div>

        <div className="absolute left-0 right-0 -top-1 h-1 bg-gradient-to-r from-violet-500 to-neon transform -skew-x-6 group-hover:h-2 transition-all duration-300"></div>
        <div className="absolute left-0 right-0 -bottom-1 h-1 bg-gradient-to-r from-neon to-violet-500 transform skew-x-6 group-hover:h-2 transition-all duration-300"></div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_30px_rgba(168,85,247,0.3)]"></div>

        <div className="relative z-10 flex items-center gap-4 justify-center">
          <GiPingPongBat className="text-5xl text-violet-500 group-hover:text-neon group-hover:rotate-12 transition-all duration-300" />
          <span className="text-3xl bg-gradient-to-br from-violet-500 to-neon bg-clip-text text-transparent font-bold group-hover:scale-105 inline-block transition-transform duration-300">
            ping pong
          </span>
        </div>
      </div>
    </>
  );
}

export default PingpongCustomization;
