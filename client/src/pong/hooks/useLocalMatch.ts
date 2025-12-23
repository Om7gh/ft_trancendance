import { useEffect } from "react";

import type { RefObject } from "react";
import type { ScoreType } from "../playLocal/main";

import Match from "../playLocal/classes.ts";
import { createRenderingContext } from "../utils/utils";

export default function useLocalMatch(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  setError: (value: string) => void,
  setMatchState: (value: string) => void,
  setScore: (value: ScoreType | null) => void,

) {
  useEffect(() => {
    try {
      const context2d = createRenderingContext(canvasRef.current);
      const match = new Match(context2d);
      match.startMatch(setScore, setMatchState)
      return (() => {
        match.stopMatch()
      });
    } catch (error: any) {
      console.error(error);
      setError("An error in useLocalMatch, see console!!");
    }
  }, []);
}