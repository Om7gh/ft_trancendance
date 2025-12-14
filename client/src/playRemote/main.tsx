import { Outlet, Link } from 'react-router';

import { MenuOption, Menu } from '../startMenu.tsx';

export function RemoteOptions() {
  return (
    <Menu>
      <MenuOption>
        <Link 
<<<<<<< HEAD
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
=======
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
>>>>>>> 6baf1b135873f6270ab41138078d2271efac1ca5
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
