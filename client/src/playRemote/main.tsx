import { Outlet, Link } from 'react-router';

import { MenuOption, Menu } from '../startMenu.tsx';

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
          to="/pongGame/remote/invitefriend"
          className='w-full h-full'
        >Invite Friend</Link>
      </MenuOption>
      <MenuOption>
        <Link
          to="/pongGame"
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
