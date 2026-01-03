import type { MatchType } from "./playWithSomeOne";

export type ScoreType = {
  leftPlayer: number;
  rightPlayer: number;
};

export type PlayMatchPropsType = {
  match: MatchType;
};

export type MatchPropsType = {
  match: MatchType,
  connection: WebSocket,
  matchState: string,
  setMatchState: (value: string) => void,
  setError: (value: string) => void,
}

export type CustomizationType = {
  ball_color: string;
  left_paddle_color: string;
  right_paddle_color: string;
  table_edges_color: string;
}