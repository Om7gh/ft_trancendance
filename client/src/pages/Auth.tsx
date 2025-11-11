import BackBtn from "@/components/ui/utils/BackBtn";
import { Outlet } from "react-router-dom";

export default function Auth() {
  return (
    <div className="h-[100vh] max-h-[100vh] mx-auto flex items-center justify-center relative bg-slate-950/30 overflow-y-scroll">
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-full opacity-2">
        {/* <img src={Login} alt="login wallpaper" /> */}
      </div>
      <BackBtn />
      <Outlet />
    </div>
  );
}
