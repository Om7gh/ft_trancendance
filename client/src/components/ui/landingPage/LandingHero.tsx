import type { JSX } from "react";
import { useNavigate } from "react-router-dom";
import Balls from "../utils/Balls";
import Button from "../utils/Button";

export default function LandingHero(): JSX.Element {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center relative overflow-hidden">
        <Balls />

        <section className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-20 relative z-10">
          <div className="text-center space-y-6 md:space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-teal-400 via-amber-300 to-orange-500 bg-clip-text text-transparent tracking-tight">
              Serve, Smash, <span className="whitespace-nowrap">Dominate!</span>
            </h1>

            <h2 className="text-lg sm:text-xl md:text-2xl text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed">
              Play the most addictive ping pong game online. Challenge friends,
              unlock power-ups, and rule the leaderboards!
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button
                type="signUp"
                className="px-8 py-3 sm:py-4 text-lg font-semibold w-full sm:w-auto hover:scale-105 transition-transform"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/auth/signup");
                }}>
                Play Free
              </Button>
              <Button
                type="signIn"
                className="px-8 py-3 sm:py-4 text-lg font-semibold w-full sm:w-auto bg-transparent border-2 border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:scale-105 transition-transform tracking-widest"
                onClick={(e) => {
                  e.preventDefault();
                }}>
                Watch Trailer
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
