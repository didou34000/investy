"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function ResultChart({ allocation }: { allocation: Record<string, number> }) {
  const data = Object.entries(allocation).map(([name, value]) => ({ name, value }));
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie dataKey="value" data={data} innerRadius={60} outerRadius={90}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

