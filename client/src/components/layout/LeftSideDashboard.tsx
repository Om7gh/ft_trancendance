import { Logo } from '@/assets';
import { FaUserFriends, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { HiOutlineCog } from 'react-icons/hi';
import { HiMiniChatBubbleLeft } from 'react-icons/hi2';
import { PiPingPongFill } from 'react-icons/pi';
import { GrPowerShutdown } from 'react-icons/gr';
import { NavLink } from 'react-router-dom';
import DropDown from '../ui/utils/DropDown';
import { useState, type MouseEvent, type ReactNode } from 'react';
import { useLogout } from '@/services/auth/useLogout';
import { FaRegChartBar } from "react-icons/fa";


export default function LeftSideDashboard({ 
  isMobile, 
  onNavigate 
}: { 
  isMobile: boolean;
  onNavigate?: () => void;
}) {
  const menuItems: {
    name: string;
    path: string;
    icon: ReactNode;
    children?: any;
  }[] = [
    {
      name: 'start',
      path: 'games',
      icon: <PiPingPongFill />,
    },
    { name: 'Chat', path: 'chat', icon: <HiMiniChatBubbleLeft /> },
    { name: 'Friends', path: 'friends', icon: <FaUserFriends /> },
    { name: 'Stats', path: 'home', icon: <FaRegChartBar /> },
    {
      name: 'Settings',
      path: 'settings',
      icon: <HiOutlineCog />,
      children: [
        { name: 'Account', path: 'settings/account', icon: <HiOutlineCog /> },
        { name: 'Game', path: 'settings/game', icon: <HiOutlineCog /> },
      ],
    },
  ];

  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const mutateLogout = useLogout();

  const toggleItem = (path: string) => {
    setOpenItems((s) => ({ ...s, [path]: !s[path] }));
  };

  const onToggleClick = (e: MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(path);
  };

  return (
    <aside className="py-6 col-start-1 row-start-2 row-end-3 px-4 flex flex-col h-full">
      <div className="mb-8 flex justify-center">
        <img
          src={Logo}
          alt="logo"
          className={isMobile ? 'h-16 w-auto' : 'h-20 w-auto'}
        />
      </div>

      <nav className="w-full flex-1 overflow-auto">
        <ul className="space-y-5">
          {menuItems.map((item) => {
            const isOpen = !!openItems[item.path];
            return (
              <li key={item.path} className='rounded-xl'>
                <div className="flex flex-col">
                  <NavLink
                    to={item.path}
                    onClick={() => isMobile && onNavigate?.()}
                    className={({ isActive } : {isActive: boolean}) =>
                      `px-4 py-3 transition-all duration-200 flex items-center gap-4 justify-between rounded-xl
                      ${
                        isActive
                          ? 'bg-linear-to-l from-neon to-violet-500 text-white shadow-lg border-l-5 border-l-slate-100'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white border-l-5 border-l-violet-500 bg-slate-400/10'
                      }`
                    }
                  >
                    {({ isActive } : {isActive: boolean}) => (
                      <>
                        <div className="flex items-center gap-4">
                          <span
                            className={`text-2xl ${
                              isActive ? 'text-white' : 'text-neon'
                            }`}
                          >
                            {item.icon} {" "}
                          </span>
                            <span className="font-medium">{item.name}</span>
                        </div>

                        {!isMobile && item.children && (
                          <button
                            aria-expanded={isOpen}
                            onClick={(e) => onToggleClick(e, item.path)}
                            className="text-xl p-1 text-violet-900 hover:text-slate-200 duration-200 "
                          >
                            {isOpen ? <FaAngleUp /> : <FaAngleDown />}
                          </button>
                        )}
                      </>
                    )}
                  </NavLink>

                  {item.children && isOpen && (
                    <DropDown item={item as any} isMobile={isMobile} onNavigate={onNavigate} />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        className={`mt-auto ${
          isMobile ? 'p-3 text-slate-50' : 'px-4 py-3'
        } flex items-center gap-2 border-l-5 border-r-5 border-l-violet-500 border-r-neon bg-slate-400/10`}
        onClick={() => mutateLogout.mutate()}
      >
        <GrPowerShutdown className="text-xl text-violet-500" />
        {!isMobile && (
          <span className="bg-linear-to-r from-neon to-violet-500 bg-clip-text text-transparent font-medium">
            Nice to meet you
          </span>
        )}
      </button>
    </aside>
  );
}
