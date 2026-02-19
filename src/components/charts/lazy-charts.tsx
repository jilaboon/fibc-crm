"use client";

import dynamic from "next/dynamic";

export const LeadsByStatusChart = dynamic(
  () =>
    import("./leads-by-status-chart").then((m) => m.LeadsByStatusChart),
  { ssr: false }
);

export const LeadsBySourceChart = dynamic(
  () =>
    import("./leads-by-source-chart").then((m) => m.LeadsBySourceChart),
  { ssr: false }
);

export const DealPipelineChart = dynamic(
  () =>
    import("./deal-pipeline-chart").then((m) => m.DealPipelineChart),
  { ssr: false }
);

export const TopAmbassadorsChart = dynamic(
  () =>
    import("./top-ambassadors-chart").then((m) => m.TopAmbassadorsChart),
  { ssr: false }
);
