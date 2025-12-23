export type PlayerType = {
  id: string;
  name: string;
  avatar: string;
};

export type MatchType = {
  roomId: string;
  leftPlayer: PlayerType;
  rightPlayer: PlayerType;
};
