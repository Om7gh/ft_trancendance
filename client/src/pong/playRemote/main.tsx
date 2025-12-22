import { Outlet, Link } from 'react-router';

import React from 'react';
import { MdGamepad } from 'react-icons/md';

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
    <>
      <nav className="bg-slate-900/50  p-4 shadow-xl shadow-slate-900  flex flex-col  w-9/10 m-auto my-4 h-full justify-center">
        <h2 className="text-center bg-linear-0 from-violet-500 to-neon bg-clip-text text-transparent text-4xl flex gap-5 items-center mx-auto mb-5">
          <MdGamepad className="w-16 h-16 text-violet-300 bg-slate-900/50 p-2 shadow-xl" />
          Pong Menu
        </h2>
        {children}
      </nav>
    </>
  );
}

export function RemoteOptions() {
  return (
    <Menu>
      <MenuOption
        destination='/dashboard/games/pingpong/remote/someone'
      >Play Match</MenuOption>
      <MenuOption
        destination='/dashboard/games/pingpong/remote/invitefriend'
      >Invite Friend</MenuOption>
      <MenuOption
        destination='/dashboard/games/pingpong'
      >Go Back</MenuOption>
    </Menu>
  );
}

export function PongRemote() {
  return (
    <div className="flex flex-col w-[35vmax] h-[40vmax] m-auto ">
      <Outlet />
    </div>
  );
}
