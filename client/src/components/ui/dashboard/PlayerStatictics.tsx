import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const lineData = [
  { match: "karim", score: 2400, win: true },
  { match: "hamza", score: 2700, win: true },
  { match: "abdlah001", score: 1000, win: false },
  { match: "simoha", score: 400, win: false },
  { match: "kkka", score: 3200, win: true },
];

export default function PlayerStatistics() {
  return (
    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700">
      <h3 className="text-lg font-medium text-slate-300 mb-4">
        Weekly Performance <span className="text-orange-500">Trend</span>
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={lineData}>
          <XAxis
            dataKey="match"
            tick={{ fill: "#94a3b8" }}
            axisLine={{ stroke: "#475569" }}
          />
          <YAxis tick={{ fill: "#94a3b8" }} axisLine={{ stroke: "#475569" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              borderColor: "#475569",
              borderRadius: "0.5rem",
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#0d9488"
            strokeWidth={2}
            dot={{
              r: 5,
              fill: ({ win }) => (win ? "#0d9488" : "#f97316"),
              strokeWidth: 2,
            }}
            activeDot={{ r: 6, fill: "#cacaca", stroke: "#0d9488" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
