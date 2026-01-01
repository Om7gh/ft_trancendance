import type { User } from "./User";

export interface TournamentPlayer {
  avatar: string;
  username: string;
  gameStatus: string;
  round: number;
}

export interface Tournament {
  player: TournamentPlayer;
  index?: number;
}

export interface Tournaments {
  players: TournamentPlayer[];
}

export interface ChessStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: string;
}

export interface PongStats {
  wins: number;
  loses: number;
  matches: any[];
}

export interface GamesStatisticsProps {
  chessStats: ChessStats;
  pongStats: PongStats;
}

export interface ChessMatch {
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

export interface ChessHistoryResponse {
  success: boolean
  stats: {
    totalGames: number
    wins: number
    losses: number
    draws: number
    winRate: string
  }
  matches: ChessMatch[]
}

export interface OnlineState {
  roomId: string | null;
  myTeam: 'WHITE' | 'BLACK' | null;
  opponentConnected: boolean;
  opponentName: string | null;
  gameOver: { winner: string; message: string } | null;
  rematch: {
    incomingOffer: boolean;
    requested: boolean;
    declined: boolean;
  };
}


export interface ChessMatch {
  blackPlayerId: string,
      endedAt: number,
      id: number,
      opponent: string,
      moves: number,
      reason: string,
      result: string,
      roomId: string,
      startedAt: number,
      whitePlayerId: string,
      winnerTeam: string
}

export interface ChessHistoryProps {
  userData: User | null;
  matchData: {
    stats: {
      totalGames: number;
      wins: number;
      losses: number;
      draws: number;
      winRate: string;
    },
    history: ChessMatch[]
  };
}