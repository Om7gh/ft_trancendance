import { Link, Outlet } from 'react-router';

import { createContext } from 'react';
import { Menu, MenuOption } from '@/startMenu';
export function RemoteOptions() {
  return (
    <div className="h-full grid place-items-center bg-slate-800/50 text-violet-200 shadow-xl shadow-slate-900/80 px-4 py-6">
      <h2 className="bg-gradient-to-l from-violet-500 to-neon/50 bg-clip-text text-transparent text-2xl">
        Game Menu :
      </h2>
      <Menu>
        <MenuOption>
          <Link to="someone">Play Match</Link>
        </MenuOption>
        <MenuOption>
          <Link to="invitefriend">Invite Friend</Link>
        </MenuOption>
        <MenuOption>Resume</MenuOption>
      </Menu>
    </div>
  );
}

export type GlobalContextType = {
  userId: string;
};

export const GlobalContext = createContext<GlobalContextType>({
  userId: 'undefined',
});

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function PongRemote() {
  return (
    <GlobalContext.Provider value={{ userId: generateId() }}>
      <div className="flex flex-col min-w-[500px] m-auto">
        <Outlet />
      </div>
    </GlobalContext.Provider>
  );
}
