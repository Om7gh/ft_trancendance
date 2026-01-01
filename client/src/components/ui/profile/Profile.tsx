import { useContext, useEffect, useState, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '@/services/auth/useLogout';
import { GlobalContext } from '@/App';

export default function Profile(): JSX.Element {
  const [active, setActive] = useState(false);
  const muatateLogout = useLogout();
  const { user } = useContext(GlobalContext);
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
        className="h-10 md:h-14 w-auto rounded-full flex items-center  px-2 bg-linear-to-l from-violet-500 to-neon  hover:bg-slate-900/30 cursor-pointer hover:from-violet-500/30 hover:to-violet-800/30 transition-all duration-300  z-50 ring-4 ring-offset-2 ring-offset-violet-500"
        onClick={toggleMenu}
      >
        <div className="relative">
          <div className='flex items-center gap-2'>
          <img
            src={user?.avatar}
            alt="avatar"
            className="h-8 w-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white"
            />
            <span className='text-xs text-violet-200'>{user?.username}</span>
            </div>
        </div>
      </div>
      {active && (
        <div className="absolute top-16 right-0 w-48 bg-slate-950  shadow-xl overflow-hidden shadow-slate-900 animate-dropdown origin-top-right z-50">
          <div className="px-4 py-3 bg-violet-500">
            <p className="text-white font-medium truncate">{`${user?.first_name || ''} ${user?.last_name || ''}`.trim()}</p>
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
                to={`profile/${user?.username}`}
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
                className="block px-4 py-3 text-sm text-pink-500 hover:text-pink-600"
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
