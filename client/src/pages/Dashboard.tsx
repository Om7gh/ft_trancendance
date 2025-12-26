
import { DashboardHeader, LeftSideDashboard } from '@/components/layout';
import { useMobile } from '@/hooks/useMobile';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

export default function Dashboard() {
  const isMobile = useMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 shadow-sm bg-slate-950/30 z-20">
        <DashboardHeader 
          isMobile={isMobile} 
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {isMobile ? (
          <>
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-30"
                onClick={closeSidebar}
              />
            )}
            
            <aside className={`
              fixed top-0 left-0 h-full w-64 bg-slate-950/95 z-40 
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <LeftSideDashboard isMobile={isMobile} onNavigate={closeSidebar} />
            </aside>
          </>
        ) : (
          <aside className="w-64 h-full bg-slate-950/30">
            <LeftSideDashboard isMobile={isMobile} />
          </aside>
        )}

        <main className="flex-1 py-6 px-3 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
