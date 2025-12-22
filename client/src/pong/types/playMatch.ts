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