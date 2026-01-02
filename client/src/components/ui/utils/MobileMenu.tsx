import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface MobileMenu {
  name: string;
  path: string;
  icon: ReactNode;
}

interface MenuMobileArr {
  mobileMenu: MobileMenu[]
}

export default function MobileMenu({ mobileMenu }: MenuMobileArr) {
  return (
    <>
      {mobileMenu.map((item: MobileMenu) => (
        <li key={item.path}>
          <NavLink
            to={item.path}
            className={({ isActive }: { isActive: boolean }) =>
              `px-4 py-3  transition-all duration-200 font-medium flex items-center gap-4
                ${
                  isActive
                    ? 'bg-gradient-to-l from-neon to-violet-500 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`
            }
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <span
                  className={`text-2xl ${
                    isActive ? 'text-slate-200' : 'text-neon'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        </li>
      ))}
    </>
  );
}
