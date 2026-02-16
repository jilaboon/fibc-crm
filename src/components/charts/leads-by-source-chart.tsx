"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const sourceColors: Record<string, string> = {
  manual: "#579bfc",
  referral: "#00c875",
};

const sourceLabels: Record<string, string> = {
  manual: "ידני",
  referral: "הפניה",
};

type Props = {
  data: { source: string | null; _count: number }[];
};

export function LeadsBySourceChart({ data }: Props) {
  const total = data.reduce((sum, item) => sum + item._count, 0);
  const chartData = data.map((item) => ({
    name: sourceLabels[item.source || "manual"] || item.source || "ידני",
    value: item._count,
    color: sourceColors[item.source || "manual"] || "#676879",
    percent: total > 0 ? Math.round((item._count / total) * 100) : 0,
  }));

  return (
    <div className="flex flex-col items-center h-[300px]">
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [value, "כמות"]}
              contentStyle={{ direction: "rtl" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-6 text-sm text-[#323338]">
        {chartData.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.name} ({item.percent}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
