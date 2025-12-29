import { Outlet, Link } from 'react-router';
import React from 'react';
import { MdGamepad } from 'react-icons/md';
import MenuButton from '../component/MenuButton';
import { RiPingPongFill } from "react-icons/ri";
import { FaHandPointLeft } from "react-icons/fa";


export type MenuOptionPropsType = {
  children: React.ReactNode;
  destination: string;
};

export function MenuOption({ children, destination }: MenuOptionPropsType) {
  return (
    <Link
      to={destination}
      className="block border w-2/3 h-1/7 text-xl text-center m-auto my-4 p-4"
    >
      {children}
    </Link>
  );
}

export type MenuPropsType = {
  children: React.ReactNode;
};

export function Menu({ children }: MenuPropsType) {
  return (
   <div className="space-y-8 bg-linear-to-b from-slate-950/20 to-violet-900/30 w-96 md:w-[30vmax] p-10 shadow-xl shadow-slate-900 text-center">
      <nav className="">
        <h2 className="text-center bg-linear-0 from-violet-500 to-neon bg-clip-text text-transparent text-3xl flex gap-5 items-center justify-center  mb-5">
          <MdGamepad className="w-12 h-12 text-violet-300 bg-slate-900/50 p-2 shadow-xl" />
          Pong Menu
        </h2>
        {children}
      </nav>
    </div>
  );
}

export function RemoteOptions() {
  return (
    <Menu>
      <div className="flex flex-col gap-10 items-center justify-center">       
        <MenuButton destination='/dashboard/games/pingpong/remote/someone' >
        <div className='flex gap-3 items-center'>
          <RiPingPongFill className='w-8 h-8' />
          <div className='flex flex-col items-start'>
          <span className='text-lg md:text-xl'>Find Opponent</span>
          <span className='text-xs text-slate-800/80'>Play With Random</span>
          </div>
        </div>
        </MenuButton>
        <MenuButton destination='/dashboard/games/pingpong' >
          <div className='flex gap-3 items-center'>
          <FaHandPointLeft className='w-8 h-8' />
          <span className='text-lg md:text-xl'>Back</span>
        </div>
        </MenuButton>
      </div>
    </Menu>
  );
}

export function PongRemote() {
  return (
    <div className="w-full grid place-items-center">
      <Outlet />
    </div>
  );
}
