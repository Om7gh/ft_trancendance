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