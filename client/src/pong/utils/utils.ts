import type { MatchType, PlayerType } from "../types/playWithSomeOne";

export function validatePlayer(player: PlayerType) {
  if (!player || !player.id || !player.username)
    return false;
  return true;
}

export function validateMatch(match: MatchType) {
  if (
    !match ||
    !match.id ||
    !validatePlayer(match.leftPlayer) ||
    !validatePlayer(match.rightPlayer)
  )
    return false;
  return true;
}

export function createRenderingContext(canvas: HTMLCanvasElement | null) {
  if (canvas) {
    const context = canvas.getContext("2d");
    if (!context)
      throw ("Fail to get the rendering context!!");
    return (context);
  } else
    throw ("Canvas ref not initiate correctly!!");
}