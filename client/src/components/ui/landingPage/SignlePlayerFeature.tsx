import type { JSX } from "react";
import { Single } from "@assets";

export default function SinglePlayerFeature(): JSX.Element {
  return (
    <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
        {/* Image Section - First on mobile, second on desktop */}
        <div className="relative order-1 lg:order-2 flex justify-center">
          <div className="relative w-full max-w-md">
            <img
              src={Single}
              alt="Intense 1v1 ping pong match"
              className="w-full h-auto object-contain rounded-xl shadow-2xl"
            />
            <div className="absolute -z-10 inset-0 rounded-full bg-teal-500/10 blur-xl" />
          </div>
        </div>

        {/* Text Content - Second on mobile, first on desktop */}
        <div className="flex flex-col justify-center gap-4 md:gap-6 relative order-2 lg:order-1">
          {/* Decorative number */}
          <span className="hidden lg:block text-8xl font-bold absolute top-[-50px] left-[-60px] opacity-10 text-teal-400 select-none pointer-events-none">
            3
          </span>

          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            ⚔️ 1v1 Duel – Test Your Skills!
          </h3>

          <ul className="space-y-3 text-slate-300 text-base sm:text-lg leading-relaxed">
            <li className="flex items-start">
              <span className="text-teal-400 mr-2">•</span>
              <span>
                The classic head-to-head ping pong experience, refined to
                perfection
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-2">•</span>
              <span>
                Ranked matches – Climb the tiers from Rookie to Grandmaster
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-2">•</span>
              <span>
                Custom rules – Play with unique handicaps or crazy power-ups
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-2">•</span>
              <span>
                Replays & stats – Analyze every shot to improve your game
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-2">•</span>
              <span>
                Intense rallies – Lightning-fast physics for pro-level gameplay
              </span>
            </li>
          </ul>

          <blockquote className="mt-4 p-4 border-l-4 border-orange-400 bg-gray-800/50 rounded-r-lg italic text-orange-300">
            "No teammates, no excuses – just pure paddle mastery."
          </blockquote>
        </div>
      </div>
    </section>
  );
}
