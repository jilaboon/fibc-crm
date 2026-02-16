"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Props = {
  data: {
    id: string;
    fullName: string;
    totalReferrals: number;
    closedDeals: number;
  }[];
};

export function TopAmbassadorsChart({ data }: Props) {
  const chartData = data.map((amb) => ({
    name: amb.fullName,
    referrals: amb.totalReferrals,
    closed: amb.closedDeals,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis type="number" allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={100}
          tick={{ fontSize: 13 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={{ direction: "rtl" }} />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: 13 }}>
              {value === "referrals" ? "הפניות" : "נסגרו"}
            </span>
          )}
        />
        <Bar
          dataKey="referrals"
          name="referrals"
          fill="#0073ea"
          radius={[0, 4, 4, 0]}
          barSize={20}
        />
        <Bar
          dataKey="closed"
          name="closed"
          fill="#00c875"
          radius={[0, 4, 4, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
