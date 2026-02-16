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

const stageColors: Record<string, string> = {
  Negotiation: "#fdab3d",
  Contract: "#a25ddc",
  ClosedWon: "#00c875",
  ClosedLost: "#e2445c",
};

const stageLabels: Record<string, string> = {
  Negotiation: "משא ומתן",
  Contract: "חוזה",
  ClosedWon: "נסגר",
  ClosedLost: "הפסד",
};

type Props = {
  data: { stage: string; _count: number }[];
};

export function DealPipelineChart({ data }: Props) {
  const chartData = data.map((item) => ({
    name: stageLabels[item.stage] || item.stage,
    count: item._count,
    color: stageColors[item.stage] || "#676879",
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value) => [value, "כמות"]}
          contentStyle={{ direction: "rtl" }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={50}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
