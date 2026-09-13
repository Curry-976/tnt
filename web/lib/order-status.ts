export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  processing: "En préparation",
  shipped: "Expédiée",
  cancelled: "Annulée",
};

export function orderStatusLabel(status: string) {
  return ORDER_STATUS_LABELS[status] ?? status;
}
