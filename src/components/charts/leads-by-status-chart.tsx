"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const statusColors: Record<string, string> = {
  New: "#579bfc",
  Contacted: "#fdab3d",
  Qualified: "#a25ddc",
  Matched: "#0073ea",
  ClosedWon: "#00c875",
  ClosedLost: "#e2445c",
};

const statusLabels: Record<string, string> = {
  New: "חדש",
  Contacted: "נוצר קשר",
  Qualified: "מתאים",
  Matched: "שויך",
  ClosedWon: "נסגר בהצלחה",
  ClosedLost: "נסגר ללא הצלחה",
};

type Props = {
  data: { status: string; _count: number }[];
};

export function LeadsByStatusChart({ data }: Props) {
  const chartData = data.map((item) => ({
    name: statusLabels[item.status] || item.status,
    count: item._count,
    color: statusColors[item.status] || "#676879",
  }));

  return (
    <div className="flex items-stretch h-[300px]">
      <div className="flex flex-col justify-around py-6 pl-4 text-sm text-[#323338] min-w-[100px] text-left">
        {chartData.map((item, i) => (
          <span key={i}>{item.name}</span>
        ))}
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              formatter={(value) => [value, "כמות"]}
              contentStyle={{ direction: "rtl" }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
