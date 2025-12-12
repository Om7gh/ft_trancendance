import { Avatar } from '@/assets';
import { useEffect, useState, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useLogout } from '@/services/auth/useLogout';

export default function Profile(): JSX.Element {
  const [active, setActive] = useState(false);
  const muatateLogout = useLogout();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-container')) {
        setActive(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActive(!active);
  };

  return (
    <div className="relative">
      <div
        className="h-14 w-25 rounded-full flex items-center px-2 bg-slate-900 hover:bg-slate-900/30 cursor-pointer hover:from-violet-500/30 hover:to-violet-800/30 transition-all duration-300 p-0.5 z-50 ring-4 ring-offset-2 ring-offset-violet-500"
        onClick={toggleMenu}
      >
        <div className="relative">
          <img
            src={Avatar}
            alt="avatar"
            className="h-10 w-10 rounded-full object-cover border-2 border-white"
          />
          <div className="absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-1">
            {active ? (
              <ChevronUpIcon className="h-3 w-3 text-white" />
            ) : (
              <ChevronDownIcon className="h-3 w-3 text-white" />
            )}
          </div>
        </div>
      </div>
      {active && (
        <div className="absolute top-16 right-0 w-48 bg-slate-900  shadow-xl overflow-hidden animate-dropdown origin-top-right z-50">
          <div className="px-4 py-3 bg-violet-500">
            <p className="text-white font-medium truncate">Omar Ghazi</p>
          </div>
          <ul className="divide-y divide-slate-300">
            <li className="hover:bg-slate-700 transition-colors">
              <Link
                to="home"
                className="block px-4 py-3 text-sm text-slate-100"
                onClick={() => setActive(false)}
              >
                Home
              </Link>
            </li>
            <li className="hover:bg-slate-700 transition-colors">
              <Link
                to="profile"
                className="block px-4 py-3 text-sm text-slate-100"
                onClick={() => setActive(false)}
              >
                My Profile
              </Link>
            </li>
            <li className="hover:bg-slate-700 transition-colors">
              <Link
                to="settings"
                className="block px-4 py-3 text-sm text-slate-100"
                onClick={() => setActive(false)}
              >
                Settings
              </Link>
            </li>
            <li className="hover:bg-slate-700 transition-colors">
              <Link
                to="/auth/signin"
                className="block px-4 py-3 text-sm text-red-500 hover:text-red-600"
                onClick={() => {
                  setActive(false);
                  muatateLogout.mutate();
                }}
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
