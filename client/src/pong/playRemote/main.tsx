import { Outlet, Link } from 'react-router';

import React from 'react';
import { MdGamepad } from 'react-icons/md';
import MenuButton from '../component/MenuButton';

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
   <div className="space-y-8 bg-gradient-to-b from-slate-950/20 to-violet-900/30 w-1/2 sm:w-full md:w-1/2 p-10 shadow-xl shadow-slate-900 text-center">
      <nav className="">
        <h2 className="text-center bg-linear-0 from-violet-500 to-neon bg-clip-text text-transparent text-4xl flex gap-5 items-center mx-auto mb-5">
          <MdGamepad className="w-16 h-16 text-violet-300 bg-slate-900/50 p-2 shadow-xl" />
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
          Play Match
        </MenuButton>
        <MenuButton destination='/dashboard/games/pingpong/remote/invitefriend' >
          Invite Friend
        </MenuButton>
        <MenuButton destination='/dashboard/games/pingpong' >
          Go Back
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
