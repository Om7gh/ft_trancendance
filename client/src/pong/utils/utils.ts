import type { MatchType, PlayerType } from "../types/playWithSomeOne";

export function validatePlayer(player: PlayerType) {
  if (!player || !player.id || !player.name)
    return false;
  return true;
}

export function validateMatch(match: MatchType) {
  console.log("match here ... ", match);
  if (
    !match ||
    !match.roomId ||
    !validatePlayer(match.leftPlayer) ||
    !validatePlayer(match.rightPlayer)
  )
    return false;
  return true;
}