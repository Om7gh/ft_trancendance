import type { JSX } from "react";
import { Multiple } from "@assets";

export default function MultiPlayerFeature(): JSX.Element {
  return (
    <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/50 to-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
        {/* Image Section - Now on top for mobile */}
        <div className="relative order-1 lg:order-1 flex justify-center">
          <div className="relative w-full max-w-md">
            <img
              src={Multiple}
              alt="Multiplayer ping pong match"
              className="w-full h-auto object-contain rounded-xl shadow-2xl"
            />
            {/* Decorative circle */}
            <div className="absolute -z-10 inset-0 rounded-full bg-teal-500/10 blur-xl" />
          </div>
        </div>

        {/* Text Content - Now below for mobile */}
        <div className="flex flex-col justify-center gap-4 md:gap-6 relative order-2 lg:order-2">
          {/* Decorative number */}
          <span className="hidden lg:block text-8xl font-bold absolute top-[-50px] left-[-60px] opacity-10 text-teal-400 select-none pointer-events-none">
            2
          </span>

          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            🌐 Multiplayer Madness – Challenge the World!
          </h3>

          <ul className="space-y-3 text-slate-300 text-base sm:text-lg leading-relaxed">
            <li className="flex items-start">
              <span className="text-teal-400 mr-2">•</span>
              <span>
                Play with friends or random opponents in real-time online
                matches!
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-2">•</span>
              <span>
                Global matchmaking – Find rivals at your skill level instantly
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-2">•</span>
              <span>Friend battles – Invite buddies for private matches</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-2">•</span>
              <span>
                Voice & quick chat – Trash-talk or cheer your way to victory
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-2">•</span>
              <span>Team doubles – Pair up for 2v2 chaos!</span>
            </li>
          </ul>

          <blockquote className="mt-4 p-4 border-l-4 border-orange-400 bg-gray-800/50 rounded-r-lg italic text-orange-300">
            "Serve, smash, and socialize – the more, the merrier!"
          </blockquote>
        </div>
      </div>
    </section>
  );
}
