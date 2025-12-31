import { useEffect, useContext } from "react";

import type { RefObject } from "react";
import type { ScoreType } from "../playLocal/main";

import Match from "../playLocal/classes.ts";
import { createRenderingContext } from "../utils/utils";
import { CustomizationContext } from '../PongMain.tsx';

const match: { instance: Match | null } = {
  instance: null,
};

export function onTouchStartHandler(key: string) {
  match.instance?.onTouchStart(key);
}

export function onTouchEndHandler(key: string) {
  match.instance?.onTouchEnd(key);
}

export default function useLocalMatch(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  setError: (value: string) => void,
  setMatchState: (value: string) => void,
  setScore: (value: ScoreType | null) => void,
) {
  const customization = useContext(CustomizationContext);

  useEffect(() => {
    try {
      const context2d = createRenderingContext(canvasRef.current);
      match.instance = new Match(context2d, customization);
      match.instance.startMatch(setScore, setMatchState)
      return (() => {
        match.instance?.stopMatch()
      });
    } catch (error: any) {
      setError("An error in useLocalMatch, see console!!");
    }
  }, []);
}