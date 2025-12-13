import React from 'react';

export type MenuOptionPropsType = {
  children: React.ReactNode;
};

export function MenuOption({ children }: MenuOptionPropsType) {
  return (
    <button className=" bg-slate-900/50 shadow-sm shadow-violet-900 rounded text-[1em] w-3/5 m-auto my-4 hover:bg-slate-950 duration-200">
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
