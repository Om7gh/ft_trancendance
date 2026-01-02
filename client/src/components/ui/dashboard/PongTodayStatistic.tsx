import { useContext } from "react";
import { GlobalContext } from "@/App";
import useGetPongStat from "@/services/user/useGetPongStats";
import type { PongStats } from "@/types/gameTypes";
import getErrorMessage from "@/utils/getErrorMessage";

type PongPlayerStats = {
  id: string;
  username: string;
  avatar?: string;
  points?: number;
};

type PongMatchStats = {
  id: string;
  createdAt?: string;
  leftPlayer: PongPlayerStats;
  rightPlayer: PongPlayerStats;
  winner?: string;
};

function toDateFromCreatedAt(createdAt?: string) {
  if (!createdAt) return null;
  // Backend sends: "YYYY-MM-DD HH:mm:ss" -> normalize to ISO-ish.
  const normalized = createdAt.includes("T") ? createdAt : createdAt.replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameLocalDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getMatchOutcome(match: PongMatchStats, myUserId?: string) {
  if (!match?.winner || !myUserId) return "DRAW";
  return match.winner === myUserId ? "WIN" : "LOSS";
}

export default function PongTodayStatistic() {
  const { user } = useContext(GlobalContext);
  const { data, isError, error, isPending } = useGetPongStat();
  const today = new Date();

  const matches = ((data as PongStats | undefined)?.matches ?? []) as PongMatchStats[];

  const todayGames = matches.filter((match) => {
    const matchDate = toDateFromCreatedAt(match.createdAt);
    if (!matchDate) return false;
    return isSameLocalDay(matchDate, today);
  });

  const todayWins = todayGames.filter((g) => getMatchOutcome(g, user?.id) === "WIN").length;
  const todayLosses = todayGames.filter((g) => getMatchOutcome(g, user?.id) === "LOSS").length;
  const todayDraws = todayGames.filter((g) => getMatchOutcome(g, user?.id) === "DRAW").length;

  const formatTime = (createdAt?: string) => {
    const d = toDateFromCreatedAt(createdAt);
    if (!d) return "";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-2xl">
      <h3 className="text-lg font-medium text-slate-300 mb-4 max-h-48 overflow-auto">
        Today's Pong <span className="text-neon">Statistics</span>
      </h3>

      {!user?.username ? (
        <p className="text-slate-200 opacity-40 text-center">Sign in to see your games</p>
      ) : isPending ? (
        <p className="text-slate-200 opacity-40 text-center">Loading…</p>
      ) : isError ? (
        <p className="text-slate-200 opacity-40 text-center">
          {getErrorMessage(error) || "Failed to load pong history"}
        </p>
      ) : todayGames.length === 0 ? (
        <p className="text-slate-200 opacity-40 text-center">No activities for today</p>
      ) : (
        <div className="space-y-4 max-h-72 overflow-auto">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="border border-slate-700 bg-slate-900/20 p-3">
              <p className="text-xs text-slate-400">Wins</p>
              <p className="text-lg font-semibold text-slate-100">{todayWins}</p>
            </div>
            <div className="border border-slate-700 bg-slate-900/20 p-3">
              <p className="text-xs text-slate-400">Losses</p>
              <p className="text-lg font-semibold text-slate-100">{todayLosses}</p>
            </div>
            <div className="border border-slate-700 bg-slate-900/20 p-3">
              <p className="text-xs text-slate-400">Draws</p>
              <p className="text-lg font-semibold text-slate-100">{todayDraws}</p>
            </div>
          </div>

          <div className="space-y-2 max-h-96">
            {todayGames.map((game) => {
              const outcome = getMatchOutcome(game, user?.id);
              const isLeftMe = Boolean(user?.id && game.leftPlayer?.id === user.id);
              const opponentName = isLeftMe ? game.rightPlayer?.username : game.leftPlayer?.username;

              const leftPoints = game.leftPlayer?.points;
              const rightPoints = game.rightPlayer?.points;
              const scoreText =
                typeof leftPoints === "number" && typeof rightPoints === "number"
                  ? `${leftPoints} - ${rightPoints}`
                  : null;

              return (
                <div
                  key={game.id}
                  className="border border-slate-700 bg-slate-900/20 p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100 truncate">vs {opponentName || "Unknown"}</p>
                    <p className="text-xs text-slate-400 truncate">{scoreText ? `Score: ${scoreText}` : "Match"}</p>
                  </div>

                  <div className="flex items-end flex-col gap-1 shrink-0">
                    <span className="text-xs text-slate-400">{formatTime(game.createdAt)}</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium border ${
                        outcome === "WIN"
                          ? "bg-violet-500/15 text-violet-300 border-violet-500/30"
                          : outcome === "LOSS"
                            ? "bg-pink-500/15 text-pink-300 border-pink-500/30"
                            : "bg-slate-500/15 text-slate-200 border-slate-500/30"
                      }`}
                    >
                      {outcome}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}