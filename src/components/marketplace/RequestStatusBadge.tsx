"use client";

import type { PurchaseRequestStatus } from "@/types/marketplace";

interface RequestStatusBadgeProps {
  status: PurchaseRequestStatus;
}

export default function RequestStatusBadge({
  status,
}: RequestStatusBadgeProps) {
  const styles: Record<
    PurchaseRequestStatus,
    string
  > = {
    PENDING:
      "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED:
      "bg-blue-50 text-blue-700 border-blue-200",
    REJECTED:
      "bg-red-50 text-red-700 border-red-200",
    PROCESSING:
      "bg-violet-50 text-violet-700 border-violet-200",
    COMPLETED:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}