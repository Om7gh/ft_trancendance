import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface Item {
  name: string;
  icon: ReactNode;
  path: string;
  children?: Item[] | null;
}

function DropDown({ item, isMobile }: { item: Item; isMobile: boolean }) {
  if (!item.children || item.children.length === 0) return null;

  return (
    <ul className={`mt-2 ${isMobile ? 'pl-2' : 'pl-6'} space-y-2`}>
      {item.children.map((child: Item) => (
        <li key={child.path}>
          <NavLink
            to={child.path}
            className={({ isActive }) =>
              `px-3 py-2 transition-all duration-200 flex items-center gap-3
              ${
                isActive
                  ? 'bg-gradient-to-l from-neon to-violet-500 text-white shadow-lg border-l-4 border-l-slate-100'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white border-l-4 border-l-violet-500 bg-slate-400/10'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`text-xl ${isActive ? 'text-white' : 'text-neon'}`}
                >
                  {child.icon}
                </span>
                {!isMobile && (
                  <span className="font-medium text-sm">{child.name}</span>
                )}
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default DropDown;
