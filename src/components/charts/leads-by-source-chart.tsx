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
  const chartData = data.map((item) => ({
    name: sourceLabels[item.source || "manual"] || item.source || "ידני",
    value: item._count,
    color: sourceColors[item.source || "manual"] || "#676879",
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={90}
          dataKey="value"
          label={({ name, percent, x, y, textAnchor }) => (
            <text
              x={x}
              y={y}
              textAnchor={textAnchor}
              dominantBaseline="central"
              fontSize={13}
              fill="#323338"
            >
              {`${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
            </text>
          )}
          labelLine={true}
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [value, "כמות"]}
          contentStyle={{ direction: "rtl" }}
        />
        <Legend
          formatter={(value) => <span style={{ fontSize: 13 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
