const statusClasses: Record<string, string> = {
  New: "monday-status monday-status-new",
  Contacted: "monday-status monday-status-contacted",
  Qualified: "monday-status monday-status-qualified",
  Matched: "monday-status monday-status-matched",
  Meeting1: "monday-status monday-status-meeting1",
  Meeting2: "monday-status monday-status-meeting2",
  Negotiation: "monday-status monday-status-negotiation",
  Registration: "monday-status monday-status-registration",
  Contract: "monday-status monday-status-contract",
  ClosedWon: "monday-status monday-status-closedwon",
  ClosedLost: "monday-status monday-status-closedlost",
  NotRelevant: "monday-status monday-status-notrelevant",
};

const statusLabels: Record<string, string> = {
  New: "חדש",
  Contacted: "נוצר קשר",
  Qualified: "מתאים",
  Matched: "שויך",
  Meeting1: "פגישה 1",
  Meeting2: "פגישה 2",
  Negotiation: "משא ומתן",
  Registration: "הרשמה",
  Contract: "חוזה",
  ClosedWon: "נסגר בהצלחה",
  ClosedLost: "נסגר ללא הצלחה",
  NotRelevant: "לא רלוונטי",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={statusClasses[status] || "monday-status"}>
      {statusLabels[status] || status}
    </span>
  );
}
