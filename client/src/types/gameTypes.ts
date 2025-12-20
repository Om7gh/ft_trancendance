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
