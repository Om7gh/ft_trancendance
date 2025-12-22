
import { DashboardHeader, LeftSideDashboard } from '@/components/layout';
import { useMobile } from '@/hooks/useMobile';
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
  const isMobile = useMobile();
  return (
    <div className="h-screen grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <aside className="row-span-2 h-screen bg-slate-950/30">
        <LeftSideDashboard isMobile={isMobile} />
      </aside>

      <header className="px-6 py-4 shadow-sm bg-slate-950/30">
        <DashboardHeader />
      </header>

      <main className="py-6 px-3 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
