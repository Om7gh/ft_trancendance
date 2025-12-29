import { Link } from 'react-router-dom';

function GamePortal() {
  return (
    <div className='w-full h-full'>

      <div className=" grid grid-cols-1 md:grid-cols-3 h-full text-center gap-5 place-items-center p-2">
        <Link to={'/dashboard/games/pingpong'}
          className="group flex-1 w-full lg:h-full 
        bg-slate-950/30 relative rounded-lg overflow-hidden 
        hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] 
        duration-300 cursor-pointer h-96"
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
            className="absolute inset-0 bg-linear-to-b 
          from-black/40 to-black/60 
          group-hover:from-black/20 group-hover:to-black/80 
          duration-500"
          />

          <div className="h-full flex items-center justify-center relative z-10">
            <p
              className='text-xl md:text-4xl text-neon'
            >
              Play Pong
            </p>
          </div>
        </Link>

        <Link to={'/dashboard/games/chess'}
          className="group flex-1 w-full h-96 lg:h-full 
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
            className="absolute inset-0 bg-linear-to-b 
          from-black/40 to-black/60 
          group-hover:from-black/20 group-hover:to-black/80 
          duration-500"
          />

          <div className="h-full flex items-center justify-center relative z-10">
          <p
              className='text-xl md:text-4xl text-neon'
            >
              Play Chess
            </p>
          </div>
        </Link>

        <Link to={'/dashboard/games/customization'}
          className="group flex-1 w-full h-96 lg:h-full 
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
            className="absolute inset-0 bg-linear-to-b 
          from-black/40 to-black/60 
          group-hover:from-black/20 group-hover:to-black/80 
          duration-500"
          />

          <div className="h-full flex items-center justify-center relative z-10">
            <p
              className='text-xl md:text-4xl text-neon'
            >
              Game Customization
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default GamePortal;
