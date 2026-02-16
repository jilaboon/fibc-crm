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
    <div className="flex items-stretch h-[300px]">
      <div className="flex flex-col justify-around py-6 pl-4 text-sm text-[#323338] min-w-[100px] text-left">
        {chartData.map((item, i) => (
          <span key={i}>{item.name}</span>
        ))}
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 25 }}>
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" hide />
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
              barSize={16}
            />
            <Bar
              dataKey="closed"
              name="closed"
              fill="#00c875"
              radius={[0, 4, 4, 0]}
              barSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
