import { type JSX } from "react";
import { Profile } from "../ui";

export default function DashboardHeader(): JSX.Element {
  return (
    <header className="absolute right-15 top-5 z-50">
      <Profile />
    </header>
  );
}
