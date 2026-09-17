import type {
  ReactNode,
} from "react";
export const dynamic =
  "force-dynamic";

import ExpertDashboardShell from "@/components/expert/ExpertDashboardShell";

import {
  requireRole,
} from "@/lib/require-role";

export default async function ExpertLayout({
  children,
}: {
  children:
    ReactNode;
}) {
  await requireRole(
    "EXPERT"
  );

  return (
    <ExpertDashboardShell>
      {children}
    </ExpertDashboardShell>
  );
}