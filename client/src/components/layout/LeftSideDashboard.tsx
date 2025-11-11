import { Logo } from "@/assets";
import { FaUserFriends } from "react-icons/fa";
import { HiOutlineCog, HiOutlineHome } from "react-icons/hi";
import { HiMiniChatBubbleLeft } from "react-icons/hi2";
import { PiPingPongFill } from "react-icons/pi";
import { GrPowerShutdown } from "react-icons/gr";
import { Link, NavLink } from "react-router-dom";

export default function LeftSideDashboard({ isMobile }: { isMobile: boolean }) {
  const menuItems = [
    { name: "Home", path: "home", icon: <HiOutlineHome /> },
    { name: "Settings", path: "settings", icon: <HiOutlineCog /> },
    { name: "Games", path: "games", icon: <PiPingPongFill /> },
    { name: "Chat", path: "chat", icon: <HiMiniChatBubbleLeft /> },
    { name: "Friends", path: "friends", icon: <FaUserFriends /> },
  ];

  return (
    <aside className="bg-slate-950/30 p-6 col-start-1 row-start-2 row-end-3 rounded-xl flex flex-col max-h-[100vh]">
      <div className="mb-8 flex justify-center">
        <img
          src={Logo}
          alt="logo"
          className={isMobile ? "h-15 w-auto" : "h-20 w-auto"}
        />
      </div>

      <nav className="w-full flex-1">
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-4
                  ${
                    isActive
                      ? "bg-gradient-to-l from-orange-400 to-teal-500 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  }`
                }>
                {({ isActive }) => (
                  <>
                    <span
                      className={`text-2xl ${
                        isActive ? "text-white" : "text-orange-400"
                      }`}>
                      {item.icon}
                    </span>
                    {!isMobile && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Link
        to="/auth/signIn"
        className={`mt-auto ${
          isMobile ? "p-3" : "px-4 py-3"
        } rounded-full bg-rose-500/20 text-slate-200 hover:bg-rose-500/30 transition-colors flex items-center justify-center gap-3`}>
        <GrPowerShutdown className="text-xl" />
        {!isMobile && <span>Sign Out</span>}
      </Link>
    </aside>
  );
}
