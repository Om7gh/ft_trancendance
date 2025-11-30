import { Link } from 'react-router-dom';

function GamePortal() {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-5 h-full text-center">
      <div
        className="group flex-1 w-full h-60 lg:h-full 
                   bg-slate-950/30 relative rounded-xl overflow-hidden 
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
                       [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]
                       before:absolute before:inset-0 
                       before:bg-gradient-to-r before:from-violet-500 before:to-neon
                       before:[clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]
                       before:p-[3px]
                       before:-z-10
                       hover:before:shadow-[0_0_20px_rgba(139,92,246,0.6)]
                       before:duration-300"
          >
            <span className="relative z-10">Play PingPong</span>
          </Link>
        </div>
      </div>

      <div
        className="group flex-1 w-full h-60 lg:h-full 
                   bg-slate-950/30 relative rounded-xl overflow-hidden 
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
                       [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]
                       before:absolute before:inset-0 
                       before:bg-gradient-to-r before:from-violet-500 before:to-neon
                       before:[clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]
                       before:p-[3px]
                       before:-z-10
                       hover:before:shadow-[0_0_20px_rgba(139,92,246,0.6)]
                       before:duration-300"
          >
            <span className="relative z-10">Play Chess</span>
          </Link>
        </div>
      </div>

      <div
        className="group flex-1 w-full h-60 lg:h-full 
                   bg-slate-950/30 relative rounded-xl overflow-hidden 
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
                       [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]
                       before:absolute before:inset-0 
                       before:bg-gradient-to-r before:from-violet-500 before:to-neon
                       before:[clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]
                       before:p-[3px]
                       before:-z-10
                       hover:before:shadow-[0_0_20px_rgba(139,92,246,0.6)]
                       before:duration-300"
          >
            <span className="relative z-10">Customization</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GamePortal;
