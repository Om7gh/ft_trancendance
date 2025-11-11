import About from "@/components/layout/About";
import Features from "@/components/layout/Features";
import StartNow from "@/components/layout/StartNow";
import { LandingFooter, LandingHeader, LandingHero } from "@/components/ui";

export default function Landing() {
  return (
    <div className="relative">
      <LandingHeader />
      <main className="max-w-[1200px] mx-auto px-4 pt-20 pb-2 space-y-20">
        <LandingHero />
        <About />
        <Features />
        <StartNow />
        <div className="w-full h-[0.1px] bg-slate-500 opacity-20 my-5"></div>
        <LandingFooter />
      </main>
    </div>
  );
}
