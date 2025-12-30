import { GlobalContext } from "@/App"
import useGetChessHistory from "@/services/chess/useChessHistory"
import { useContext } from "react"

interface ChessMatch {
  blackPlayerId: string
  endedAt: number
  id: number
  opponent: string
  moves: number
  reason: string
  result: string
  roomId: string
  startedAt: number
  whitePlayerId: string
  winnerTeam: string
}

interface ChessHistoryResponse {
  success: boolean
  stats: {
    totalGames: number
    wins: number
    losses: number
    draws: number
    winRate: string
  }
  history: ChessMatch[]
}

function toDateFromMixedTimestamp(timestamp: number | null | undefined) {
  if (!timestamp) return null
  const ms = timestamp < 1e12 ? timestamp * 1000 : timestamp
  const date = new Date(ms)
  return Number.isNaN(date.getTime()) ? null : date
}

function isSameLocalDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getMatchOutcome(match: ChessMatch) {
  if (match.result === "WIN" || match.result === "LOSS" || match.result === "DRAW") return match.result
  if (!match.winnerTeam || !match.winnerTeam.length) return "DRAW"
  // @ts-expect-error
  if (match.playerTeam && match.winnerTeam === match.playerTeam) return "WIN"
  return "LOSS"
}

function ChessTodayStatistic() {
  const {user} = useContext(GlobalContext)
  const {data, isError, error, isPending} = useGetChessHistory(user?.username ?? null)
  const today = new Date()

  const history = (data as ChessHistoryResponse | undefined)?.history ?? []

  const todayGames = history.filter((match) => {
    const matchDate = toDateFromMixedTimestamp(match.endedAt) ?? toDateFromMixedTimestamp(match.startedAt)
    if (!matchDate) return false
    return isSameLocalDay(matchDate, today)
  })

  const todayWins = todayGames.filter((g) => getMatchOutcome(g) === "WIN").length
  const todayLosses = todayGames.filter((g) => getMatchOutcome(g) === "LOSS").length
  const todayDraws = todayGames.filter((g) => getMatchOutcome(g) === "DRAW").length

  const formatTime = (timestamp: number) => {
    const d = toDateFromMixedTimestamp(timestamp)
    if (!d) return ""
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
  
  return (
    <div className="p-4 bg-slate-800/30  border border-slate-700">
      <h3 className="text-lg font-medium text-slate-300 mb-4 max-h-48 overflow-auto">
        Today's Chess <span className="text-neon">Statistics</span>
      </h3>

      {!user?.username ? (
        <p className="text-slate-200 opacity-40 text-center">Sign in to see your games</p>
      ) : isPending ? (
        <p className="text-slate-200 opacity-40 text-center">Loading…</p>
      ) : isError ? (
        <p className="text-slate-200 opacity-40 text-center">
          {(error as any)?.message || "Failed to load chess history"}
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
              const outcome = getMatchOutcome(game)
              return (
                <div
                  key={game.id}
                  className="border border-slate-700 bg-slate-900/20 p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100 truncate">
                      vs {game.opponent}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {game.moves} moves{game.reason ? ` • ${game.reason}` : ""}
                    </p>
                  </div>

                  <div className="flex items-end flex-col gap-1 shrink-0">
                    <span className="text-xs text-slate-400">{formatTime(game.endedAt ?? game.startedAt)}</span>
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
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChessTodayStatistic