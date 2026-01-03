export type PlayerType = {
  id: string;
  username: string;
  avatar: string;
};

export type MatchType = {
  id: string;
  leftPlayer: PlayerType;
  rightPlayer: PlayerType;
};
