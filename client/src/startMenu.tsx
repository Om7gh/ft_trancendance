import React from 'react';
import { Link } from 'react-router';

export type MenuOptionPropsType = {
    children: React.ReactNode;
}

export function MenuOption({children}: MenuOptionPropsType) {
  return (
    <button 
      className="border rounded text-[1em] w-3/5 m-auto my-4 p-4 hover:bg-sky-300"
    >{children}</button>
  )
}

export type MenuPropsType = {
    children: React.ReactNode;
}

export function Menu({children}: MenuPropsType) {
  return (
    <nav className="flex flex-col border rounded w-9/10 m-auto my-4">
      {children}
    </nav>
  )
}

export function StartMenu() {
  return (
    <div className="flex flex-col min-w-[500px] m-auto">
      <Menu>
        <MenuOption>
          <Link to='/pongGame/local' >Play Local</Link>
        </MenuOption>
        <MenuOption>
          <Link to='/pongGame/remote' >Play Remote</Link>
        </MenuOption>
        <MenuOption>
          <Link to='/pongGame/tournament' >Tournament</Link>
        </MenuOption>
      </Menu>
    </div>
  )
}