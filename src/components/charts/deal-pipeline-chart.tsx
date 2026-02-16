"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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
      <BarChart data={chartData} margin={{ top: 5, right: 40, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 13 }} />
        <YAxis allowDecimals={false} orientation="right" width={30} />
        <Tooltip
          formatter={(value) => [value, "כמות"]}
          contentStyle={{ direction: "rtl" }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
