import { useState } from "react";
import Button from "../utils/Button";


interface Tournament {
  id: string;
  name: string;
  game: string;
  date: string;
  registeredPlayers: number;
  maxPlayers: number;
  isRegistered: boolean;
}

export default function IncomingTournament() {
  const [tournament, setTournament] = useState<Tournament>({
    id: "t1",
    name: "Summer Showdown",
    game: "Ping Pong Championship",
    date: "2023-08-15T18:00:00",
    registeredPlayers: 12,
    maxPlayers: 16,
    isRegistered: false,
  });

  const handleRegister = () => {
    setTimeout(() => {
      setTournament((prev) => ({
        ...prev,
        isRegistered: true,
        registeredPlayers: prev.registeredPlayers + 1,
      }));
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const progressPercentage =
    (tournament.registeredPlayers / tournament.maxPlayers) * 100;

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-teal-500/10 transition-shadow">
      <div className="border-b border-teal-500/30">
        <div className="p-5 bg-gradient-to-r from-slate-800 to-slate-900/80">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white">
                {tournament.name}
              </h3>
              <p className="text-sm text-slate-400">{tournament.game}</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 text-xs bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20">
              <svg
                className="w-3 h-3 mr-1 animate-pulse"
                fill="currentColor"
                viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              Registration Open
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-white">{formatDate(tournament.date)}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-teal-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="text-white">
              {tournament.registeredPlayers}
              <span className="text-slate-400">/{tournament.maxPlayers}</span>
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Spots remaining</span>
            <span>
              {tournament.maxPlayers - tournament.registeredPlayers} available
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleRegister}
            disabled={
              tournament.isRegistered ||
              tournament.registeredPlayers >= tournament.maxPlayers
            }
            type="signIn"
            className={`w-full justify-center ${
              tournament.isRegistered
                ? "bg-teal-600/20 text-teal-400 border border-teal-700 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-500 hover:to-orange-400 text-white shadow-lg shadow-teal-500/10"
            }`}>
            {tournament.isRegistered ? (
              <div className="flex items-center jusitfy-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Registered!
              </div>
            ) : tournament.registeredPlayers >= tournament.maxPlayers ? (
              "Tournament Full"
            ) : (
              "Register Now"
            )}
          </Button>
        </div>

        <div className="pt-2 text-center">
          <p className="text-xs text-slate-500">
            Starts in <span className="text-orange-400">3 days, 4 hours</span>
          </p>
        </div>
      </div>
    </div>
  );
}
