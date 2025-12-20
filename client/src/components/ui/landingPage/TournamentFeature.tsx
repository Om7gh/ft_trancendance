import type { JSX } from 'react';
import { Tournament } from '@assets';

export default function TournamentFeature(): JSX.Element {
  return (
    <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
        <div className="flex flex-col justify-center gap-4 md:gap-6 relative order-2 lg:order-1">
          <span className="hidden lg:block text-8xl font-bold absolute top-[-50px] left-[-60px] opacity-10 text-violet-400 select-none pointer-events-none">
            1
          </span>

          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-neon bg-clip-text text-transparent">
            🏆 Tournament Mode – Rise to the Top!
          </h3>

          <ul className="space-y-3 text-slate-300 text-base sm:text-lg leading-relaxed">
            <li className="flex items-start">
              <span className="text-violet-400 mr-2">•</span>
              <span>
                Compete in fast-paced ping pong tournaments and prove you're the
                ultimate champion!
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-violet-400 mr-2">•</span>
              <span>
                Bracket-style showdowns - Battle through rounds to reach the
                finals
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-violet-400 mr-2">•</span>
              <span>
                Daily & weekly events - Fresh challenges with special rewards
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-violet-400 mr-2">•</span>
              <span>
                Leaderboards & rankings - See how you stack up against rivals
                worldwide
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-violet-400 mr-2">•</span>
              <span>
                Exclusive prizes - Unlock rare paddles, balls, and arenas
              </span>
            </li>
          </ul>

          <blockquote className="mt-4 p-4 border-l-4 border-neon bg-gray-800/50 rounded-r-lg italic text-neon">
            "Can you handle the heat when the stakes are high?"
          </blockquote>
        </div>

        <div className="relative order-1 lg:order-2 flex justify-center">
          <div className="relative w-full max-w-md">
            <img
              src={Tournament}
              alt="Competitive ping pong tournament scene"
              className="w-full h-auto object-contain  shadow-2xl"
            />
            <div className="absolute -z-10 inset-0 rounded-full bg-violet-500/10 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
