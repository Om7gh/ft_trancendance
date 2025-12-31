import { useMobile } from "@/hooks/useMobile";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

function PongChart({gameState}) {
    const data = [
      { name: 'Wins', value: gameState?.wins, color: '#00E5FF' },
      { name: 'Losses', value: gameState?.loses, color: '#8A2BE2' },
    ];
  
    const isMobile = useMobile()
    return (
      <div className="flex w-full justify-center items-center gap-8 p-4 bg-slate-800/30  border border-slate-700">
        {
          !isMobile &&
          <div className="space-y-4 min-w-30">
        {data.map((item) => (
          <div key={item?.name} className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full block"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-300 capitalize">
              {item?.name}:{' '}
              <span className="font-bold text-white">{item?.value}</span>
            </span>
          </div>
        ))}
      </div>
      }

      <ResponsiveContainer width={"100%"} height={200}>
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
            animationEasing="ease-out"
            >
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
    </div>)
}

export default PongChart