import { Outlet } from "react-router-dom";

export default function Auth() {
  return (
    <div className="h-[100vh] max-h-[100vh] flex items-center justify-center overflow-auto">
      <Outlet />
    </div>
  );
}
