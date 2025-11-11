import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const data = [
  { name: "Wins", value: 55, color: "#0d9488" },
  { name: "Losses", value: 44, color: "#f97316" },
  { name: "Draws", value: 2, color: "rgba(46, 46, 53, 0.85)" },
];

export default function PlayerChart() {
  return (
    <div className="flex items-center gap-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700">
      <div className="space-y-4 min-w-[120px]">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full block"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-300 capitalize">
              {item.name}:{" "}
              <span className="font-bold text-white">{item.value}%</span>
            </span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="70%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            animationDuration={1000}
            animationEasing="ease-out">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value) => (
              <span className="text-slate-300 text-xs">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
