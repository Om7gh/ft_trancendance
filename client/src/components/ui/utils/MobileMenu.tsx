import React from "react";
import { NavLink } from "react-router-dom";

interface MobileMenu {
  name: string;
  path: string;
  icon: HTMLElement;
}

export default function MobileMenu({ mobileMenu }: MobileMenu[]) {
  return (
    <>
      {mobileMenu.map((item) => (
        <li key={item.path}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-3 rounded-lg transition-all duration-200 font-medium flex items-center gap-4
                ${
                  isActive
                    ? "bg-gradient-to-l from-orange-300 to-teal-500 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`
            }>
            {({ isActive }) => (
              <>
                <span
                  className={`text-2xl ${
                    isActive ? "text-slate-200" : "text-orange-400"
                  }`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        </li>
      ))}
    </>
  );
}
