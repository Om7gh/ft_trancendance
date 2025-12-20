import { Link } from 'react-router-dom';
import { GiPortal } from 'react-icons/gi';

function GamePortal() {
  return (
    <>
      <div className="pb-6 text-2xl bg-linear-30 from-violet-500 to-neon bg-clip-text text-transparent w-fit flex gap-4 items-center">
        <GiPortal className="w-16 h-16 text-violet-500" />
        <p>Game Portal</p>
      </div>

      <div className="flex lg:flex-row justify-between items-center gap-5 h-full text-center">
        <div
          className="group flex-1 w-full h-60 lg:h-full 
        bg-slate-950/30 relative rounded-lg overflow-hidden 
        hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] 
        duration-300 cursor-pointer"
        >
          <img
            src="/pingpong_portal.jpeg"
            alt="Pingpong"
            className="absolute inset-0 w-full h-full object-cover 
          opacity-40 group-hover:opacity-60 group-hover:scale-110 
          grayscale group-hover:grayscale-0
          duration-500"
          />

          <div
            className="absolute inset-0 bg-gradient-to-b 
          from-black/40 to-black/60 
          group-hover:from-black/20 group-hover:to-black/80 
          duration-500"
          />

          <div className="h-full flex items-center justify-center relative z-10">
            <Link
              to={'/dashboard/games/pingpong'}
              className="relative bg-slate-950/80 text-violet-200 
                       px-8 py-3 sm:px-10 sm:py-4 
                       w-60 sm:w-80 md:w-96 
                       text-lg sm:text-xl md:text-2xl
                       cursor-pointer
                       group-hover:text-white
                       duration-300
                       rounded-lg
                       border-2 border-violet-500/30
                       hover:border-neon
                       hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]"
            >
              <span className="relative z-10">Play PingPong</span>
            </Link>
          </div>
        </div>

        <div
          className="group flex-1 w-full h-60 lg:h-full 
        bg-slate-950/30 relative rounded-lg overflow-hidden 
        hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] 
        duration-300 cursor-pointer"
        >
          <img
            src="/chess_portal.jpeg"
            alt="Chess"
            className="absolute inset-0 w-full h-full object-cover 
          opacity-40 group-hover:opacity-60 group-hover:scale-110 
                     grayscale group-hover:grayscale-0
                     duration-500"
          />

          <div
            className="absolute inset-0 bg-gradient-to-b 
          from-black/40 to-black/60 
          group-hover:from-black/20 group-hover:to-black/80 
          duration-500"
          />

          <div className="h-full flex items-center justify-center relative z-10">
            <Link
              to={'/dashboard/games/chess'}
              className="relative bg-slate-950/80 text-violet-200 
            px-8 py-3 sm:px-10 sm:py-4 
            w-60 sm:w-80 md:w-96 
            text-lg sm:text-xl md:text-2xl
            cursor-pointer
            group-hover:text-white
            duration-300
            rounded-lg
            border-2 border-violet-500/30
            hover:border-neon
            hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]"
            >
              <span className="relative z-10">Play Chess</span>
            </Link>
          </div>
        </div>

        <div
          className="group flex-1 w-full h-60 lg:h-full 
        bg-slate-950/30 relative rounded-lg overflow-hidden 
        hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] 
        duration-300 cursor-pointer"
        >
          <img
            src="/costumization.png"
            alt="Customization"
            className="absolute inset-0 w-full h-full object-cover 
          opacity-40 group-hover:opacity-60 group-hover:scale-110 
          grayscale group-hover:grayscale-0
          duration-500"
          />

          <div
            className="absolute inset-0 bg-gradient-to-b 
          from-black/40 to-black/60 
          group-hover:from-black/20 group-hover:to-black/80 
          duration-500"
          />

          <div className="h-full flex items-center justify-center relative z-10">
            <Link
              to={'/dashboard/games/customization'}
              className="relative bg-slate-950/80 text-violet-200 
            px-8 py-3 sm:px-10 sm:py-4 
            w-60 sm:w-80 md:w-96 
            text-lg sm:text-xl md:text-2xl
            cursor-pointer
            group-hover:text-white
            duration-300
            rounded-lg
            border-2 border-violet-500/30
            hover:border-neon
            hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]"
            >
              <span className="relative z-10">Customization</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default GamePortal;
