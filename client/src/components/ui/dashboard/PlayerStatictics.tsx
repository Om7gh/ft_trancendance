import ChessTodayStatistic from "../game/ChessTodayStatistic";
import PongTodayStatistic from "./PongTodayStatistic";

export default function PlayerStatistics({type}: {type: string}) {
  if (type === "chess") {

    return (
      <ChessTodayStatistic />
    )
  } else
      return <PongTodayStatistic />
}
