import type { JSX } from "react";
import TournamentFeature from "../ui/landingPage/TournamentFeature";
import MultiPlayerFeature from "../ui/game/MultiPlayerFeature";
import SignlePlayerFeature from "../ui/landingPage/SignlePlayerFeature";

export default function Features(): JSX.Element {
  return (
    <section
      id="Features"
      className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="relative text-center mb-12 md:mb-24">
        <span className="absolute left-0 right-0 mx-auto text-6xl sm:text-7xl md:text-8xl text-slate-300 opacity-5 font-bold pointer-events-none select-none">
          Features
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold relative z-10  bg-gradient-to-r from-teal-400 to-orange-300 bg-clip-text text-transparent">
          PingPop Features
        </h2>
      </div>

      <div>
        <TournamentFeature />
        <MultiPlayerFeature />
        <SignlePlayerFeature />
      </div>
    </section>
  );
}
