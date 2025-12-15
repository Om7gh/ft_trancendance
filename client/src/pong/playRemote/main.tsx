import { Outlet, Link } from 'react-router';

import React from 'react';

export type MenuOptionPropsType = {
  children: React.ReactNode;
};

export function MenuOption({ children }: MenuOptionPropsType) {
  return (
    <button className="block h-[70px] bg-slate-900/50 shadow-sm shadow-violet-900 rounded text-[1em] w-3/5 m-auto my-4 hover:bg-slate-950 duration-200 text-white">
      {children}
    </button>
  );
}

export type MenuPropsType = {
  children: React.ReactNode;
};

export function Menu({ children }: MenuPropsType) {
  return <nav className="flex flex-col  w-9/10 m-auto my-4">{children}</nav>;
}

export function RemoteOptions() {
  return (
    <Menu>
      <MenuOption>
        <Link
          to="/dashboard/games/pingpong/remote/someone"
          className='w-full h-full'
        >Play Match</Link>
      </MenuOption>
      <MenuOption>
        <Link
          to="/dashboard/games/pingpong/remote/invitefriend"
          className='w-full h-full'
        >Invite Friend</Link>
      </MenuOption>
      <MenuOption>
        <Link
          to="/dashboard/games/pingpong"
          className='w-full h-full'
        >Go Back</Link>
      </MenuOption>
    </Menu>
  );
}

export function PongRemote() {
  return (
    <div className="flex flex-col min-w-[500px] m-auto">
      <Outlet />
    </div>
  );
}
