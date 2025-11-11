import { DashboardHeader, LeftSideDashboard } from "@/components/layout";
import { useMobile } from "@/hooks/useMobile";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  const isMobile = useMobile();

  return (
    <div
      className={`grid ${
        !isMobile ? "grid-cols-[15rem_1fr]" : "grid-cols-[7rem_1fr]"
      } grid-rows-[auto_1fr] min-h-screen p-5 overflow-hidden`}>
      <div className="px-6">
        <DashboardHeader />
      </div>
      <main className="row-start-2 row-end-3 col-start-2 col-end-3 p-6 my-6  overflow-auto">
        <Outlet />
      </main>
      <LeftSideDashboard isMobile={isMobile} />
    </div>
  );
}
