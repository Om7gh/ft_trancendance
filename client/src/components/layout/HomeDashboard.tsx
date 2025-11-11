import MyGamesHistory from "../ui/dashboard/MyGamesHistory";
import PlayerChart from "../ui/dashboard/PlayerChart";
import PlayerStatistics from "../ui/dashboard/PlayerStatictics";
import TopPlayers from "../ui/dashboard/TopPlayers";

export default function HomeDashboard() {
  return (
    <div className="h-full p-5 space-y-6 overflow-scroll">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlayerChart />
        <PlayerStatistics />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <MyGamesHistory />
        <TopPlayers />
      </div>
    </div>
  );
}
