import { Outlet, Link } from 'react-router';

import { MenuOption, Menu } from '../startMenu.tsx';

export function RemoteOptions() {
  return (
    <Menu>
      <MenuOption>
        <Link 
          className='block w-full h-full p-4'
          to="/dashboard/games/pingpong/remote/someone">Play Match</Link>
      </MenuOption>
      <MenuOption>
        <Link 
          className='block w-full h-full p-4'
          to="/dashboard/games/pingpong/remote/invitefriend">Invite Friend</Link>
      </MenuOption>
      <MenuOption>
        <Link 
          className='block w-full h-full p-4'
          to="/dashboard/games/pingpong">Go Back</Link>
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
