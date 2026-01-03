import { type JSX } from 'react';
import { Profile, SearchBar } from '../ui';
import Notification from './Notification';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

interface DashboardHeaderProps {
  isMobile?: boolean;
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function DashboardHeader({ 
  isMobile = false, 
  toggleSidebar,
  isSidebarOpen = false 
}: DashboardHeaderProps): JSX.Element {
  return (
    <header className="flex justify-between mr-0 md:mr-4 lg:mr-4 gap-5 items-center">
      {isMobile && toggleSidebar && (
        <button
          onClick={toggleSidebar}
          className="text-2xl text-slate-300 hover:text-neon transition-colors p-2"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      )}

      {!isMobile && <div />}

      <div className="flex gap-5 items-center">
        <div className="max-w-96">
          <SearchBar />
        </div>
        <Notification />
        <Profile />
      </div>
    </header>
  );
}
