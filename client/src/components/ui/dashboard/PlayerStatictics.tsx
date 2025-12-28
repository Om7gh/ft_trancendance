export default function PlayerStatistics({type}: {type: string}) {
  console.log(type)
  return (
    <div className="p-4 bg-slate-800/30  border border-slate-700">
      <h3 className="text-lg font-medium text-slate-300 mb-4">
        Today's <span className="text-neon">Statistics</span>
      </h3>
      <p className="text-slate-200 opacity-40 text-center">
        No Activitis for today
      </p>
    </div>
  );
}
