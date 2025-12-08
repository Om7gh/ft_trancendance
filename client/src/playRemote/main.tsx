import { Outlet, Link } from 'react-router';

import { MenuOption, Menu } from '../startMenu.tsx';

export function RemoteOptions() {
  return (
    <Menu>
      <MenuOption>
        <Link to="/dashboard/games/pingpong/remote/someone">Play Match</Link>
      </MenuOption>
      <MenuOption>
        <Link to="/pongGame/remote/invitefriend">Invite Friend</Link>
      </MenuOption>
      <MenuOption>
        <Link to="/pongGame">Go Back</Link>
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
