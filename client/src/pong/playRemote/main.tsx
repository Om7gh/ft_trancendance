import { Outlet, Link } from 'react-router';

import React from 'react';
import { MdGamepad } from 'react-icons/md';

export type MenuOptionPropsType = {
  children: React.ReactNode;
};

export function MenuOption({ children }: MenuOptionPropsType) {
  return (
    <button className="block h-[70px] bg-violet-500/20 shadow-lg shadow-slate-900 rounded text-[1em] w-3/5 m-auto my-4 hover:bg-violet-500/50 duration-200 text-violet-200 cursor-pointer">
      {children}
    </button>
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
      <MenuOption>
        <Link
          to="/dashboard/games/pingpong/remote/someone"
          className="w-full h-full text-xl"
        >
          Play Match
        </Link>
      </MenuOption>
      <MenuOption>
        <Link
          to="/dashboard/games/pingpong/remote/invitefriend"
          className="w-full h-full text-xl"
        >
          Invite Friend
        </Link>
      </MenuOption>
      <MenuOption>
        <Link to="/dashboard/games/pingpong" className="w-full h-full text-xl">
          Go Back
        </Link>
      </MenuOption>
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
