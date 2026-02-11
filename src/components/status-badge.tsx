const statusClasses: Record<string, string> = {
  New: "monday-status monday-status-new",
  Contacted: "monday-status monday-status-contacted",
  Qualified: "monday-status monday-status-qualified",
  Matched: "monday-status monday-status-matched",
  ClosedWon: "monday-status monday-status-closedwon",
  ClosedLost: "monday-status monday-status-closedlost",
  Negotiation: "monday-status monday-status-negotiation",
  Contract: "monday-status monday-status-contract",
};

const statusLabels: Record<string, string> = {
  New: "חדש",
  Contacted: "נוצר קשר",
  Qualified: "מתאים",
  Matched: "הותאם",
  ClosedWon: "נסגר בהצלחה",
  ClosedLost: "נסגר ללא הצלחה",
  Negotiation: "משא ומתן",
  Contract: "חוזה",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={statusClasses[status] || "monday-status"}>
      {statusLabels[status] || status}
    </span>
  );
}
